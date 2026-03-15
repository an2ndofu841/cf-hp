import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelButton } from "@/components/ui/pixel-button";

const CATEGORY_LABELS: Record<string, { ja: string; en: string }> = {
  mv:      { ja: "MV",        en: "MV" },
  live:    { ja: "LIVE映像",  en: "LIVE" },
  comment: { ja: "コメント",  en: "Comment" },
  other:   { ja: "その他",    en: "Other" },
};

export default async function MoviePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang === "en";

  const supabase = await createClient();
  const { data: movies } = await supabase
    .from("movies")
    .select("id, title_ja, title_en, youtube_id, category, description_ja, description_en, credits, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1 mt-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold bg-foreground text-background px-4 py-2">MOVIE</h2>
            <div className="h-1 flex-1 bg-foreground" />
          </div>

          {movies && movies.length > 0 ? (
            <div className="space-y-10">
              {movies.map((movie) => {
                const title = isEn ? (movie.title_en || movie.title_ja) : movie.title_ja;
                const description = isEn
                  ? (movie.description_en || movie.description_ja || "")
                  : (movie.description_ja || "");
                const catLabel =
                  CATEGORY_LABELS[movie.category]?.[isEn ? "en" : "ja"] ?? movie.category;

                return (
                  <article
                    key={movie.id}
                    className="border-4 border-foreground bg-background shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.15)] overflow-hidden"
                  >
                    {/* YouTube embed */}
                    <div className="relative w-full aspect-video bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${movie.youtube_id}`}
                        title={title}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 md:p-6 space-y-3">
                      <div className="flex items-start gap-3 flex-wrap">
                        <span className="text-xs border-2 border-foreground px-2 py-0.5 font-bold shrink-0">
                          {catLabel}
                        </span>
                        <h3 className="text-base md:text-lg font-bold leading-snug">{title}</h3>
                      </div>

                      {description && (
                        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                          {description}
                        </p>
                      )}

                      {movie.credits && (
                        <p className="text-xs text-foreground/50 whitespace-pre-line border-t border-foreground/10 pt-3">
                          {movie.credits}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border-4 border-foreground p-20 text-center">
              <p className="text-xl">{isEn ? "Coming Soon..." : "準備中..."}</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <PixelButton href={`/${lang}`} variant="outline">← BACK TO TOP</PixelButton>
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
