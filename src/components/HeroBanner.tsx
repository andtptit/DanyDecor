"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

interface Banner {
  id: string;
  image: string;
  link: string | null;
}

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const defaultImage = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop";

  if (!banners || banners.length === 0) {
    return (
      <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-[12px] border-white bg-white">
        <img
          src={defaultImage}
          alt="Hero Image Default"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-[12px] border-white bg-white">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {banner.link ? (
              <a href={banner.link} className="block w-full h-full">
                <img
                  src={banner.image}
                  alt="Banner Image"
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={banner.image}
                alt="Banner Image"
                className="w-full h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
