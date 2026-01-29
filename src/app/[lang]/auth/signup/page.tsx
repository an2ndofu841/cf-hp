import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { signup } from "@/app/auth/actions";

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { lang } = await params;
  const { error } = await searchParams;

  return (
    <div className="min-h-screen p-8 sm:p-20 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-md mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1 flex flex-col justify-center">
          <PixelCard className="flex flex-col gap-6 border-4 border-foreground shadow-xl">
            <div className="text-center border-b-4 border-dashed border-gray-300 pb-4">
               <h2 className="text-2xl font-bold uppercase">NEW ADVENTURE</h2>
               <p className="text-xs text-gray-500">JOIN THE PARTY</p>
            </div>

            {error && (
                <div className="bg-pixel-red/20 border-2 border-pixel-red p-2 text-pixel-red text-sm font-bold text-center">
                    ERROR: {error}
                </div>
            )}

            <form action={signup} className="flex flex-col gap-4">
              <input type="hidden" name="lang" value={lang} />
              
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase" htmlFor="email">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email"
                  required 
                  className="w-full bg-gray-100 text-black border-4 border-gray-300 p-2 font-mono focus:border-pixel-blue focus:outline-none"
                  placeholder="hero@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase" htmlFor="password">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="new-password"
                  required 
                  className="w-full bg-gray-100 text-black border-4 border-gray-300 p-2 font-mono focus:border-pixel-blue focus:outline-none"
                  placeholder="********"
                />
              </div>

              <div className="mt-4">
                <PixelButton type="submit" variant="secondary" className="w-full">
                  START GAME (SIGN UP)
                </PixelButton>
              </div>
            </form>

            <div className="text-center text-sm mt-4">
                <p className="mb-2 text-gray-500">Already have a save file?</p>
                <PixelButton href={`/${lang}/auth/login`} variant="outline" size="sm">
                    LOAD GAME (LOGIN)
                </PixelButton>
            </div>
          </PixelCard>
        </div>

        <Footer />
      </main>
    </div>
  );
}
