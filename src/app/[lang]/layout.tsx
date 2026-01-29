import type { Metadata } from "next";
import { Geist, Geist_Mono, DotGothic16 } from "next/font/google";
import "../globals.css";
import { ClickSparkle } from "@/components/ui/click-sparkle";
import { CustomCursor } from "@/components/ui/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dotGothic = DotGothic16({
  weight: "400",
  variable: "--font-dot-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crazy Fantasy Official",
  description: "Crazy Fantasy Official Website",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dotGothic.variable} antialiased font-pixel`}
      >
        <CustomCursor />
        <ClickSparkle />
        {children}
      </body>
    </html>
  );
}
