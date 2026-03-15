"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkAdmin } from "@/lib/admin";

function extractYoutubeId(input: string): string {
  // Already a bare ID (11 chars, no slash/dot)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  // Full URL or embed URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return input.trim();
}

export async function upsertMovie(formData: FormData) {
  const user = await checkAdmin();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const rawYoutubeInput = (formData.get("youtube_id") as string) || "";
  const youtube_id = extractYoutubeId(rawYoutubeInput);

  const payload = {
    title_ja: (formData.get("title_ja") as string) || "",
    title_en: (formData.get("title_en") as string) || null,
    youtube_id,
    category: (formData.get("category") as string) || "mv",
    description_ja: (formData.get("description_ja") as string) || null,
    description_en: (formData.get("description_en") as string) || null,
    credits: (formData.get("credits") as string) || null,
    status: (formData.get("status") as string) || "draft",
    published_at: (formData.get("published_at") as string) || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id) {
    ({ error } = await supabase.from("movies").update(payload).eq("id", id));
  } else {
    ({ error } = await supabase.from("movies").insert(payload));
  }

  if (error) {
    console.error("upsertMovie error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/movies");
  revalidatePath("/ja/movie");
  revalidatePath("/en/movie");
  return { success: true };
}

export async function deleteMovie(id: string) {
  const user = await checkAdmin();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("movies").delete().eq("id", id);

  if (error) {
    console.error("deleteMovie error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/movies");
  revalidatePath("/ja/movie");
  revalidatePath("/en/movie");
  return { success: true };
}
