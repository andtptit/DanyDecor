import prisma from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } }).catch(() => null)

  if (!category) notFound()

  async function updateCategory(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")

    if (name) {
      await prisma.category.update({
        where: { id },
        data: { name, slug, description }
      })
      revalidatePath('/admin/categories')
      redirect('/admin/categories')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/categories" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục
        </Link>
        <h1 className="text-3xl font-bold text-dark font-serif mb-2">Chỉnh Sửa Danh Mục</h1>
        <p className="text-gray-500 text-sm">Cập nhật thông tin cho danh mục <span className="font-semibold text-dark">{category.name}</span></p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 max-w-xl">
        <form action={updateCategory} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Tên danh mục *</label>
            <input name="name" required type="text" defaultValue={category.name} className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Mô tả</label>
            <textarea name="description" rows={4} defaultValue={category.description ?? ''} className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Mô tả danh mục..." />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">Slug: <span className="font-mono text-gray-500">/{category.slug}</span></p>
            <div className="flex gap-3">
              <Link href="/admin/categories" className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-soft-gray transition-colors">Hủy</Link>
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-md">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
