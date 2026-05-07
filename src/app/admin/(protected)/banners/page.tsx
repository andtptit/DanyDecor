import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Trash, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

export const dynamic = 'force-dynamic';

export default async function BannersAdminPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  async function createBanner(formData: FormData) {
    'use server'
    const image = formData.get('image') as string
    const link = formData.get('link') as string

    if (image) {
      await prisma.banner.create({
        data: { image, link: link || null, isActive: true }
      })
      revalidatePath('/admin/banners')
    }
  }

  async function toggleBanner(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const current = formData.get('current') === 'true'
    if (id) {
      await prisma.banner.update({ where: { id }, data: { isActive: !current } })
      revalidatePath('/admin/banners')
    }
  }

  async function deleteBanner(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.banner.delete({ where: { id } })
      revalidatePath('/admin/banners')
    }
  }

  const activeBanners = banners.filter((b: any) => b.isActive).length

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2">Quản lý Banner</h1>
          <p className="text-gray-500 text-sm">
            Quản lý các banner hiển thị trên trang chủ.
            <span className="ml-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeBanners} đang hiển thị
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form thêm banner */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-dark mb-4">Thêm Banner Mới</h2>
          <form action={createBanner} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Ảnh Banner</label>
              <ImageUploader name="image" maxImages={1} />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">
                Link khi bấm vào
                <span className="ml-1 text-xs font-normal text-gray-400">(tuỳ chọn)</span>
              </label>
              <input
                name="link"
                type="url"
                placeholder="https://..."
                className="w-full bg-soft-gray border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
            >
              Thêm Banner
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {banners.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-soft-gray rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 font-medium">Chưa có banner nào</p>
              <p className="text-gray-400 text-sm mt-1">Thêm banner đầu tiên từ form bên trái</p>
            </div>
          ) : (
            banners.map((banner: any) => (
              <div
                key={banner.id}
                className={`bg-white rounded-[1.5rem] border shadow-sm overflow-hidden transition-all ${banner.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-40 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img src={banner.image} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 py-4 pr-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${banner.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {banner.isActive ? 'Đang hiện' : 'Ẩn'}
                          </span>
                        </div>
                        {banner.link ? (
                          <p className="text-xs text-gray-400 truncate">
                            🔗 <a href={banner.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{banner.link}</a>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Không có link</p>
                        )}
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(banner.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Toggle */}
                        <form action={toggleBanner}>
                          <input type="hidden" name="id" value={banner.id} />
                          <input type="hidden" name="current" value={String(banner.isActive)} />
                          <button
                            type="submit"
                            title={banner.isActive ? 'Ẩn banner' : 'Hiện banner'}
                            className={`p-2 rounded-lg border transition-colors ${banner.isActive ? 'text-green-500 border-green-100 bg-green-50 hover:bg-green-100' : 'text-gray-400 border-gray-100 bg-white hover:bg-soft-gray'}`}
                          >
                            {banner.isActive
                              ? <ToggleRight className="w-5 h-5" />
                              : <ToggleLeft className="w-5 h-5" />
                            }
                          </button>
                        </form>

                        {/* Delete */}
                        <form action={deleteBanner}>
                          <input type="hidden" name="id" value={banner.id} />
                          <button
                            type="submit"
                            title="Xóa banner"
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

