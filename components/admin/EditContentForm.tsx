"use client";

import { useState, useEffect } from "react";
import { updateContent } from "@/services/content.service";
import { getCategories } from "@/services/category.service";

interface EditContentFormProps {
  content: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditContentForm({
  content,
  onSuccess,
  onCancel,
}: EditContentFormProps) {
  const [title, setTitle] = useState(content.title ?? "");
  const [description, setDescription] = useState(content.description ?? "");
  const [type, setType] = useState(content.type ?? "movie");
  const [year, setYear] = useState(content.year ?? "");
  const [loading, setLoading] = useState(false);

  const [cardImage, setCardImage] = useState<File | null>(null);
  const [posterImage, setPosterImage] = useState<File | null>(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";

  // التصنيفات
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    content.categories?.map((c: any) => c.id) || []
  );

  const types = [
    "movie",
    "series",
    "program",
    "play",
    "kids",
    "podcast",
    "competition",
  ];

  const typesMap: Record<string, string> = {
    movie: "أفلام",
    series: "مسلسلات",
    program: "برامج",
    play: "مسرحيات",
    kids: "أطفال",
    podcast: "بودكاست",
    competition: "مسابقات",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const cats = Array.isArray(res.data.data) ? res.data.data : [];
        setCategoriesList(cats);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("_method", "PUT"); // مهم
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("year", String(year));

      selectedCategories.forEach((id) =>
        formData.append("category_ids[]", String(id))
      );

      if (cardImage) formData.append("card_image", cardImage);
      if (posterImage) formData.append("poster_image", posterImage);

      await updateContent(content.uuid, formData);

      setCardImage(null);
      setPosterImage(null);

      onSuccess();
    } catch (err) {
      console.error("Update failed", err);
      alert("فشل تعديل المحتوى، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4 text-right"
    >
      {/* العنوان */}
      <div>
        <label className="text-gray-200 font-medium">العنوان</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
          required
        />
      </div>

      {/* الوصف */}
      <div>
        <label className="text-gray-200 font-medium">الوصف</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
        />
      </div>

      {/* النوع */}
      <div>
        <label className="text-gray-200 font-medium">النوع</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {typesMap[t]}
            </option>
          ))}
        </select>
      </div>

      {/* السنة */}
      <div>
        <label className="text-gray-200 font-medium">السنة</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
        />
      </div>

      {/* التصنيفات */}
      <div>
        <label className="block mb-1 font-medium text-gray-200">
          اختر التصنيفات:
        </label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {categoriesList.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
              />
              {cat.name} ({cat.type})
            </label>
          ))}
        </div>
      </div>

      {/* صورة الكارد */}
      <div>
        <label className="text-gray-200 font-medium">صورة الكارد</label>

        {content.card_image && !cardImage && (
          <img
            src={`${backendUrl}${content.card_image}`}
            className="w-32 h-20 object-cover rounded-lg mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCardImage(e.target.files?.[0] || null)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
        />
      </div>

      {/* صورة البوستر */}
      <div>
        <label className="text-gray-200 font-medium">صورة البوستر</label>

        {content.poster_image && !posterImage && (
          <img
            src={`${backendUrl}${content.poster_image}`}
            className="w-32 h-20 object-cover rounded-lg mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPosterImage(e.target.files?.[0] || null)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
        />
      </div>

      {/* الأزرار */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 rounded-lg text-white"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white"
        >
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
