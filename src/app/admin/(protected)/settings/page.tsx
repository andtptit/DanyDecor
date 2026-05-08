import { Settings as SettingsIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settingsData = await prisma.setting.findMany().catch(() => []);
  
  const initialData = {
    zalo_phone: settingsData.find(s => s.key === 'NEXT_PUBLIC_ZALO_PHONE')?.value || process.env.NEXT_PUBLIC_ZALO_PHONE || '',
    hotline_phone: settingsData.find(s => s.key === 'HOTLINE_PHONE')?.value || process.env.HOTLINE_PHONE || '',
    messenger_url: settingsData.find(s => s.key === 'NEXT_PUBLIC_MESSENGER_URL')?.value || process.env.NEXT_PUBLIC_MESSENGER_URL || '',
    shop_address: settingsData.find(s => s.key === 'SHOP_ADDRESS')?.value || '',
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-dark font-serif mb-2">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-500 text-sm">Quản lý cấu hình website và thông tin liên hệ.</p>
      </div>

      <div className="grid gap-8">
        {/* Form cài đặt (Client Component) */}
        <SettingsForm initialData={initialData} />

        {/* Cấu hình SEO & Website (Mockup for now) */}
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

