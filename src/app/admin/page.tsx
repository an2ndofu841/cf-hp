import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500">Manage your website content here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/news" className="block group">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm group-hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium text-zinc-500">News</h3>
                    <Newspaper className="h-4 w-4 text-zinc-500 group-hover:text-blue-500" />
                </div>
                <div className="text-2xl font-bold mt-2">Manage News</div>
            </div>
        </Link>

        <Link href="/admin/lives" className="block group">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm group-hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium text-zinc-500">Lives</h3>
                    <Calendar className="h-4 w-4 text-zinc-500 group-hover:text-blue-500" />
                </div>
                <div className="text-2xl font-bold mt-2">Manage Lives</div>
            </div>
        </Link>
      </div>
    </div>
  );
}
