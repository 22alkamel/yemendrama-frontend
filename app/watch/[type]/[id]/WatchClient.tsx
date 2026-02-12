'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Content, Episode } from "@/types/content";

interface WatchClientProps {
  show: Content;
  type: string;
}

export default function WatchClient({ show, type }: WatchClientProps) {
  const router = useRouter();

  // رابط السيرفر الخارجي من المتغير البيئي
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";

  // جمع كل الحلقات
  const allEpisodes: Episode[] = useMemo(() => {
    const directEpisodes = show.episodes || [];
    const seasonEpisodes =
      show.seasons?.flatMap((season: { episodes: any }) => season.episodes) || [];
    return [...directEpisodes, ...seasonEpisodes];
  }, [show]);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    allEpisodes[0] || null
  );

  // جلب كل الأعمال المشابهة
  const [similarWorks, setSimilarWorks] = useState<Content[]>([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/contents?type=${type}&limit=20`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter(
          (item: Content) => item.uuid !== show.uuid && item.type === show.type
        );
        setSimilarWorks(filtered);
      })
      .catch(err => console.error(err));
  }, [backendUrl, type, show.uuid, show.type]);

  const totalEpisodes =
    show.seasons?.reduce(
      (total: number, season: any) => total + (season.episodes?.length || 0),
      0
    ) || show.episodes?.length || 0;

  return (
    <main className="bg-gray-900 min-h-screen text-white mx-auto px-4 py-6">

      {/* مشغل الفيديو */}
      {currentEpisode ? (
        <section className="mb-6 relative aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={currentEpisode.video_url || currentEpisode.videoEmbedUrl}
            title={currentEpisode.title}
            allowFullScreen
            className="w-full h-full"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded text-sm">
            {currentEpisode.title}
          </div>
        </section>
      ) : (
        <p className="text-gray-300 text-center mt-20">الفيديو غير متاح</p>
      )}

      {/* معلومات المحتوى */}
      <section className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
            <span>⭐ {show.rating ?? "غير متوفر"}</span>
            <span>🎬 {show.categories?.map(c => c.name).join(", ")}</span>
            <span>📅 {show.year}</span>
            {show.seasons_count && <span>المواسم: {show.seasons_count}</span>}
          </div>
          <p className="text-gray-400 mb-12">{show.description}</p>

          {/* قائمة الحلقات */}
          {allEpisodes.length > 0 && (
            <aside className="bg-gray-800 rounded-lg p-4 shadow-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">الحلقات</h2>
              <ul className="space-y-3 max-h-[250px] overflow-y-auto">
                {allEpisodes.map(ep => (
                  <li
                    key={ep.id}
                    onClick={() => setCurrentEpisode(ep)}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer transition
                      ${currentEpisode?.id === ep.id ? "bg-red-700" : "bg-gray-700 hover:bg-red-600"}`}
                  >
                    <img
                      src={ep.thumbnail || `${backendUrl}${show.poster_image || show.card_image}`}
                      alt={ep.title}
                      className="w-20 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold">{ep.title}</h3>
                      <p className="text-xs text-gray-300">{ep.duration || "غير محددة"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>

        {/* أعمال مشابهة */}
        <div className="flex flex-col lg:w-[600px] gap-6">
          <aside className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {show.type === "movie"
                ? "أفلام أخرى"
                : show.type === "series"
                ? "مسلسلات أخرى"
                : show.type === "program"
                ? "برامج أخرى"
                : "محتوى مشابه"}
            </h2>

            {similarWorks.length > 0 ? (
              <ul className="space-y-3 max-h-[600px] overflow-y-auto">
                {similarWorks.map(item => (
                  <li
                    key={item.uuid}
                    onClick={() => router.push(`/watch/${type}/${item.uuid}`)}
                    className="flex items-center gap-3 p-3 rounded cursor-pointer transition bg-gray-700 hover:bg-red-600"
                  >
                    <img
                      src={`${backendUrl}${item.card_image || item.poster_image || "/images/default-show.jpg"}`}
                      alt={item.title}
                      className="w-20 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-xs text-gray-300">
                        {item.categories?.map(c => c.name).join(", ")} • {item.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">لا توجد أعمال مشابهة حاليا</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
