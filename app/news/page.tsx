"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BreakingNews from "../../components/newssection/BreakingNews";

import { getNews } from "@/services/news.service";
import { getCategories } from "@/services/newsCategory.service";

export default function NewsHome() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newsRes = await getNews();
        const categoriesRes = await getCategories();

        const newsArray = newsRes.data?.data || newsRes.data;
        const categoriesArray = categoriesRes.data?.data || categoriesRes.data;

        setNews(newsArray || []);
        setCategories(categoriesArray || []);
      } catch (err) {
        console.error("Fetch news error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 ترتيب الأخبار من الأحدث إلى الأقدم
  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [news]);

  // تصفية الأخبار حسب التصنيف + عرض أحدث 4 فقط
  const newsByCategory = (categorySlug: string) =>
    sortedNews
      .filter((n) => n.category?.slug === categorySlug)
      .slice(0, 4);

  return (
    <div className="bg-white">
      <Header />

      {/* Hero */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url(/news.jpg)" }}
      >
        <div className="bg-black/70 px-8 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            كـل اخبــار <span className="text-red-500">الدرامـــا</span>
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            موقع يمن ميديا - مصدركم الموثوق لآخر الأخبار والتقارير الحصرية
          </p>
        </div>
      </section>

      {/* Breaking Bar */}
      <div className="bg-red-600 text-white py-2 text-sm">
        <div className="container mx-auto">
          <Marquee pauseOnHover gradient={false} speed={50}>
            {sortedNews
              .filter((n) => n.is_breaking)
              .map((n) => (
                <span key={n.uuid} className="mx-4">
                  {n.title}
                </span>
              ))}
          </Marquee>
        </div>
      </div>

      <BreakingNews />

      {/* Latest News Section */}
      <section className="py-10 px-6 bg-black">
        <h3 className="text-2xl font-bold mb-10 text-white">
          الأخبار
        </h3>

        {loading ? (
          <p className="text-gray-400 text-center py-6 animate-pulse">
            جارٍ تحميل الأخبار...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            لا يوجد تصنيفات
          </p>
        ) : (
          categories.map((cat) => {
            const catNews = newsByCategory(cat.slug);
            if (catNews.length === 0) return null;

            return (
              <div key={cat.id} className="mb-16">
                {/* عنوان التصنيف + زر الكل */}
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-semibold text-red-500">
                    {cat.name}
                  </h4>

                  <Link
                    href={`/news/category/${cat.slug}`}
                    className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                  >
                    عرض جميع الأخبار
                  </Link>
                </div>

                {/* عرض 4 أخبار */}
                <div className="grid md:grid-cols-4 gap-6">
                  {catNews.map((item) => (
                    <div
                      key={item.uuid}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                      <img
                        src={
                          item.image_url ||
                          `https://picsum.photos/600/400?random=${item.id}`
                        }
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-4">
                        <h5 className="font-bold text-lg mb-2 line-clamp-2">
                          {item.title}
                        </h5>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {item.summary || "ملخص الخبر..."}
                        </p>

                        <Link
                          href={`/news/${item.uuid}`}
                          className="text-red-600 hover:underline text-sm font-semibold"
                        >
                          اقرأ المزيد ←
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      <Footer />
    </div>
  );
}
