"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Image from "next/image";

import { slides } from "./data";

export default function LogoShowcase() {
  return (
    <div className="mt-10">
      <div className="mb-5 text-center">
        <p className="text-lg">Trusted by industry leaders</p>
      </div>
      <div className="relative before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-full before:bg-gradient-to-r before:from-white before:via-transparent before:to-white">
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={5000}
          allowTouchMove={false}
          slidesPerView={2.5}
          spaceBetween={40}
          breakpoints={{
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Image
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                priority
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
