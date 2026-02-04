"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin";

export async function upsertLive(formData: FormData) {
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
    date: formData.get("date") ? new Date(formData.get("date") as string).toISOString() : null,
    open_time: formData.get("open_time") as string || null,
    start_time: formData.get("start_time") as string || null,
    venue_id: formData.get("venue_id") as string || null,
    price_ja: formData.get("price_ja") as string || null,
    price_en: formData.get("price_en") as string || null,
    performers_ja: formData.get("performers_ja") as string || null,
    performers_en: formData.get("performers_en") as string || null,
    notes_ja: formData.get("notes_ja") as string || null,
    notes_en: formData.get("notes_en") as string || null,
    status: formData.get("status") as string || "draft",
    // ticket_urls JSON handling is a bit complex with FormData, simplifying for now
    // In a real app we'd use dynamic fields or JSON input
  };

  let error;
  if (isNew) {
    const { error: insertError } = await supabase.from("lives").insert([rawData]);
    error = insertError;
  } else {
    const { error: updateError } = await supabase
      .from("lives")
      .update({ ...rawData, updated_at: new Date().toISOString() })
      .eq("id", id);
    error = updateError;
  }

  if (error) {
    console.error("Error saving live:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/lives");
  revalidatePath("/[lang]/live", "page"); // Revalidate public live page
  return { success: true };
}

export async function deleteLive(id: string) {
  const user = await checkAdmin();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("lives").delete().eq("id", id);

  if (error) {
    console.error("Error deleting live:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/lives");
  return { success: true };
}
