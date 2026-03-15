import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MovieDeleteButton } from "@/components/admin/movie-delete-button";

const CATEGORY_LABELS: Record<string, string> = {
  mv: "MV",
  live: "LIVE",
  comment: "コメント",
  other: "その他",
};

export default async function AdminMoviesPage() {
  const supabase = await createClient();
  const { data: movies } = await supabase
    .from("movies")
    .select("id, title_ja, youtube_id, category, status, published_at")
    .order("published_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">動画管理</h1>
        <Link
          href="/admin/movies/new"
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={16} />
          新規追加
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {movies && movies.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">サムネイル</th>
                <th className="px-4 py-3 text-left">タイトル</th>
                <th className="px-4 py-3 text-left">カテゴリ</th>
                <th className="px-4 py-3 text-left">ステータス</th>
                <th className="px-4 py-3 text-left">公開日</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <img
                      src={`https://img.youtube.com/vi/${movie.youtube_id}/mqdefault.jpg`}
                      alt={movie.title_ja}
                      className="w-24 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 max-w-[220px] truncate">
                    {movie.title_ja}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {CATEGORY_LABELS[movie.category] ?? movie.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        movie.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {movie.status === "published" ? "公開中" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {movie.published_at
                      ? new Date(movie.published_at).toLocaleDateString("ja-JP")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/movies/${movie.id}`}
                      className="text-sm px-3 py-1 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                      編集
                    </Link>
                    <MovieDeleteButton id={movie.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-zinc-500">
            <p>動画が登録されていません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
