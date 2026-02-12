"use client"; // مهم ليصبح Client Component

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import MovieCard from "./MovieCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface MovieSectionProps {
  title: string;
  link: string;
  contents: any[];
  type: string;
}

export default function MovieSection({
  title,
  link,
  contents,
  type,
}: MovieSectionProps) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";

  const data = contents.filter((item) => item.type === type);
  if (data.length === 0) return null;

  return (
    <section>
      <div className="flex items-center mb-8 justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <a
          href={link}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-s font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1"
        >
          عرض الكل
        </a>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        grabCursor={true}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="w-full"
      >
        {data.map((item) => (
          <SwiperSlide key={item.uuid}>
            <MovieCard
              movie={{
                id: item.uuid,
                title: item.title,
                description: item.description ?? "",
                genre:
                  item.categories
                    ?.map((cat: { id?: number; name: string }) => cat.name)
                    .join(", ") ?? "",
                cardimg: `${backendUrl}${item.card_image ?? item.poster_image ?? "/images/default-show.jpg"}`,
                image: `${backendUrl}${item.poster_image ?? item.card_image ?? "/images/default-show.jpg"}`,
                rating: item.rating ?? 0,
                year: item.year ?? 0,
              }}
              type={type}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
