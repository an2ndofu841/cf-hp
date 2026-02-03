import React from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "Admin Console | Crazy Fantasy",
    description: "Content Management System",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check admin permission
  await requireAdmin();

  return (
    <html lang="ja">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
              <AdminSidebar />
              <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-zinc-950">
                <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                     <h2 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">Dashboard</h2>
                     <span className="text-zinc-300 dark:text-zinc-700">/</span>
                     <span className="text-sm text-zinc-500">Overview</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-zinc-500">System Online</span>
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-8 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
              </div>
            </div>
        </body>
    </html>
  );
}
