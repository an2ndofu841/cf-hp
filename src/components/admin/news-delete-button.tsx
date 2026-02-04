"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteNews } from "@/app/admin/news/actions";

export function DeleteNewsButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("このニュースを削除しますか？")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteNews(id);
    if (!result.success) {
      alert(`削除に失敗しました: ${result.error}`);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
      aria-label="ニュースを削除"
      title="削除"
    >
      <Trash2 size={16} />
    </button>
  );
}
