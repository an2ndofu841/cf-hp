"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveRegulationSettings } from "@/app/admin/settings/actions";

export function RegulationForm({
  initialJa,
  initialEn,
}: {
  initialJa: string;
  initialEn: string;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const result = await saveRegulationSettings(formData);
      if (!result.success) {
        alert(`保存に失敗しました: ${result.error}`);
      } else {
        alert("レギュレーションを保存しました。");
      }
    } catch (error) {
      console.error(error);
      alert("保存中に予期しないエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">レギュレーション設定</h1>
          <p className="mt-2 text-sm text-zinc-500">
            公開ページに表示するレギュレーション本文を編集します。
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Save size={16} />
          {isSaving ? "保存中..." : "保存する"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">日本語本文</h2>
            <p className="mt-1 text-xs text-zinc-500">公開ページの日本語表示に使用されます。</p>
          </div>
          <textarea
            name="regulation_ja"
            defaultValue={initialJa}
            rows={36}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-7 text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">英語本文</h2>
            <p className="mt-1 text-xs text-zinc-500">未入力の場合は公開側で日本語本文にフォールバックします。</p>
          </div>
          <textarea
            name="regulation_en"
            defaultValue={initialEn}
            rows={36}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-7 text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </section>
      </div>
    </form>
  );
}
