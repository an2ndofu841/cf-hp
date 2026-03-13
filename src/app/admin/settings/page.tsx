import { createClient } from "@/lib/supabase/server";
import { RegulationForm } from "@/components/admin/regulation-form";
import {
  DEFAULT_REGULATION_EN,
  DEFAULT_REGULATION_JA,
  getSettingText,
} from "@/lib/regulation";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["regulation_ja", "regulation_en"]);

  const initialJa =
    getSettingText(data?.find((item) => item.key === "regulation_ja")?.value) ||
    DEFAULT_REGULATION_JA;
  const initialEn =
    getSettingText(data?.find((item) => item.key === "regulation_en")?.value) ||
    DEFAULT_REGULATION_EN;

  return (
    <RegulationForm initialJa={initialJa} initialEn={initialEn} />
  );
}
