"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Image from "next/image";

import { slides } from "./data";

export default function LogoShowcase() {
  return (
    <div className="mt-10 lg:flex lg:items-center lg:gap-14 lg:px-8">
      <div className="mb-5 px-5 text-center md:px-0 lg:mb-0 lg:flex-1/4 lg:text-left">
        <p className="text-lg lg:text-base">Trusted by industry leaders</p>
      </div>
      <div className="relative before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-full before:bg-gradient-to-r before:from-white before:via-transparent before:to-white lg:w-3/4 lg:flex-3/4">
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
