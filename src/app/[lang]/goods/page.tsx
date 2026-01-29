import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";

export default async function GoodsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen p-8 sm:p-20 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />
        <div className="flex-1">
             <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold bg-foreground text-background px-4 py-2">GOODS</h2>
                <div className="h-1 flex-1 bg-foreground"></div>
            </div>
            <PixelCard className="text-center py-20">
                <p className="text-xl">Coming Soon...</p>
            </PixelCard>
        </div>
        <div className="mt-12 text-center">
             <PixelButton href={`/${lang}`} variant="outline">← BACK TO TOP</PixelButton>
        </div>
        <Footer />
      </main>
    </div>
  );
}
