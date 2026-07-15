import { Plus } from "lucide-react";
import prisma from '@/lib/prisma'
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ProductFilter from "@/components/admin/ProductFilter";
import ProductTableClient from "@/components/admin/ProductTableClient";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { deleteImagesFromStorage } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

export default async function ProductsAdminPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || '1') || 1);

  const where = {
    AND: [
      q ? { name: { contains: q, mode: 'insensitive' as const } } : {},
      category ? { categoryId: category } : {}
    ]
  };

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          include: { parent: true }
        },
        sizes: true
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }).catch(() => []),
    prisma.product.count({ where }).catch(() => 0),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    }).catch(() => [])
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : '/admin/products';
  };

  async function deleteProduct(formData: FormData) {
    'use server'
    await requireAdmin()
    const id = formData.get('id') as string
    if (!id) return { success: false, error: 'Thiếu ID sản phẩm' }

    try {
      // 1. Tìm sản phẩm để lấy danh sách ảnh
      const product = await prisma.product.findUnique({
        where: { id },
        select: { images: true }
      });

      if (product && product.images && product.images.length > 0) {
        // 2. Xóa ảnh khỏi Storage
        await deleteImagesFromStorage(product.images);
      }

      // 3. Xóa sản phẩm khỏi DB
      await prisma.product.delete({ where: { id } })
      revalidatePath('/admin/products')
      revalidatePath('/')
      revalidatePath('/shop')
      return { success: true }
    } catch (error) {
      console.error('Delete product error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' }
    }
  }

  async function toggleFeatured(formData: FormData) {
    'use server'
    await requireAdmin()
    const id = formData.get('id') as string
    const next = formData.get('featured') === 'true'
    if (!id) return { success: false, error: 'Thiếu ID sản phẩm' }
    try {
      await prisma.product.update({ where: { id }, data: { isFeatured: next } })
      revalidatePath('/admin/products')
      revalidatePath('/')
      return { success: true }
    } catch (error) {
      console.error('Toggle featured error:', error)
      return { success: false, error: 'Không thể cập nhật trạng thái nổi bật' }
    }
  }

  async function bulkAction(formData: FormData) {
    'use server'
    await requireAdmin()
    const op = formData.get('op') as string
    const ids = JSON.parse((formData.get('ids') as string) || '[]') as string[]
    if (!ids.length) return { success: false, error: 'Chưa chọn sản phẩm nào' }

    try {
      if (op === 'delete') {
        const products = await prisma.product.findMany({
          where: { id: { in: ids } },
          select: { images: true },
        })
        const allImages = products.flatMap((p) => p.images)
        if (allImages.length > 0) await deleteImagesFromStorage(allImages)
        await prisma.product.deleteMany({ where: { id: { in: ids } } })
      } else if (op === 'feature' || op === 'unfeature') {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { isFeatured: op === 'feature' },
        })
      } else {
        return { success: false, error: 'Thao tác không hợp lệ' }
      }
      revalidatePath('/admin/products')
      revalidatePath('/')
      revalidatePath('/shop')
      return { success: true, count: ids.length }
    } catch (error) {
      console.error('Bulk action error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi thực hiện thao tác hàng loạt' }
    }
  }

  return (
    <div>
      <AdminBreadcrumb items={[{ label: 'Quản lý sản phẩm' }]} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2 flex items-center gap-4">
            Quản lý Sản Phẩm
            <span className="text-sm font-sans font-normal bg-soft-gray text-gray-500 px-3 py-1 rounded-full border border-gray-100">
              {totalCount} sản phẩm
            </span>
          </h1>
          <p className="text-gray-500 text-sm">Thêm, sửa, xóa và quản lý danh sách tranh nghệ thuật.</p>
        </div>
        <Link href="/admin/products/create" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Bộ lọc sản phẩm */}
        <ProductFilter categories={categories} totalResults={totalCount} />
        
        <ProductTableClient
          products={products}
          deleteProduct={deleteProduct}
          toggleFeatured={toggleFeatured}
          bulkAction={bulkAction}
        />

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Trang <span className="font-bold text-dark">{currentPage}</span> / {totalPages}
              <span className="text-gray-300"> · {totalCount} sản phẩm</span>
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className="h-8 px-3 flex items-center rounded-lg text-xs font-bold bg-white border border-gray-100 text-dark hover:bg-soft-gray transition-colors"
                >
                  Trước
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildPageHref(p)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${p === currentPage ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-dark hover:bg-soft-gray'}`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className="h-8 px-3 flex items-center rounded-lg text-xs font-bold bg-white border border-gray-100 text-dark hover:bg-soft-gray transition-colors"
                >
                  Sau
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
