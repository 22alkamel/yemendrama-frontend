"use client";

import { useEffect, useState } from "react";
import {
  getContents,
  deleteContent,
  togglePublish,
} from "@/services/content.service";
import CreateContentForm from "@/components/admin/CreateContentForm";
import EditContentForm from "@/components/admin/EditContentForm";
import { useRouter } from "next/navigation";


export default function AdminContents() {
  const [contents, setContents] = useState<any[]>([]);
  const [filteredContents, setFilteredContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  const [activeType, setActiveType] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";

  const router = useRouter();

  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await getContents();
      setContents(res.data);
      setFilteredContents(res.data);
    } catch (e) {
      console.error("Fetch contents error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    let temp = [...contents];
    if (activeType !== "all") temp = temp.filter((c) => c.type === activeType);
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      temp = temp.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.description?.toLowerCase().includes(lower)
      );
    }
    setFilteredContents(temp);
  }, [activeType, search, contents]);

  const handleDelete = async (uuid: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await deleteContent(uuid);
    fetchContents();
  };

  const handlePublish = async (uuid: string) => {
    await togglePublish(uuid);
    fetchContents();
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowCreate(false);
  };

  const types: string[] = [
    "movie",
    "series",
    "program",
    "play",
    "kids",
    "podcast",
    "competition",
  ];

  // خريطة الأنواع العربية
  const typesMap: Record<string, string> = {
    movie: "افلام",
    series: "مسلسلات",
    program: "برامج",
    play: "مسرحيات",
    kids: "أطفال",
    podcast: "بودكاست",
    competition: "مسابقات",
  };

  if (loading)
    return (
      <p className="text-gray-400 text-center py-6 text-lg animate-pulse">
        جارٍ تحميل المحتوى...
      </p>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-right text-gray-100">
        إدارة المحتوى
      </h2>

      {/* شريط الأدوات */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4 items-start md:items-center">
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            ➕ إضافة محتوى
          </button>
        </div>
        <input
          type="text"
          placeholder="🔍 بحث بالعنوان أو الوصف"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 md:p-3 rounded-lg bg-gray-800 text-white w-full md:w-64 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
        />
      </div>

      {/* نموذج إضافة المحتوى */}
      {showCreate && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
          <CreateContentForm
            onSuccess={() => {
              setShowCreate(false);
              fetchContents();
            }}
          />
        </div>
      )}
      {editItem && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
          <EditContentForm
            content={editItem}
            onCancel={() => setEditItem(null)}
            onSuccess={() => {
              setEditItem(null);
              fetchContents();
            }}
          />
        </div>
      )}

      {/* Tabs للتصنيف حسب النوع */}
      <div className="flex flex-wrap gap-2 mb-6 justify-end">
        <button
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeType === "all"
              ? "bg-red-600 text-white shadow-md"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          onClick={() => setActiveType("all")}
        >
          الكل
        </button>
        {types.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeType === t
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
            onClick={() => setActiveType(t)}
          >
            {typesMap[t] || t} {/* نعرض العربي */}
          </button>
        ))}
      </div>

      {/* المحتوى */}
      {filteredContents.length === 0 ? (
        <p className="text-gray-400 text-center py-6 text-lg">لا يوجد محتوى</p>
      ) : (
        <>
          {/* جدول للشاشات الكبيرة */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-gray-900 text-gray-200 divide-y divide-gray-700">
              <thead className="bg-gray-800 text-right">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">العنوان</th>
                  <th className="py-3 px-4">النوع</th>
                  <th className="py-3 px-4">السنة</th>
                  <th className="py-3 px-4">الوصف</th>
                  <th className="py-3 px-4">الصورة</th>
                  <th className="py-3 px-4">البوستر</th>
                  <th className="py-3 px-4">التصنيف</th>

                  <th className="py-3 px-4">المواسم</th>
                  <th className="py-3 px-4">الحلقات</th>
                 

                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.map((item, index) => (
                  <tr
                    key={item.uuid}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-200"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 font-medium">{item.title}</td>
                    <td className="py-2 px-4">
                      {typesMap[item.type] || item.type}
                    </td>
                    <td className="py-2 px-4">{item.year || "—"}</td>
                    <td className="py-2 px-4 line-clamp-2">
                      {item.description || "—"}
                    </td>
                    <td className="py-2 px-4">
                      {item.card_image ? (
                        <img
                          src={`${backendUrl}${item.card_image}`}
                          alt={item.title}
                          className="w-20 h-12 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {item.poster_image ? (
                        <img
                          src={`${backendUrl}${item.poster_image}`}
                          alt={item.title}
                          className="w-20 h-12 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {item.categories?.map((c: any) => c.name).join(", ") ||
                        "—"}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.seasons_count ?? 0}
                    </td>

                    <td className="py-2 px-4 text-center">
                      {item.episodes_count ?? 0}
                    </td>

                   

                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "published"
                            ? "bg-green-600 text-white"
                            : item.status === "draft"
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex flex-wrap gap-2 justify-start">
                      <button
                        onClick={() => handlePublish(item.uuid)}
                        className={`px-3 py-1 text-sm rounded-lg font-medium transition transform hover:-translate-y-0.5 ${
                          item.status === "published"
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        }`}
                      >
                        {item.status === "published" ? "إلغاء النشر" : "نشر"}
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/contents/${item.uuid}`)
                        }
                        className="px-3 py-1 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(item.uuid)}
                        className="px-3 py-1 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* بطاقات للشاشات الصغيرة */}
          <div className="md:hidden flex flex-col gap-4">
            {filteredContents.map((item, index) => (
              <div
                key={item.uuid}
                className="bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "published"
                        ? "bg-green-600 text-white"
                        : item.status === "draft"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {item.description || "—"}
                </p>
                <div className="flex gap-3 overflow-x-auto">
                  {item.card_image && (
                    <img
                      src={`${backendUrl}${item.card_image}`}
                      alt={item.title}
                      className="w-32 h-20 object-cover rounded-lg shadow-sm"
                    />
                  )}
                  {item.poster_image && (
                    <img
                      src={`${backendUrl}${item.poster_image}`}
                      alt={item.title}
                      className="w-32 h-20 object-cover rounded-lg shadow-sm"
                    />
                  )}
                </div>
                <p className="text-gray-400 text-sm">
                  النوع: {typesMap[item.type] || item.type || "—"} • السنة:{" "}
                  {item.year || "—"}
                </p>

                <p className="text-gray-400 text-sm">
                  التصنيف:{" "}
                  {item.categories?.map((c: any) => c.name).join(", ") || "—"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePublish(item.uuid)}
                    className={`px-3 py-1 text-sm rounded-lg font-medium transition transform hover:-translate-y-0.5 ${
                      item.status === "published"
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    }`}
                  >
                    {item.status === "published" ? "إلغاء النشر" : "نشر"}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                  >
                    تعديل
                  </button>
                   <button
                        onClick={() =>
                          router.push(`/admin/contents/${item.uuid}`)
                        }
                        className="px-3 py-1 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                      >
                        عرض
                      </button>
                  <button
                    onClick={() => handleDelete(item.uuid)}
                    className="px-3 py-1 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition transform hover:-translate-y-0.5"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
