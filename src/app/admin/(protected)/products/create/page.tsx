import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import RichTextEditor from '@/components/admin/RichTextEditor'

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany().catch(() => [])

  async function createProduct(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    const price = parseInt(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseInt(formData.get('originalPrice') as string) : null
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const isFeatured = formData.get('isFeatured') === 'on'
    
    // Images are comma-separated URLs from ImageUploader hidden input
    const imagesStr = formData.get('images') as string
    const images = imagesStr ? imagesStr.split(',').map(s => s.trim()).filter(Boolean) : []

    if (name && price && categoryId) {
      await prisma.product.create({
        data: {
          name,
          slug,
          price,
          originalPrice,
          description,
          categoryId,
          isFeatured,
          images
        }
      })
      redirect('/admin/products')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-dark font-serif mb-2">Thêm Sản Phẩm Mới</h1>
        <p className="text-gray-500 text-sm">Điền thông tin chi tiết để đăng bán sản phẩm.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 max-w-3xl">
        <form action={createProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Tên sản phẩm *</label>
              <input name="name" required type="text" className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="VD: Tranh Canvas Hiện Đại" />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Danh mục *</label>
              <select name="categoryId" required className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Chọn danh mục</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Giá bán (VNĐ) *</label>
              <input name="price" required type="number" min="0" className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="VD: 500000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Giá gốc (VNĐ)</label>
              <input name="originalPrice" type="number" min="0" className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Chỉ điền nếu có giảm giá" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-bold text-dark mb-3">
              Hình ảnh sản phẩm
              <span className="ml-2 text-xs font-normal text-gray-400">(Tối đa 6 ảnh, mỗi ảnh ≤ 5MB)</span>
            </label>
            <ImageUploader name="images" maxImages={6} />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">Mô tả sản phẩm</label>
            <RichTextEditor name="description" placeholder="Chi tiết sản phẩm: chất liệu, kích thước, phong cách..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isFeatured" id="isFeatured" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="isFeatured" className="text-sm font-bold text-dark cursor-pointer">
              Đánh dấu là Sản phẩm nổi bật (Hiển thị ở trang chủ)
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Link href="/admin/products" className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-soft-gray transition-colors">Hủy</Link>
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-md">
              Lưu Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
