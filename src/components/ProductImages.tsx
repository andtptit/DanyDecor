"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductImages({ images = [] }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-soft-gray rounded-3xl lg:rounded-[3rem] flex items-center justify-center border border-gray-100">
        <p className="text-gray-400 font-medium text-sm text-center px-4">Chưa có ảnh sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Main Image Slider */}
      <div className="rounded-3xl lg:rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl lg:shadow-2xl bg-white">
        <Swiper
          spaceBetween={10}
          navigation={images.length > 1}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="aspect-square"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="px-2 lg:px-4">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-16 lg:h-24"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="w-full h-full rounded-xl lg:rounded-2xl overflow-hidden border-2 border-transparent transition-all [.swiper-slide-thumb-active_&]:border-primary shadow-sm bg-white">
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
