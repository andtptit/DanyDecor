import prisma from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import RichTextEditor from '@/components/admin/RichTextEditor'
import CategorySubCategorySelect from '@/components/admin/CategorySubCategorySelect'
import ProductSizeInput from '@/components/admin/ProductSizeInput'
import { revalidatePath } from 'next/cache'
import ConfirmSubmitForm from '@/components/admin/ConfirmSubmitForm'
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { sizes: true } }).catch(() => null),
    prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    }).catch(() => []),
  ])

  if (!product) notFound()

  async function updateProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    const price = parseInt(formData.get('price') as string) || 0
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const isFeatured = formData.get('isFeatured') === 'on'
    const imagesStr = formData.get('images') as string
    const images = imagesStr ? imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean) : []

    const sizesJSON = formData.get('sizesJSON') as string
    const sizes = sizesJSON ? JSON.parse(sizesJSON) : []

    // Find base price (lowest valid price from sizes)
    const validPrices = sizes.filter((s: any) => s.price !== null).map((s: any) => s.price)
    const basePrice = validPrices.length > 0 ? Math.min(...validPrices) : 0

    if (name && categoryId) {
      // First, delete existing sizes for this product to avoid complex diffing
      await prisma.productSize.deleteMany({
        where: { productId: id }
      })

      await prisma.product.update({
        where: { id },
        data: { 
          name, 
          slug, 
          price: basePrice, 
          originalPrice: null, 
          description, 
          categoryId, 
          isFeatured, 
          images,
          sizes: {
            create: sizes.map((s: any) => ({
              name: s.name,
              price: s.price,
              originalPrice: s.originalPrice
            }))
          }
        }
      })
      revalidatePath('/admin/products')
      redirect('/admin/products')
    }
  }

  return (
    <div>
      <AdminBreadcrumb 
        items={[
          { label: 'Sản phẩm', href: '/admin/products' },
          { label: 'Chỉnh sửa' }
        ]} 
      />
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-dark font-serif mb-2">Chỉnh Sửa Sản Phẩm</h1>
        <p className="text-gray-500 text-sm">Cập nhật thông tin cho <span className="font-semibold text-dark">{product.name}</span></p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 max-w-3xl">
        <ConfirmSubmitForm action={updateProduct} message="Bạn có chắc chắn muốn lưu các thay đổi cho sản phẩm này không?" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Tên sản phẩm *</label>
              <input name="name" required type="text" defaultValue={product.name} className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <CategorySubCategorySelect 
              categories={categories} 
              initialCategoryId={product.categoryId}
            />

            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-full">
                <label className="block text-sm font-bold text-dark mb-2">Kích thước và Giá bán (VNĐ) *</label>
                <ProductSizeInput defaultSizes={product.sizes.map((s: any) => ({ name: s.name, price: s.price, originalPrice: s.originalPrice }))} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-3">
              Hình ảnh sản phẩm
              <span className="ml-2 text-xs font-normal text-gray-400">(Tối đa 6 ảnh, mỗi ảnh ≤ 5MB)</span>
            </label>
            <ImageUploader name="images" maxImages={6} initialImages={product.images ?? []} />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">Mô tả sản phẩm</label>
            <RichTextEditor name="description" defaultValue={product.description ?? ''} placeholder="Chi tiết sản phẩm: chất liệu, kích thước, phong cách..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={product.isFeatured} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="isFeatured" className="text-sm font-bold text-dark cursor-pointer">
              Đánh dấu là Sản phẩm nổi bật (Hiển thị ở trang chủ)
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">Slug: <span className="font-mono text-gray-500">/{product.slug}</span></p>
            <div className="flex gap-4">
              <Link href="/admin/products" className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-soft-gray transition-colors">Hủy</Link>
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-md">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </ConfirmSubmitForm>
      </div>
    </div>
  )
}
