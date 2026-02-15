// types/content.ts

export interface Episode {
  id: number | string; 
  title: string;
  video_url?: string; // رابط الفيديو
  videoEmbedUrl?: string; // لو تستخدم embed
  thumbnail?: string;
  duration?: string;
  views_count?:number;
}
export interface Season {
  id: number;
  season_number?: number;
  title?: string;
  episodes?: Episode[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Content {
  seasons: any;
  uuid: string;
  title: string;
  description?: string;
  poster_image?: string;
  card_image?: string;
  type: "series" | "movie" | "program" | "podcast" | "play" | "kids";
  rating?: number;
  year?: number | string;
  categories?: { name: string }[];
  episodes?: Episode[];       // ✅ إضافة هنا
  seasons_count?: number;     // لو موجود
  video_url?: string;         // للفيلم أو البرنامج لو بدون حلقات
  related?: Content[];        // الأعمال المشابهة
}
