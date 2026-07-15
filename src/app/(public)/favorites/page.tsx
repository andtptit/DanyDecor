import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/settings";
import FavoritesList from "@/components/wishlist/FavoritesList";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích",
  description: "Danh sách các mẫu tranh bạn đã lưu tại DanyDecor.",
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  const { zaloPhone } = await getPublicSettings();

  return (
    <div className="bg-soft-gray/30 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 py-8 lg:py-12">
        <div className="container-custom">
          <h1 className="text-2xl lg:text-4xl font-bold text-dark font-serif">Yêu Thích</h1>
          <p className="text-gray-500 text-sm mt-2">
            Những mẫu tranh bạn đã lưu. Gửi danh sách qua Zalo để được tư vấn nhanh.
          </p>
        </div>
      </div>
      <FavoritesList zaloPhone={zaloPhone} />
    </div>
  );
}
