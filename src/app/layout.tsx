import "../globals.css";
import { Geist, Geist_Mono, DotGothic16 } from "next/font/google";

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

export const metadata = {
  title: "Crazy Fantasy Official",
  description: "Crazy Fantasy Official Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dotGothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
