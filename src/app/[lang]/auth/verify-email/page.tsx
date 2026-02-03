import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { Mail } from "lucide-react";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang === "en";

  return (
    <div className="min-h-screen p-8 sm:p-20 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-md mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1 flex flex-col justify-center">
          <PixelCard className="flex flex-col gap-6 border-4 border-foreground shadow-xl p-8 items-center text-center">
            
            <div className="w-16 h-16 bg-pixel-blue/10 rounded-full flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 text-pixel-blue" />
            </div>

            <div className="space-y-2">
               <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                 {isEn ? "Check Your Email" : "メールを確認してね"}
               </h2>
               <p className="text-xs text-gray-500 font-bold">
                 {isEn ? "VERIFICATION LINK SENT" : "認証リンクを送信しました"}
               </p>
            </div>

            <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {isEn ? (
                    <p>
                        We've sent a verification link to your email address.<br/>
                        Please click the link to start your adventure!
                    </p>
                ) : (
                    <p>
                        登録したメールアドレスに確認リンクを送ったよ！<br/>
                        リンクをクリックして冒険を始めよう。
                    </p>
                )}
            </div>

            <div className="pt-4 w-full">
                <PixelButton href={`/${lang}`} variant="outline" className="w-full">
                    {isEn ? "RETURN TO TITLE" : "タイトルに戻る"}
                </PixelButton>
            </div>

          </PixelCard>
        </div>

        <Footer />
      </main>
    </div>
  );
}
