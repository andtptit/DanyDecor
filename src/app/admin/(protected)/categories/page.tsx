import prisma from '@/lib/prisma'
import { Edit, Trash } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  }).catch(() => []) // Handle case where DB is not ready

  async function deleteCategory(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.category.delete({ where: { id } })
      revalidatePath('/admin/categories')
    }
  }

  async function createCategory(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    // Auto-generate slug from name
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    
    if (name) {
      await prisma.category.create({
        data: { name, slug, description }
      })
      revalidatePath('/admin/categories')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2">Danh Mục</h1>
          <p className="text-gray-500 text-sm">Quản lý các danh mục tranh và trang trí.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm mới */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-dark mb-4">Thêm danh mục mới</h2>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Tên danh mục</label>
              <input name="name" required type="text" className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="VD: Tranh Tráng Gương" />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Mô tả</label>
              <textarea name="description" rows={3} className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Mô tả danh mục..."></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
              Thêm Mới
            </button>
          </form>
        </div>

        {/* Danh sách */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-soft-gray/50 text-gray-500 uppercase tracking-widest text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Tên & Slug</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-soft-gray/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-dark">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories/${cat.id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
                        <button type="submit" className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                          <Trash className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Chưa có danh mục nào. Hãy thêm mới bên trái.
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
