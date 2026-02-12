// page.tsx
import WatchClient from "./WatchClient";
import { Content } from "@/types/content";

interface WatchPageProps {
  params: { type: string; id: string } | Promise<{ type: string; id: string }>;
}

export default async function WatchPage(props: WatchPageProps) {
  const { params } = props;
  const { type, id } = "then" in params ? await params : params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

  try {
    const res = await fetch(`${apiUrl}/contents`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch content");

    const data: { data: Content[] } = await res.json();

    // البحث عن العنصر المناسب حسب UUID
    const show = data.data.find(item => item.uuid === id);

    if (!show) return <p className="text-white text-center mt-20">المحتوى غير موجود</p>;

    return <WatchClient show={show} type={type} />;
  } catch (err) {
    console.error(err);
    return <p className="text-white text-center mt-20">حدث خطأ أثناء جلب المحتوى</p>;
  }
}
