"use client";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category.service";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [type, setType] = useState("genre");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();

      const categoriesArray = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setCategories(categoriesArray || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!name.trim()) return;

    if (editingId) {
      await updateCategory(editingId, { name, type });
      setEditingId(null);
    } else {
      await createCategory({ name, type });
    }

    setName("");
    setType("genre");
    fetchCategories();
  };

  const handleEdit = (cat: any) => {
    setName(cat.name);
    setType(cat.type);
    setEditingId(cat.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  const typeMap: Record<string, string> = {
    genre: "نوع",
    topic: "موضوع",
    age: "فئة عمرية",
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          إدارة التصنيفات
        </h2>

        {/* ===== FORM ===== */}
        <div className="bg-gray-900 p-4 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="اسم التصنيف"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded bg-gray-700 text-white w-full"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 rounded bg-gray-700 text-white w-full"
            >
              <option value="genre">نوع</option>
              <option value="topic">موضوع</option>
              <option value="age">الفئة العمرية</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleCreateOrUpdate}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white w-full"
              >
                {editingId ? "تعديل" : "إضافة"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setType("genre");
                  }}
                  className="bg-gray-600 px-4 py-2 rounded text-white w-full"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== LOADING ===== */}
        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            جارٍ التحميل...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">
            لا يوجد تصنيفات
          </p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="min-w-full bg-gray-800 text-white rounded-lg">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="border-t border-gray-700 hover:bg-gray-700"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3">
                        {typeMap[cat.type] || cat.type}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="bg-yellow-500 px-3 py-1 rounded"
                        >
                          تعديل
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="lg:hidden space-y-4">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <h3 className="font-bold text-lg mb-2">
                    {idx + 1}. {cat.name}
                  </h3>

                  <p className="text-gray-400 mb-4">
                    النوع: {typeMap[cat.type] || cat.type}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-500 py-2 rounded"
                    >
                      تعديل
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-600 py-2 rounded"
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
    </AdminLayout>
  );
}
