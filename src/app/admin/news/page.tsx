import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit } from "lucide-react";
import { DeleteNewsButton } from "@/components/admin/news-delete-button";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const statusLabel: Record<string, string> = {
    published: "公開",
    draft: "下書き",
    archived: "アーカイブ",
  };
  
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500">ニュースの読み込みに失敗しました: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ニュース管理</h1>
        <Link 
          href="/admin/news/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          新規作成
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3 font-medium text-zinc-500">公開日</th>
              <th className="px-6 py-3 font-medium text-zinc-500">タイトル（日本語）</th>
              <th className="px-6 py-3 font-medium text-zinc-500">ステータス</th>
              <th className="px-6 py-3 font-medium text-zinc-500">カテゴリ</th>
              <th className="px-6 py-3 font-medium text-zinc-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {news && news.length > 0 ? (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {item.title_ja}
                    {item.title_en && <div className="text-xs text-zinc-400 font-normal">{item.title_en}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${item.status === 'published' 
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                      }`}
                    >
                      {statusLabel[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 uppercase text-xs">
                    {item.category || "-"}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/news/${item.id}`}
                      className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <DeleteNewsButton id={item.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  ニュースがありません。最初の記事を作成してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
