import React from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check admin permission
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center px-8 justify-between shrink-0">
          <h2 className="font-bold text-lg">Management Console</h2>
          <div className="text-sm text-zinc-500">
            Welcome back, Admin
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
