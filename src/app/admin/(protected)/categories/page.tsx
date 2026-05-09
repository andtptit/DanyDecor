import prisma from '@/lib/prisma'
import { Edit, ChevronRight, CornerDownRight } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import ConfirmSubmitForm from '@/components/admin/ConfirmSubmitForm'
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton'
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb'

export const dynamic = 'force-dynamic'

export default async function CategoriesAdminPage() {
  // Fetch all categories with their parent/child info
  const allCategories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } }
    },
    orderBy: { name: 'asc' }
  }).catch(() => [])

  // Filter root categories for the list and dropdown
  const rootCategories = allCategories.filter(cat => cat.parentId === null || cat.parentId === '')

  async function deleteCategory(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (!id) return { success: false, error: 'Thiếu ID danh mục' }

    try {
      // 1. Kiểm tra xem có danh mục con không
      const childrenCount = await prisma.category.count({
        where: { parentId: id }
      })

      if (childrenCount > 0) {
        return { 
          success: false, 
          error: `Không thể xóa vì danh mục này đang có ${childrenCount} danh mục con. Hãy xóa hoặc chuyển danh mục con trước.` 
        }
      }

      // 2. Kiểm tra xem có sản phẩm không
      const productsCount = await prisma.product.count({
        where: { categoryId: id }
      })

      if (productsCount > 0) {
        return { 
          success: false, 
          error: `Không thể xóa vì danh mục đang có ${productsCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.` 
        }
      }

      // 3. Nếu mọi thứ ổn, tiến hành xóa
      await prisma.category.delete({ where: { id } })
      revalidatePath('/admin/categories')
      return { success: true }
    } catch (error) {
      console.error('Delete category error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi xóa danh mục' }
    }
  }

  async function createCategory(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const parentId = formData.get('parentId') as string
    
    // Auto-generate slug from name
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    
    // Get image
    const imagesStr = formData.get('image') as string
    const image = imagesStr ? imagesStr.split(',')[0].trim() : null // Chỉ lấy ảnh đầu tiên
    
    if (name) {
      await prisma.category.create({
        data: { 
          name, 
          slug, 
          description, 
          parentId: parentId || null,
          image
        }
      })
      revalidatePath('/admin/categories')
    }
  }

  return (
    <div>
      <AdminBreadcrumb items={[{ label: 'Quản lý danh mục' }]} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2">Quản Lý Danh Mục</h1>
          <p className="text-gray-500 text-sm">Thêm mới danh mục gốc hoặc danh mục con để phân loại sản phẩm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm mới */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-dark mb-4">Thêm danh mục mới</h2>
          <ConfirmSubmitForm action={createCategory} message="Bạn có chắc chắn muốn thêm danh mục này không?" className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Tên danh mục *</label>
              <input name="name" required type="text" className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="VD: Tranh Tráng Gương" />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Danh mục cha (Không chọn = Gốc)</label>
              <select 
                name="parentId" 
                className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">-- Là danh mục gốc --</option>
                {rootCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Ảnh danh mục (Chỉ dành cho danh mục gốc hiển thị ở trang chủ)</label>
              <ImageUploader name="image" maxImages={1} />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Mô tả</label>
              <textarea name="description" rows={3} className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Mô tả danh mục..."></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
              Thêm Mới
            </button>
          </ConfirmSubmitForm>
        </div>

        {/* Danh sách */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-soft-gray/50 text-gray-500 uppercase tracking-widest text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tên & Phân cấp</th>
                <th className="px-6 py-4">Số sản phẩm</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rootCategories.map((root: any) => (
                <React.Fragment key={root.id}>
                  {/* Root Row */}
                  <tr className="hover:bg-soft-gray/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <div>
                          <p className="font-bold text-dark">{root.name}</p>
                          <p className="text-[10px] text-gray-400">/{root.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{root._count?.products ?? 0} SP</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/categories/${root.id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteCategoryButton 
                          categoryId={root.id} 
                          categoryName={root.name} 
                          onDelete={deleteCategory} 
                        />
                      </div>
                    </td>
                  </tr>
                  {/* Children Rows */}
                  {root.children.map((child: any) => (
                    <tr key={child.id} className="bg-gray-50/30 hover:bg-soft-gray transition-colors group">
                      <td className="px-6 py-3 pl-12">
                        <div className="flex items-center gap-2 text-gray-500">
                          <CornerDownRight className="w-4 h-4 text-gray-300" />
                          <div>
                            <p className="font-medium text-sm text-dark">{child.name}</p>
                            <p className="text-[10px] text-gray-400">/{child.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-400 italic">
                        {allCategories.find(c => c.id === child.id)?._count?.products ?? 0} SP
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/categories/${child.id}/edit`} className="p-1.5 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <DeleteCategoryButton 
                            categoryId={child.id} 
                            categoryName={child.name} 
                            onDelete={deleteCategory} 
                            isSmall 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {allCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
