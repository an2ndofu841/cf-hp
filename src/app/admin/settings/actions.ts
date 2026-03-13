"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkAdmin } from "@/lib/admin";

export async function saveRegulationSettings(formData: FormData) {
  const user = await checkAdmin();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();
  const regulationJa = (formData.get("regulation_ja") as string) || "";
  const regulationEn = (formData.get("regulation_en") as string) || "";

  const { error } = await supabase.from("settings").upsert(
    [
      {
        key: "regulation_ja",
        value: { content: regulationJa },
        description: "公開レギュレーション本文（日本語）",
      },
      {
        key: "regulation_en",
        value: { content: regulationEn },
        description: "公開レギュレーション本文（英語）",
      },
    ],
    { onConflict: "key" }
  );

  if (error) {
    console.error("Error saving regulation settings:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/ja/regulation");
  revalidatePath("/en/regulation");
  revalidatePath("/ja");
  revalidatePath("/en");

  return { success: true };
}
