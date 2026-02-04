import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit } from "lucide-react";
import { DeleteLiveButton } from "@/components/admin/live-delete-button";

export default async function AdminLivesPage() {
  const supabase = await createClient();
  const statusLabel: Record<string, string> = {
    published: "公開",
    draft: "下書き",
    archived: "アーカイブ",
  };
  
  const { data: lives, error } = await supabase
    .from("lives")
    .select("*, venues(name_ja)")
    .order("date", { ascending: false });

  if (error) {
    return <div className="text-red-500">ライブの読み込みに失敗しました: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ライブ管理</h1>
        <Link 
          href="/admin/lives/new" 
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
              <th className="px-6 py-3 font-medium text-zinc-500">開催日</th>
              <th className="px-6 py-3 font-medium text-zinc-500">タイトル（日本語）</th>
              <th className="px-6 py-3 font-medium text-zinc-500">会場</th>
              <th className="px-6 py-3 font-medium text-zinc-500">ステータス</th>
              <th className="px-6 py-3 font-medium text-zinc-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {lives && lives.length > 0 ? (
              lives.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                    {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                    <div className="text-xs text-zinc-400">{item.open_time} / {item.start_time}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {item.title_ja}
                    {item.title_en && <div className="text-xs text-zinc-400 font-normal">{item.title_en}</div>}
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {/* @ts-ignore - Supabase join typing can be tricky */}
                    {item.venues?.name_ja || "-"}
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
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/lives/${item.id}`}
                      className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <DeleteLiveButton id={item.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  ライブ情報がありません。最初のイベントを作成してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
