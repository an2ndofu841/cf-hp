import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuestCard } from "@/components/ui/quest-card";
import { PixelCard } from "@/components/ui/pixel-card";

export default async function LivePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();

// Test Data for Quest (will be replaced by DB data later)
  const testLives = [
    {
      id: "test-quest-001",
      title_ja: "KIRA KIRA de Fes mini !!",
      title_en: "KIRA KIRA de Fes mini !!",
      venue: { name_ja: "新宿Biske", name_en: "Shinjuku Biske", map_url: "https://goo.gl/maps/placeholder" },
      date: "2026-01-31",
      open_time: "10:45",
      start_time: "11:00",
      price_ja: "最前 5000円 / 前方 2000円 / 通常 0円 (+1D)",
      price_en: "VIP 5000 / Front 2000 / General 0 (+1D)",
      description_ja: "販売：1/26(月) 23:00開始\nhttps://t-dv.com/KIRAKIRAdeFesmini20260131",
      description_en: "Tickets on sale Jan 26, 23:00",
      image_url: "/images/flyers/kira-kira-flyer-main.png",
      ticket_url: "https://t-dv.com/KIRAKIRAdeFesmini20260131"
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-foreground text-background px-4 py-1">QUEST BOARD</h2>
            <div className="h-1 flex-1 bg-foreground"></div>
          </div>

          <div className="space-y-6">
            {/* Using Test Data for now to show the Flyer implementation */}
            {testLives.map((live) => (
                <QuestCard
                  key={live.id}
                  lang={lang}
                  questName={lang === 'en' ? live.title_en : live.title_ja}
                  objective={lang === 'en' ? live.venue?.name_en : live.venue?.name_ja}
                  date={new Date(live.date).toLocaleDateString()}
                  time={`OPEN ${live.open_time} / START ${live.start_time}`}
                  reward={lang === 'en' ? live.price_en : live.price_ja}
                  description={lang === 'en' ? live.description_en : live.description_ja}
                  actionUrl={live.ticket_url}
                  imageUrl={live.image_url}
                  isCompleted={new Date(live.date) < new Date()}
                />
            ))}
            
            {/* DB Data (Commented out until real data with images is ready, or mix them) */}
            {/* {lives && lives.length > 0 && lives.map((live) => (...))} */}
          </div>
        </div>

        <div className="mt-12 text-center">
             <Footer />
        </div>
      </main>
    </div>
  );
}
