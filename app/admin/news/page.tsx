"use client";

import { useEffect, useState } from "react";
import {
  getNews,
  deleteNews,
  toggleNewsPublish,
} from "@/services/news.service";

import { useRouter } from "next/navigation";
import CreateNewsForm from "@/components/admin/news/CreateNewsForm";
import EditNewsForm from "@/components/admin/news/EditNewsForm";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  const [activeType, setActiveType] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");

  const router = useRouter();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await getNews();
      const newsArray = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setNews(newsArray || []);
      setFilteredNews(newsArray || []);
    } catch (e) {
      console.error("Fetch news error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let temp = [...news];

    if (activeType !== "all") {
      temp = temp.filter((n) => n.type === activeType);
    }

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      temp = temp.filter(
        (n) =>
          n.title.toLowerCase().includes(lower) ||
          n.summary?.toLowerCase().includes(lower)
      );
    }

    setFilteredNews(temp);
  }, [activeType, search, news]);

  const handleDelete = async (uuid: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await deleteNews(uuid);
    fetchNews();
  };

  const handlePublish = async (uuid: string) => {
    await toggleNewsPublish(uuid);
    fetchNews();
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowCreate(false);
  };

  const typesMap: Record<string, string> = {
    article: "مقال",
    video: "فيديو",
  };

  if (loading)
    return (
      <p className="text-gray-400 text-center py-6 text-lg animate-pulse">
        جارٍ تحميل الأخبار...
      </p>
    );

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-100">
          إدارة الأخبار
        </h2>

        {/* شريط الأدوات */}
        <div className="flex flex-col lg:flex-row lg:justify-between mb-6 gap-4">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition w-full lg:w-auto"
          >
            ➕ إضافة خبر
          </button>

          <input
            type="text"
            placeholder="🔍 بحث بالعنوان أو الملخص"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-white w-full lg:w-72"
          />
        </div>

        {/* نموذج الإضافة */}
        {showCreate && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            <CreateNewsForm
              onSuccess={() => {
                setShowCreate(false);
                fetchNews();
              }}
            />
          </div>
        )}

        {/* نموذج التعديل */}
        {editItem && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            <EditNewsForm
              news={editItem}
              onCancel={() => setEditItem(null)}
              onSuccess={() => {
                setEditItem(null);
                fetchNews();
              }}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveType("all")}
            className={`px-4 py-2 rounded-full ${
              activeType === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            الكل
          </button>

          {Object.keys(typesMap).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full ${
                activeType === type
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {typesMap[type]}
            </button>
          ))}
        </div>

        {filteredNews.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            لا يوجد أخبار
          </p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden lg:block overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-gray-900 text-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">العنوان</th>
                    <th className="py-3 px-4">النوع</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">نوع الخبر</th>
                    <th className="py-3 px-4">الصورة</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNews.map((item, index) => (
                    <tr
                      key={item.uuid}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{item.title}</td>
                      <td className="py-2 px-4">
                        {typesMap[item.type] || item.type}
                      </td>
                      <td className="py-2 px-4">
                        {item.category?.name || "—"}
                      </td>
                      <td className="py-2 px-4">
                        {item.is_breaking ? "عاجل" : "عادي"}
                      </td>
                      <td className="py-2 px-4">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            className="w-20 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => handlePublish(item.uuid)}
                          className="px-3 py-1 bg-blue-600 rounded"
                        >
                          نشر
                        </button>

                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-yellow-500 rounded"
                        >
                          تعديل
                        </button>

                        <button
                          onClick={() => handleDelete(item.uuid)}
                          className="px-3 py-1 bg-red-600 rounded"
                        >
                          حذف
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/admin/news/${item.uuid}`)
                          }
                          className="px-3 py-1 bg-indigo-500 rounded"
                        >
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="lg:hidden space-y-4">
              {filteredNews.map((item, index) => (
                <div
                  key={item.uuid}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {index + 1}. {item.title}
                  </h3>

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}

                  <div className="text-sm text-gray-400 space-y-1 mb-3">
                    <p>النوع: {typesMap[item.type]}</p>
                    <p>التصنيف: {item.category?.name || "—"}</p>
                    <p>
                      الحالة:
                      <span className="ml-2 text-green-400">
                        {item.status}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePublish(item.uuid)}
                      className="bg-blue-600 py-2 rounded"
                    >
                      نشر
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 py-2 rounded"
                    >
                      تعديل
                    </button>

                    <button
                      onClick={() => handleDelete(item.uuid)}
                      className="bg-red-600 py-2 rounded"
                    >
                      حذف
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/admin/news/${item.uuid}`)
                      }
                      className="bg-indigo-500 py-2 rounded"
                    >
                      عرض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
