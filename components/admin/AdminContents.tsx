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
      {/* ... كل الكود كما هو ... */}

      {/* استبدال كل src الصور بالمتغير البيئي */}
      {filteredContents.map((item) => (
        <>
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
        </>
      ))}
    </div>
  );
}
