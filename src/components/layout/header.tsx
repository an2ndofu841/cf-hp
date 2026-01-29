import React from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

interface HeaderProps {
  lang: string;
}

export async function Header({ lang }: HeaderProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 border-b-4 border-foreground mb-8">
      {/* Logo Area */}
      <Link href={`/${lang}`} className="group relative shrink-0">
        <div className="relative w-48 h-16 md:w-64 md:h-20 transition-transform group-hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="Crazy Fantasy"
            fill
            className="object-contain pixel-rendering"
            priority
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </Link>
      
      {/* Action Area */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
           {user ? (
              <PixelButton href={`/${lang}/adventure-log`} variant="secondary" size="sm" className="border-pixel-yellow text-xs h-10 px-4 whitespace-nowrap">
                 ★ MY PAGE
              </PixelButton>
           ) : (
              <>
                <PixelButton href={`/${lang}/auth/login`} variant="outline" size="sm" className="text-xs h-10 px-6 whitespace-nowrap bg-background text-foreground hover:bg-foreground hover:text-background">
                   LOGIN
                </PixelButton>
                <PixelButton href={`/${lang}/auth/signup`} variant="primary" size="sm" className="text-xs h-10 px-6 whitespace-nowrap">
                   SIGN UP
                </PixelButton>
              </>
           )}
        </div>

        {/* Separator for desktop */}
        <div className="hidden md:block w-1 h-8 bg-foreground/30"></div>

        {/* Lang Buttons */}
        <div className="flex items-center gap-2">
          <PixelButton size="sm" variant={lang === 'ja' ? 'primary' : 'outline'} href="/ja" className="text-xs w-10 h-10 px-0 flex items-center justify-center">JA</PixelButton>
          <PixelButton size="sm" variant={lang === 'en' ? 'primary' : 'outline'} href="/en" className="text-xs w-10 h-10 px-0 flex items-center justify-center">EN</PixelButton>
        </div>
      </div>
    </header>
  );
}
