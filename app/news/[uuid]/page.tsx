"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getSingleNews } from "@/services/news.service";

/* ================= TYPES ================= */

interface Category {
  name: string;
  slug: string;
}

interface News {
  uuid: string;
  title: string;
  body: string;
  image_url: string;
  created_at: string;
  category?: Category;
}

/* ================= COMPONENT ================= */

export default function NewsDetails() {
  // ✅ حل مشكلة TypeScript نهائياً
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!uuid) return;

    const fetchNews = async () => {
      try {
        setLoading(true);

        const res = await getSingleNews(uuid);
        const data = res.data?.data || res.data;

        setNews(data);
      } catch (err) {
        console.error("Fetch news error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [uuid]);

  /* ================= STATES ================= */

  // 🔥 Netflix Skeleton Loading
  if (loading) {
    return (
      <div className="bg-black min-h-screen animate-pulse">
        <div className="h-[70vh] bg-gray-800" />
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/2" />
          <div className="h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">❌ تعذر تحميل الخبر</p>
        <Link
          href="/news"
          className="bg-red-600 px-6 py-3 rounded hover:bg-red-700"
        >
          العودة للأخبار
        </Link>
      </div>
    );
  }

  /* ================= SHARE ================= */

  const shareNews = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("تم نسخ رابط الخبر ✅");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      {/* ================= HERO (Netflix Style) ================= */}
      <section
        className="relative h-[65vh] md:h-[75vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            news.image_url ||
            news.title
          })`,
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="absolute bottom-0 p-6 md:p-16 max-w-4xl">
          {news.category && (
            <span className="bg-red-600 px-3 py-1 text-sm rounded">
              {news.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-6xl font-bold mt-4 leading-tight">
            {news.title}
          </h1>

          <p className="text-gray-300 mt-4 text-sm md:text-base">
            {new Date(news.created_at).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="bg-[#141414] rounded-2xl p-6 md:p-10 shadow-2xl">
          <p className="text-lg leading-9 text-gray-200 whitespace-pre-line">
            {news.body}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/news"
            className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            ← العودة للأخبار
          </Link>

          <button
            onClick={shareNews}
            className="bg-gray-700 px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            مشاركة الخبر
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}