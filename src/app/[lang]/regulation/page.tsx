import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import {
  DEFAULT_REGULATION_EN,
  DEFAULT_REGULATION_JA,
  getSettingText,
} from "@/lib/regulation";

export default async function RegulationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["regulation_ja", "regulation_en"]);

  const regulationJa =
    getSettingText(data?.find((item) => item.key === "regulation_ja")?.value) ||
    DEFAULT_REGULATION_JA;
  const regulationEn =
    getSettingText(data?.find((item) => item.key === "regulation_en")?.value) ||
    DEFAULT_REGULATION_EN;

  const content = lang === "en" && regulationEn ? regulationEn : regulationJa;

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-5xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-foreground text-background px-4 py-1">
              {lang === "en" ? "REGULATION" : "レギュレーション"}
            </h2>
            <div className="h-1 flex-1 bg-foreground"></div>
          </div>

          <PixelCard className="p-6 md:p-8">
            <div className="whitespace-pre-wrap leading-8 text-sm md:text-base">
              {content}
            </div>
          </PixelCard>
        </div>

        <div className="mt-12 text-center">
          <PixelButton href={`/${lang}`} variant="outline">
            {lang === "en" ? "BACK TO TOP" : "トップへ戻る"}
          </PixelButton>
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
