"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MovieCard from "../../components/MovieCard";
import { getPublishedContents } from "@/services/content.service";
import { Content } from "@/types/content";

export default function Movies() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("الكل");
  const [sortBy, setSortBy] = useState("الأحدث");
  const [genres, setGenres] = useState<string[]>(["الكل"]);

  // استخدام متغير البيئة بدل localhost
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPublishedContents();
        const moviesData: Content[] = Array.isArray(data.data)
          ? data.data.filter((c: Content) => c.type === "movie")
          : [];
        setContents(moviesData);

        // استخراج التصنيفات من الأفلام
        const allCategories = new Set<string>();
        moviesData.forEach((item: Content) => {
          item.categories?.forEach((cat: { name: string }) => allCategories.add(cat.name));
        });
        setGenres(["الكل", ...Array.from(allCategories)]);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMovies = contents.filter(
    (movie) =>
      selectedGenre === "الكل" ||
      movie.categories?.some((cat: { name: string }) => cat.name === selectedGenre)
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "الأحدث") return (parseInt(b.year as any) || 0) - (parseInt(a.year as any) || 0);
    if (sortBy === "التقييم") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === "الاسم") return (a.title ?? "").localeCompare(b.title ?? "", "ar");
    return 0;
  });

  if (loading) {
    return (
      <div className="text-white text-center mt-20">جاري تحميل الأفلام...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-24 px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          مكتبة الأفلام
        </h1>

        {/* فلترة + ترتيب */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-reverse space-x-4">
            <span className="text-gray-400 text-sm">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 pr-8"
            >
              <option value="الأحدث">الأحدث</option>
              <option value="التقييم">التقييم</option>
              <option value="الاسم">الاسم</option>
            </select>
          </div>
        </div>

        {/* شبكة عرض الأفلام */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 pb-16">
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.uuid}
              movie={{
                id: movie.uuid,
                title: movie.title,
                description: movie.description ?? "",
                genre: movie.categories?.map((cat: { name: string }) => cat.name).join(", ") ?? "",
                image: `${backendUrl}${movie.poster_image ?? movie.card_image}`,
                cardimg: `${backendUrl}${movie.card_image ?? movie.poster_image}`,
                rating: movie.rating ?? 0,
                year: movie.year ?? 0,
              }}
              type="movies"
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
