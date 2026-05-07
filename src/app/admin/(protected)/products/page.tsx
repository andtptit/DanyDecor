import { Plus, Search, MoreVertical, Edit, Trash } from "lucide-react";
import prisma from '@/lib/prisma'
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  async function deleteProduct(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.product.delete({ where: { id } })
      revalidatePath('/admin/products')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2">Quản lý Sản Phẩm</h1>
          <p className="text-gray-500 text-sm">Thêm, sửa, xóa và quản lý danh sách tranh nghệ thuật.</p>
        </div>
        <Link href="/admin/products/create" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full bg-soft-gray border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-soft-gray/50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-3xl">Sản Phẩm</th>
              <th className="px-6 py-4">Danh Mục</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Nổi Bật</th>
              <th className="px-6 py-4 text-right rounded-tr-3xl">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-soft-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                      {prod.images && prod.images.length > 0 ? (
                        <img src={prod.images[0]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-dark mb-1">{prod.name}</p>
                      <p className="text-xs text-gray-400">/{prod.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{prod.category?.name || '-'}</td>
                <td className="px-6 py-4 font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                </td>
                <td className="px-6 py-4">
                  {prod.isFeatured ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-600">Có</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-400">Không</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${prod.id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={prod.id} />
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                        <Trash className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
