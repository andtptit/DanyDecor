'use client'

import { useState } from "react"
import { Save, Phone, Trash2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react"
import { updateSettings, scanStorageAction, deleteFilesAction } from "./actions"
import LoadingScreen from "@/components/admin/LoadingScreen"

interface SettingsFormProps {
  initialData: {
    zalo_phone: string
    hotline_phone: string
    messenger_url: string
    shop_address: string
    highlight_1_text: string
    highlight_2_text: string
  }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [orphanedFiles, setOrphanedFiles] = useState<{ bucket: string; name: string; fullPath: string }[]>([])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    
    const result = await updateSettings(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Đã lưu cấu hình thành công!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' })
    }
    
    setLoading(false)
  }

  async function handleScan() {
    setCleanupLoading(true)
    setMessage(null)
    setOrphanedFiles([])
    
    try {
      const result = await scanStorageAction() as any
      if (result.success) {
        setOrphanedFiles(result.files)
        if (result.files.length === 0) {
          setMessage({ type: 'success', text: 'Tuyệt vời! Không tìm thấy ảnh rác nào.' })
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra khi quét' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server' })
    } finally {
      setCleanupLoading(false)
    }
  }

  async function handleDeleteSelected() {
    if (orphanedFiles.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${orphanedFiles.length} file này không?`)) return;

    setCleanupLoading(true)
    try {
      const result = await deleteFilesAction(orphanedFiles) as any
      if (result.success) {
        setMessage({ type: 'success', text: `Đã dọn dẹp thành công ${result.deletedCount} file!` })
        setOrphanedFiles([])
      } else {
        setMessage({ type: 'error', text: result.error || 'Lỗi khi xóa file' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server' })
    } finally {
      setCleanupLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
      <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-3">
        <Phone className="w-5 h-5 text-primary" /> Thông tin liên hệ (Zalo/Hotline)
      </h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}
      
      <form action={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Số điện thoại Zalo</label>
            <input 
              name="zalo_phone"
              type="text" 
              defaultValue={initialData.zalo_phone}
              placeholder="09xx xxx xxx"
              className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Số điện thoại Gọi điện (Hotline)</label>
            <input 
              name="hotline_phone"
              type="text" 
              defaultValue={initialData.hotline_phone}
              placeholder="09xx xxx xxx"
              className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Link Messenger Facebook</label>
            <input 
              name="messenger_url"
              type="text" 
              defaultValue={initialData.messenger_url}
              placeholder="https://m.me/yourpage"
              className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-dark mb-2">Địa chỉ cửa hàng</label>
          <textarea 
            name="shop_address"
            rows={3}
            defaultValue={initialData.shop_address}
            placeholder="Số 123, đường ABC..."
            className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>

        <div className="bg-soft-gray/30 p-6 rounded-[2rem] space-y-4">
          <h3 className="text-sm font-bold text-dark mb-2">Đặc điểm nổi bật (Hiển thị ở trang chi tiết sản phẩm)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Đặc điểm 1 (VD: Bảo hành)</label>
              <input 
                name="highlight_1_text"
                type="text" 
                defaultValue={initialData.highlight_1_text}
                className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Đặc điểm 2 (VD: Giao hàng)</label>
              <input 
                name="highlight_2_text"
                type="text" 
                defaultValue={initialData.highlight_2_text}
                className="w-full bg-white border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </form>

      {/* Maintenance Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-dark mb-2 flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-red-500" /> Bảo trì hệ thống
        </h2>
        <p className="text-sm text-gray-500 mb-6 italic">Dọn dẹp các file ảnh mồ côi trên Supabase Storage để tiết kiệm dung lượng và tăng tốc độ hệ thống.</p>
        
        <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center justify-between gap-6">
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Quét và dọn dẹp kho ảnh</h3>
                <p className="text-xs text-red-600/70 leading-relaxed">Hệ thống sẽ đối chiếu toàn bộ file trong Storage với dữ liệu. Bạn có thể xem danh sách trước khi xóa.</p>
              </div>
              <button 
                onClick={handleScan}
                disabled={cleanupLoading}
                className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
              >
                {cleanupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {cleanupLoading ? 'Đang quét...' : 'Quét rác ngay'}
              </button>
            </div>

            {/* List of orphaned files */}
            {orphanedFiles.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-red-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Tìm thấy {orphanedFiles.length} file không sử dụng
                  </span>
                  <button 
                    onClick={handleDeleteSelected}
                    className="text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xác nhận xóa tất cả
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 text-gray-400 uppercase font-bold sticky top-0">
                      <tr>
                        <th className="px-6 py-2">Thư mục</th>
                        <th className="px-6 py-2">Tên file</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orphanedFiles.map((file, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="px-6 py-2 text-gray-500 font-medium">{file.bucket}</td>
                          <td className="px-6 py-2 text-dark truncate max-w-[200px]">{file.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {cleanupLoading && <LoadingScreen message="Đang xử lý dữ liệu kho ảnh..." />}
    </div>
  )
}
