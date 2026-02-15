"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

/* ================= TYPES ================= */

interface SocialMediaView {
  content_title: string;
  views_count: number;
  platform: {
    id: number;
    name: string;
    color?: string;
  };
}

interface ContentStat {
  title: string;
  views: number;
}

interface PlatformStat {
  platform: string;
  color: string;
  contents: ContentStat[];
}

/* ================= PAGE ================= */

export default function StatsPage() {
  const [data, setData] = useState<PlatformStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await api.get("social-views/all");

      const raw: SocialMediaView[] =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      setData(groupByPlatform(raw));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">

      {/* ===== HEADER ===== */}
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            إحصائيات المشاهدة
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            مقارنة أداء المسلسلات عبر منصات السوشيال ميديا
            بطريقة تحليلية حديثة.
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">

          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">
              جاري تحميل الإحصائيات...
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.map((platform) => (
                <PlatformCard
                  key={platform.platform}
                  platform={platform}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}

/* ================= GROUPING ================= */

function groupByPlatform(
  views: SocialMediaView[]
): PlatformStat[] {
  const map: Record<string, PlatformStat> = {};

  views.forEach((v) => {
    const name = v.platform.name;

    if (!map[name]) {
      map[name] = {
        platform: name,
        color: v.platform.color || "#ef4444",
        contents: [],
      };
    }

    map[name].contents.push({
      title: v.content_title,
      views: v.views_count,
    });
  });

  return Object.values(map);
}

/* ================= CARD ================= */

function PlatformCard({ platform }: { platform: PlatformStat }) {
  const sorted = [...platform.contents].sort(
    (a, b) => b.views - a.views
  );

  const maxViews = sorted[0]?.views || 1;

  const totalViews = sorted.reduce(
    (sum, c) => sum + c.views,
    0
  );

  return (
    <div className="
      relative
      bg-gradient-to-b from-gray-900 to-black
      border border-gray-800
      rounded-2xl
      p-6
      shadow-xl
      hover:shadow-red-900/20
      transition
      group
    ">
      {/* glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: platform.color }}
          />
          {platform.platform}
        </h2>

        <span className="text-sm text-gray-400">
          {formatViews(totalViews)}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-5 relative">
        {sorted.map((content) => {
          const percentage =
            (content.views / maxViews) * 100;

          return (
            <div key={content.title}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">
                  {content.title}
                </span>

                <span className="font-semibold">
                  {formatViews(content.views)}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${percentage}%`,
                    background: platform.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function formatViews(num: number) {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000)
    return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
