"use client";

import Link from "next/link";
import { useState } from "react";
import { Show } from "../../models/type"; // لو عندك النوع معرف مسبقاً

export interface Producer {
  name: string;
  logo: string;
  website?: string; // اختياري
}

interface Crew {
  producer: Producer;
  writer: string;
  director: string;
  cast: string[]; // قائمة الممثلين
}

interface Episode {
  id: string | number; // ✅ الآن متوافق مع Content
  title: string;
  video_url?: string;
  thumbnail?: string;
  duration?: string;
}

interface Series {
 id: string | number;
  title: string;
  description: string;
  image: string;   // صورة رئيسية للمسلسل
  cardimg: string; // صورة البطاقة
  rating: number;
  year: string | number;  // نسمح بالنص أو الرقم
  genre: string;
  crew: Crew;      // بيانات الطاقم
  episodes: Episode[]; 
  seasons: number; // عدد المواسم
}


interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800">
        <div className="aspect-[2/3] w-full">
          <img
            src={series.cardimg}
            alt={series.title}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {isHovered && (
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
            <div className="space-y-reverse space-y-2">
              <h3 className="font-bold text-sm md:text-base line-clamp-2">
                {series.title}
              </h3>

              <div className="flex flex-col text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{series.year}</span>
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 w-3 h-3 flex items-center justify-center mr-1"></i>
                    <span>{series.rating}</span>
                  </div>
                </div>
                <div className="text-gray-300">
                  {series.seasons} مواسم • {series.episodes.length} {series.episodes.length === 1 ? 'حلقة' : 'حلقات'}
                </div>
              </div>

              <div className="flex items-center space-x-reverse space-x-2">
                <Link
                  href={`/watch/series/${series.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-reverse space-x-1"
                >
                  <i className="ri-play-fill w-3 h-3 flex items-center justify-center"></i>
                  <span>مشاهدة</span>
                </Link>
                <Link
                  href={`/details/series/${series.id}`}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-reverse space-x-1"
                >
                  <i className="ri-information-line w-3 h-3 flex items-center justify-center"></i>
                  <span>تفاصيل</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          <div className="flex items-center">
            <i className="ri-star-fill text-yellow-400 w-3 h-3 flex items-center justify-center mr-1"></i>
            <span>{series.rating}</span>
          </div>
        </div>

        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
          مسلسل
        </div>
      </div>

      <div className="mt-3 md:hidden">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {series.title}
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          {series.year} • {series.seasons} مواسم
        </p>
      </div>
    </div>
  );
}
