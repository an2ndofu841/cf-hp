import { createClient } from "@/lib/supabase/server";
import { CommandMenu } from "@/components/ui/command-menu";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MascotCharacter } from "@/components/ui/mascot-character";
import { PixelCard } from "@/components/ui/pixel-card"; // Import PixelCard
import { PixelButton } from "@/components/ui/pixel-button"; // Import PixelButton

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();

  // Check User Session
  const { data: { user } } = await supabase.auth.getUser();

  // Test DB connection
  const { data: news } = await supabase
    .from("news")
    .select("title_ja, title_en, status, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const menuItems = [
    { label: 'NEWS', description: 'Latest Info', href: `/${lang}/news` },
    { label: 'QUEST', description: 'Upcoming Shows', href: `/${lang}/live` },
    { label: 'PROFILE', description: 'Character Stats', href: `/${lang}/profile` },
    { label: 'DISCO', description: 'Sound Test', href: `/${lang}/disco` },
    { label: 'MOVIE', description: 'Cinematics', href: `/${lang}/movie` },
    { label: 'GOODS', description: 'Item Shop', href: `/${lang}/goods` },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12">
        <Header lang={lang} />

        {/* Hero / World Map Section */}
        <section className="w-full">
          <PixelCard className="p-0 overflow-hidden relative aspect-video w-full bg-[#87CEEB]">
             {/* Background Video */}
             <video
               className="absolute inset-0 w-full h-full object-cover pixel-rendering"
               autoPlay
               loop
               muted
               playsInline
               style={{ imageRendering: "pixelated" }}
             >
               <source src="/videos/world-bg.mp4" type="video/mp4" />
             </video>
             
             {/* Character Layer */}
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <MascotCharacter 
                  src="/images/mascot.png" 
                  className="w-32 h-32 md:w-48 md:h-48 drop-shadow-lg z-10" 
                />
             </div>

             {/* Optional Overlay Text or UI */}
             <div className="absolute bottom-4 right-4 bg-background/80 p-2 border-2 border-foreground text-xs">
                WORLD MAP
             </div>
          </PixelCard>
        </section>

        {/* Latest News (DB Connected) */}
        <section>
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold bg-foreground text-background px-4 py-1">LATEST NEWS</h2>
                <div className="h-1 flex-1 bg-foreground"></div>
            </div>
            
            <div className="space-y-4">
                {news && news.length > 0 ? (
                    news.map((item, i) => (
                        <PixelCard key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4">
                            <span className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1">
                                {new Date(item.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex-1 font-bold">
                                {lang === 'en' ? item.title_en : item.title_ja}
                            </span>
                            <PixelButton size="sm" variant="outline" href={`/${lang}/news`}>READ</PixelButton>
                        </PixelCard>
                    ))
                ) : (
                    <PixelCard className="text-center py-12">
                        <p className="text-gray-500 mb-4">No news available.</p>
                    </PixelCard>
                )}
            </div>
            
            <div className="text-center mt-8">
                <PixelButton href={`/${lang}/news`} variant="secondary">VIEW ALL NEWS</PixelButton>
            </div>
        </section>

        {/* Menu Grid (Command Style) */}
        <section>
          <CommandMenu items={menuItems} />
        </section>
        
        <Footer />
      </main>
    </div>
  );
}
