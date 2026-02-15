"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/lib/api";

interface Platform {
  id: number;
  name: string;
  color?: string;
}

interface Content {
  uuid: string;
  title: string;
}

interface SocialMediaView {
  content_title: string;
  id: number;
  content_uuid: string;
  views_count: number;
  views_compact: string;
  url?: string;
  platform: Platform;
}

// ====== نموذج الإدخال ======
interface SocialViewFormProps {
  platforms: Platform[];
  contents: Content[];
  onSuccess: () => void;
  editData?: SocialMediaView;
  onCancelEdit?: () => void;
}

function SocialViewForm({
  platforms,
  contents,
  onSuccess,
  editData,
  onCancelEdit,
}: SocialViewFormProps) {
  const [form, setForm] = useState({
    content_uuid: editData?.content_uuid || "",
    platform_id: editData?.platform.id || 0,
    views_count: editData?.views_count || 0,
    url: editData?.url || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        content_uuid: editData.content_uuid,
        platform_id: editData.platform.id,
        views_count: editData.views_count,
        url: editData.url || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content_uuid) return alert("اختر محتوى");
    if (form.platform_id === 0) return alert("اختر منصة");

    setLoading(true);
    try {
      if (editData) {
        await api.put(`/social-views/${editData.id}`, form);
        onCancelEdit?.();
      } else {
        await api.post("/social-views", form);
      }
      setForm({ content_uuid: "", platform_id: 0, views_count: 0, url: "" });
      onSuccess();
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
    >
      <div className="flex flex-col">
        <label className="text-gray-200 mb-1">المحتوى</label>
        <select
          className="p-2 rounded bg-gray-700 text-white focus:ring focus:ring-indigo-500"
          value={form.content_uuid}
          onChange={(e) => setForm({ ...form, content_uuid: e.target.value })}
          required
        >
          <option value="">اختر محتوى</option>
          {contents.map((c) => (
            <option key={c.uuid} value={c.uuid}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-200 mb-1">المنصة</label>
        <select
          className="p-2 rounded bg-gray-700 text-white focus:ring focus:ring-indigo-500"
          value={form.platform_id}
          onChange={(e) =>
            setForm({ ...form, platform_id: Number(e.target.value) })
          }
          required
        >
          <option value={0}>اختر منصة</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-200 mb-1">عدد المشاهدات</label>
        <input
          type="number"
          min={0}
          value={form.views_count}
          onChange={(e) =>
            setForm({ ...form, views_count: Number(e.target.value) })
          }
          className="p-2 rounded bg-gray-700 text-white focus:ring focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-200 mb-1">رابط المحتوى (اختياري)</label>
        <input
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white focus:ring focus:ring-indigo-500"
        />
      </div>

      <div className="md:col-span-4 flex flex-wrap justify-end gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
        >
          {loading ? "جارٍ الحفظ..." : editData ? "تحديث" : "إضافة"}
        </button>
        {editData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white font-semibold"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}

// ====== الصفحة الرئيسية ======
export default function AdminSocialStats() {
  const [views, setViews] = useState<SocialMediaView[]>([]);
  const [filteredViews, setFilteredViews] = useState<SocialMediaView[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<"all" | number>("all");
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState<SocialMediaView | null>(null);

  const getArray = (res: any) =>
    Array.isArray(res.data) ? res.data : res.data?.data || [];

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await api.get("/platforms");
        setPlatforms(getArray(res));
      } catch (err) {
        console.error(err);
      }
    };
    const fetchContents = async () => {
      try {
        const res = await api.get("/contents");
        setContents(getArray(res));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlatforms();
    fetchContents();
  }, []);

  const fetchViews = async () => {
    setLoading(true);
    try {
      const res = await api.get("social-views/all");
      const data = getArray(res);
      setViews(data);
      setFilteredViews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViews();
  }, []);

  useEffect(() => {
    let temp = [...views];
    if (activePlatform !== "all")
      temp = temp.filter((v) => v.platform.id === activePlatform);
    if (search.trim() !== "")
      temp = temp.filter((v) =>
        v.content_title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredViews(temp);
  }, [views, activePlatform, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذه المشاهدة؟")) return;
    try {
      await api.delete(`/social-views/${id}`);
      fetchViews();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-100">
          إحصائيات السوشال ميديا
        </h2>

        {/* نموذج الإدخال */}
        <SocialViewForm
          platforms={platforms}
          contents={contents}
          onSuccess={fetchViews}
          editData={editData || undefined}
          onCancelEdit={() => setEditData(null)}
        />

        {/* بحث */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="🔍 بحث باسم المسلسل"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white w-full sm:w-72 focus:ring focus:ring-indigo-500"
          />

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivePlatform("all")}
              className={`px-4 py-2 rounded-full ${
                activePlatform === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              الكل
            </button>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`px-4 py-2 rounded-full ${
                  activePlatform === p.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
                style={{ borderColor: p.color }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-lg shadow-lg">
          {loading ? (
            <p className="text-gray-400 text-center py-6 animate-pulse">
              جارٍ التحميل...
            </p>
          ) : filteredViews.length === 0 ? (
            <p className="text-gray-400 text-center py-6">لا توجد مشاهدات</p>
          ) : (
            <table className="min-w-full bg-gray-900 text-gray-200">
              <thead className="bg-gray-800 text-start">
                <tr>
                  <th className="py-3 px-2 md:px-4">#</th>
                  <th className="py-3 px-2 md:px-4">اسم المسلسل</th>
                  <th className="py-3 px-2 md:px-4">المنصة</th>
                  <th className="py-3 px-2 md:px-4">عدد المشاهدات</th>
                  <th className="py-3 px-2 md:px-4">الرابط</th>
                  <th className="py-3 px-2 md:px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredViews.map((v, idx) => (
                  <tr
                    key={v.id}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="py-2 px-2 md:px-4">{idx + 1}</td>
                    <td className="py-2 px-2 md:px-4">{v.content_title}</td>
                    <td
                      className="py-2 px-2 md:px-4 font-semibold"
                      style={{ color: v.platform.color || "#fff" }}
                    >
                      {v.platform.name}
                    </td>
                    <td className="py-2 px-2 md:px-4">{v.views_compact}</td>
                    <td className="py-2 px-2 md:px-4">
                      {v.url ? (
                        <a
                          href={v.url}
                          target="_blank"
                          className="text-blue-400 underline break-all"
                        >
                          رابط
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 px-2 md:px-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditData(v)}
                        className="bg-yellow-600 px-3 py-1 rounded text-white font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="bg-red-600 px-3 py-1 rounded text-white font-semibold"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
