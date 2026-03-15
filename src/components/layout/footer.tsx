import React from "react";
import Link from "next/link";

interface FooterProps {
  lang?: string;
}

export function Footer({ lang = "ja" }: FooterProps) {
  return (
    <footer className="text-center text-sm mt-8 pb-4 border-t-4 border-foreground pt-6">
      <div className="flex justify-center gap-6 mb-4">
        <a href="#" className="hover:text-pixel-blue hover:underline">X (Twitter)</a>
        <a href="#" className="hover:text-pixel-blue hover:underline">Instagram</a>
        <a href="#" className="hover:text-pixel-blue hover:underline">YouTube</a>
      </div>
      <div className="flex justify-center gap-4 mb-4 text-xs opacity-70">
        <Link href={`/${lang}/tokushoho`} className="hover:underline hover:opacity-100">
          {lang === "en" ? "Specified Commercial Transactions Act" : "特定商取引法に基づく表記"}
        </Link>
      </div>
      <p>© 2026 株式会社めしあがレーベル. All Rights Reserved.</p>
    </footer>
  );
}
