import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">ダッシュボード</h1>
          <p className="text-zinc-500 mt-2 text-sm">おかえりなさい。コンテンツと設定を管理できます。</p>
        </div>
        <div className="text-xs text-zinc-400 font-mono">
            最終ログイン: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/news" className="block group">
            <div className="h-full p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Newspaper className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-full">ニュース</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">ニュース</h3>
                <p className="text-sm text-zinc-500 line-clamp-2">お知らせ記事の作成・管理を行います。</p>
            </div>
        </Link>

        <Link href="/admin/lives" className="block group">
            <div className="h-full p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-full">ライブ</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">ライブ</h3>
                <p className="text-sm text-zinc-500 line-clamp-2">ライブ情報やツアー日程を管理します。</p>
            </div>
        </Link>
      </div>
    </div>
  );
}
