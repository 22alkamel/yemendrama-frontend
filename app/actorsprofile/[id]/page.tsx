import { series } from "../../../data/series";
import { movies } from "../../../data/movies";
import { programs } from "../../../data/programs";
import { podcasts } from "../../../data/podcasts";
import { kids } from "../../../data/kids";
import { plays } from "../../../data/plays";
import { Show } from "../../../models/type";
import { actors } from "../../../data/actors";
import { Actor } from "../../../models/actortype";
import ActorProfile from "./ActorProfile";

interface PageProps {
  params: Promise<{ id: string }>; // ✅ params الآن Promise
}

// توليد static params لكل الممثلين
export async function generateStaticParams() {
  return actors.map((actor: Actor) => ({
    id: actor.id.toString(),
  }));
}

// الصفحة نفسها async
export default async function ActorPage({ params }: PageProps) {
  const { id } = await params; // ✅ ننتظر الـ params

  const actor: Actor | undefined = actors.find(
    (a: Actor) => a.id.toString() === id
  );

  if (!actor) {
    return <div className="text-center text-white py-20">الممثل غير موجود</div>;
  }

  // const allWorks: Show[] = [
  //   ...series.map((s) => ({ ...s, type: "series" })),
  //   ...movies.map((m) => ({ ...m, type: "movie" })),
  //   ...programs.map((p) => ({ ...p, type: "programs" })),
  //   ...podcasts.map((po) => ({ ...po, type: "podcasts" })),
  //   ...kids.map((k) => ({ ...k, type: "kids" })),
  //   ...plays.map((pl) => ({ ...pl, type: "plays" })),
  // ];

  // const actorWorks = allWorks.filter((work: Show) =>
  //   actor.works?.some((w) => w.id === work.id && w.type === work.type)
  // );

  // return <ActorProfile actor={actor} works={actorWorks} />;
}
