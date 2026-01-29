import { createClient } from "@/lib/supabase/server";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-foreground text-background px-4 py-1">NEWS</h2>
            <div className="h-1 flex-1 bg-foreground"></div>
          </div>

          <div className="space-y-6">
            {news && news.length > 0 ? (
              news.map((item) => (
                <PixelCard key={item.id} className="flex flex-col gap-4">
                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b-2 border-dashed border-gray-300 dark:border-gray-700 pb-2">
                      <span className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 font-mono">
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                      {item.category && (
                        <span className="text-xs border border-foreground px-2 py-0.5 uppercase">
                          {item.category}
                        </span>
                      )}
                   </div>
                   
                   <h3 className="text-xl font-bold">
                     {lang === 'en' ? item.title_en : item.title_ja}
                   </h3>
                   
                   <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                     {lang === 'en' ? item.body_en : item.body_ja}
                   </div>
                </PixelCard>
              ))
            ) : (
              <PixelCard className="text-center py-12">
                <p className="text-gray-500">No news available at the moment.</p>
              </PixelCard>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
             <PixelButton href={`/${lang}`} variant="outline">← BACK TO TOP</PixelButton>
        </div>

        <Footer />
      </main>
    </div>
  );
}
