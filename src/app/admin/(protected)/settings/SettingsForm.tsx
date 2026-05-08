'use client'

import { useState } from "react"
import { Save, Phone } from "lucide-react"
import { updateSettings } from "./actions"

interface SettingsFormProps {
  initialData: {
    zalo_phone: string
    messenger_url: string
    shop_address: string
  }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
    </div>
  )
}
