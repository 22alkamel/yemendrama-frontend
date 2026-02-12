'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { getContent } from "@/services/content.service";
import SeasonsManager from "@/components/admin/seasons/SeasonsManager";
import EpisodesManager from "@/components/admin/episodes/EpisodesManager";

export default function AdminContentDetails() {
  const { uuid } = useParams();
  const contentUuid = Array.isArray(uuid) ? uuid[0] : uuid;

  const [content, setContent] = useState<any>(null);
  const [tab, setTab] = useState<"seasons" | "episodes" | "people">("seasons");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1','') ?? "";

  
  useEffect(() => {
    if (!contentUuid) return;

    getContent(contentUuid)
      .then((res) => setContent(res.data.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("🚫 ليس لديك صلاحية مشاهدة هذا المحتوى");
        }
      });
  }, [contentUuid]);

  if (!content) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-400 mt-20 animate-pulse">
          جارٍ تحميل بيانات المحتوى...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden bg-gray-900">
          {content.card_image && (
            <img
              src={`${backendUrl}${content.poster_image}`}
              alt={content.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}

          <div className="relative p-6 grid md:grid-cols-4 gap-6">
            {/* Poster */}
            <div>
              <img
                src={`${backendUrl}${content.card_image}`}
                className="rounded-lg shadow-lg"
                alt={content.title}
              />
            </div>

            {/* Info */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold">{content.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    content.status === "published"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  {content.status}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed">
                {content.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>📅 {content.year}</span>
                <span>⭐ {content.rating}</span>
                <span>👁 {content.views} مشاهدة</span>
                <span>🎬 {content.type}</span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {content.categories?.map((cat: any) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 text-xs rounded-full bg-red-600/20 text-red-400"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="عدد المواسم" value={content.seasons_count || 0} />
          <StatCard label="عدد الحلقات" value= {content.seasons?.reduce(
          (total: number, season: any) =>
            total + (season.episodes?.length || 0),
          0
        )} />
          <StatCard label="المشاهدات" value={content.views || 0} />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 border-b border-gray-800">
          <TabButton active={tab === "seasons"} onClick={() => setTab("seasons")}>
            المواسم
          </TabButton>
          <TabButton active={tab === "episodes"} onClick={() => setTab("episodes")}>
            الحلقات
          </TabButton>
          <TabButton active={tab === "people"} onClick={() => setTab("people")}>
            الطاقم
          </TabButton>
        </div>

        {/* Tab Content */}
        {tab === "seasons" && <SeasonsManager content={content} />}
        {tab === "episodes" && <EpisodesManager content={content} />}
        {tab === "people" && (
          <div className="text-gray-400">Actors & Directors لاحقًا 🎭</div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- UI Components ---------- */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium border-b-2 transition
      ${
        active
          ? "border-red-600 text-white"
          : "border-transparent text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
