import { Settings as SettingsIcon, Save, Phone, MessageCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-dark font-serif mb-2">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-500 text-sm">Quản lý cấu hình website và thông tin liên hệ.</p>
      </div>

      <div className="grid gap-8">
        {/* Thông tin liên hệ */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" /> Thông tin liên hệ (Zalo/Hotline)
          </h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Số điện thoại Zalo</label>
                <input 
                  type="text" 
                  placeholder="09xx xxx xxx"
                  className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Link Messenger Facebook</label>
                <input 
                  type="text" 
                  placeholder="https://m.me/yourpage"
                  className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Địa chỉ cửa hàng</label>
              <textarea 
                rows={3}
                placeholder="Số 123, đường ABC..."
                className="w-full bg-soft-gray border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              ></textarea>
            </div>

            <button 
              type="button"
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" /> Lưu cấu hình
            </button>
          </form>
        </div>

        {/* Cấu hình SEO & Website */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-primary" /> Cấu hình Website
          </h2>
          
          <div className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-soft-gray/30 rounded-2xl">
               <div>
                 <p className="font-bold text-dark text-sm">Chế độ bảo trì</p>
                 <p className="text-xs text-gray-400">Tạm thời đóng cửa hàng công khai</p>
               </div>
               <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
               </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-soft-gray/30 rounded-2xl">
               <div>
                 <p className="font-bold text-dark text-sm">Thông báo trang chủ</p>
                 <p className="text-xs text-gray-400">Hiển thị thanh thông báo khuyến mãi trên cùng</p>
               </div>
               <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
