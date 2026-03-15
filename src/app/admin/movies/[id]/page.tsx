import { createClient } from "@/lib/supabase/server";
import { MovieForm } from "@/components/admin/movie-form";

export default async function AdminMovieEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  let movie = undefined;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();
    movie = data ?? undefined;
  }

  return <MovieForm movie={movie} />;
}
