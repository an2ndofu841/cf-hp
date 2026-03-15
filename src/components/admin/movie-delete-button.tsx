"use client";

import { deleteMovie } from "@/app/admin/movies/actions";

export function MovieDeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("この動画を削除しますか？")) return;
    const result = await deleteMovie(id);
    if (!result.success) alert(`削除に失敗しました: ${result.error}`);
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
    >
      削除
    </button>
  );
}
