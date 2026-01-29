import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { redirect } from "next/navigation";
import { User, Shield, Star, LogOut } from "lucide-react";

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
            <div className="md:col-span-1">
               <PixelCard className="flex flex-col items-center gap-4 h-full">
                  <div className="w-32 h-32 bg-gray-200 border-4 border-black flex items-center justify-center">
                     {/* Placeholder for Avatar */}
                     <User size={64} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                     <div className="text-xs text-gray-500 font-bold">NAME</div>
                     <div className="text-xl font-bold truncate max-w-[200px]">{user.email?.split('@')[0]}</div>
                  </div>
                  <div className="text-center w-full">
                     <div className="text-xs text-gray-500 font-bold mb-1">CLASS</div>
                     <div className="bg-pixel-blue text-white py-1 font-bold border-2 border-black">
                        BEGINNER
                     </div>
                  </div>
               </PixelCard>
            </div>

            {/* Right Column: Stats & Actions */}
            <div className="md:col-span-2 flex flex-col gap-6">
                {/* Stats */}
                <PixelCard>
                    <h3 className="text-xl font-bold mb-4 border-b-2 border-dashed border-gray-300 pb-2">STATUS</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Star size={16} /> LEVEL</span>
                            <span className="font-bold">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Shield size={16} /> QUESTS CLEARED</span>
                            <span className="font-bold">0</span>
                        </div>
                        <div className="flex items-center justify-between">
                             <span className="flex items-center gap-2">EXP (Points)</span>
                             <div className="w-32 h-4 bg-gray-200 border-2 border-black relative">
                                 <div className="absolute top-0 left-0 h-full bg-pixel-green w-[10%]"></div>
                             </div>
                        </div>
                    </div>
                </PixelCard>

                {/* Account Actions */}
                <div className="flex flex-col gap-4">
                     <form action="/auth/signout" method="post"> 
                        {/* Note: Server Action for signout needs to be imported or handled via API route if using form action directly 
                            Or we can use a client component wrapper. 
                            Let's use a simpler link for now or just a button that calls our action via a client wrapper.
                            Wait, we made a 'logout' action in src/app/auth/actions.ts.
                            We need to wrap it in a form.
                        */}
                     </form>
                     
                     {/* Temporary Logout Button Implementation */}
                     <form action={async () => {
                         "use server";
                         const { logout } = await import("@/app/auth/actions");
                         await logout(lang);
                     }}>
                        <PixelButton variant="outline" className="w-full flex items-center justify-center gap-2">
                            <LogOut size={16} /> SAVE & QUIT (LOGOUT)
                        </PixelButton>
                     </form>
                </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
