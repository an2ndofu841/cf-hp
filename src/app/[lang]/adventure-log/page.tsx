import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { redirect } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { PointCardSection } from "@/components/features/point-card/point-card-section";

export default async function AdventureLogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { lang } = await params;
  const { welcome } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/auth/login`);
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-foreground text-background px-4 py-1">ADVENTURE LOG</h2>
            <div className="h-1 flex-1 bg-foreground"></div>
          </div>

          {welcome && (
             <div className="mb-8 bg-pixel-yellow border-4 border-black p-4 text-center animate-bounce">
                <p className="text-xl font-bold">WELCOME NEW HERO!</p>
                <p className="text-sm">Your journey begins now.</p>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar & Basic Info */}
            <div className="md:col-span-1 space-y-6">
               <PixelCard className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-gray-200 border-4 border-black flex items-center justify-center overflow-hidden">
                     {/* Placeholder for Avatar */}
                     <User size={64} className="text-gray-400" />
                  </div>
                  <div className="text-center w-full">
                     <div className="text-xs text-gray-500 font-bold">NAME</div>
                     <div className="text-lg font-bold truncate px-2">{user.email?.split('@')[0]}</div>
                  </div>
                  <div className="text-center w-full">
                     <div className="text-xs text-gray-500 font-bold mb-1">CLASS</div>
                     <div className="bg-pixel-blue text-white py-1 font-bold border-2 border-black text-sm">
                        BEGINNER
                     </div>
                  </div>
               </PixelCard>

                {/* Account Actions */}
                <div className="flex flex-col gap-4">
                     {/* Temporary Logout Button Implementation */}
                     <form action={async () => {
                         "use server";
                         const { logout } = await import("@/app/auth/actions");
                         await logout(lang);
                     }}>
                        <PixelButton variant="outline" className="w-full flex items-center justify-center gap-2 text-sm">
                            <LogOut size={16} /> SAVE & QUIT
                        </PixelButton>
                     </form>
                </div>
            </div>

            {/* Right Column: Point Card & Stats */}
            <div className="md:col-span-2 flex flex-col gap-6">
                <PointCardSection />
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
