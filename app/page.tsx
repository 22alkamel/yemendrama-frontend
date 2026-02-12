import { Content } from "@/types/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSlider from "../components/HeroSlider";
import MovieSection from "../components/MovieSection";
import { getPublishedContents } from "@/services/content.service";

export const metadata = {
  title: "YemenDrama - الصفحة الرئيسية",
  description: "مشاهدة مسلسلات، أفلام، برامج وبودكاست يمانية عالية الجودة",
  openGraph: {
    title: "YemenDrama",
    description: "مشاهدة مسلسلات وأفلام يمانية عالية الجودة",
    type: "website",
    url: "https://yemendrama.com",
    images: [
      {
        url: "https://yemendrama.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YemenDrama",
      },
    ],
  },
};

export default async function Home() {
  const data = await getPublishedContents();
  const contents: Content[] = Array.isArray(data.data) ? data.data : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <HeroSlider
        movies={contents
          .filter((c: Content) => c.type === "series")
          .map((c) => ({
            id: c.uuid,
            title: c.title,
            description: c.description ?? "",
           image: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1','')}${c.poster_image ?? c.card_image}`,

            rating: c.rating ?? 0,
            year: c.year ?? "",
            genre: c.categories?.map((cat) => cat.name).join(", ") ?? "",
          }))}
      />

      <div className="px-4 md:px-8 lg:px-16 py-12 space-y-16">
        <MovieSection title="المسلسلات" link="/series" contents={contents} type="series" />
        <MovieSection title="الأفلام" link="/movies" contents={contents} type="movie" />
        <MovieSection title="البرامج" link="/programs" contents={contents} type="program" />
        <MovieSection title="البودكاست" link="/podcasts" contents={contents} type="podcast" />
        <MovieSection title="المسرحيات" link="/plays" contents={contents} type="play" />
        <MovieSection title="الأطفال" link="/kids" contents={contents} type="kids" />
      </div>

      <Footer />
    </div>
  );

}
