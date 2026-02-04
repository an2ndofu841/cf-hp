"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin";

export async function upsertNews(formData: FormData) {
  const user = await checkAdmin();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";

  const rawData = {
    title_ja: formData.get("title_ja") as string,
    title_en: formData.get("title_en") as string || null,
    slug: formData.get("slug") as string,
    body_ja: formData.get("body_ja") as string || null,
    body_en: formData.get("body_en") as string || null,
    category: formData.get("category") as string || null,
    status: formData.get("status") as string || "draft",
    published_at: formData.get("published_at") ? new Date(formData.get("published_at") as string).toISOString() : null,
    eyecatch_url: formData.get("eyecatch_url") as string || null,
  };

  let error;
  if (isNew) {
    const { error: insertError } = await supabase.from("news").insert([rawData]);
    error = insertError;
  } else {
    const { error: updateError } = await supabase
      .from("news")
      .update({ ...rawData, updated_at: new Date().toISOString() })
      .eq("id", id);
    error = updateError;
  }

  if (error) {
    console.error("Error saving news:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/news");
  revalidatePath("/[lang]/news", "page"); // Revalidate public news page
  
  return { success: true };
}

export async function deleteNews(id: string) {
  const user = await checkAdmin();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("Error deleting news:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/news");
  return { success: true };
}
