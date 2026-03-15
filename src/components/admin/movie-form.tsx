"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { upsertMovie } from "@/app/admin/movies/actions";

interface MovieData {
  id?: string;
  title_ja?: string;
  title_en?: string;
  youtube_id?: string;
  category?: string;
  description_ja?: string;
  description_en?: string;
  credits?: string;
  status?: string;
  published_at?: string;
}

const CATEGORIES = [
  { value: "mv", label: "MV" },
  { value: "live", label: "LIVE映像" },
  { value: "comment", label: "コメント動画" },
  { value: "other", label: "その他" },
];

export function MovieForm({ movie }: { movie?: MovieData }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState(movie?.youtube_id ?? "");

  const previewId = youtubeInput.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )?.[1] ?? (/^[a-zA-Z0-9_-]{11}$/.test(youtubeInput.trim()) ? youtubeInput.trim() : "");

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const result = await upsertMovie(formData);
      if (!result.success) {
        alert(`保存に失敗しました: ${result.error}`);
      } else {
        router.push("/admin/movies");
      }
    } catch (e) {
      console.error(e);
      alert("保存中にエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {movie?.id && <input type="hidden" name="id" value={movie.id} />}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {movie?.id ? "動画を編集" : "動画を追加"}
        </h1>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          <Save size={16} />
          {isSaving ? "保存中..." : "保存する"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">基本情報</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  タイトル（日本語）<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="title_ja"
                  required
                  defaultValue={movie?.title_ja}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  タイトル（English）
                </label>
                <input
                  name="title_en"
                  defaultValue={movie?.title_en ?? ""}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  カテゴリ
                </label>
                <select
                  name="category"
                  defaultValue={movie?.category ?? "mv"}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    ステータス
                  </label>
                  <select
                    name="status"
                    defaultValue={movie?.status ?? "draft"}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    公開日
                  </label>
                  <input
                    type="date"
                    name="published_at"
                    defaultValue={
                      movie?.published_at
                        ? new Date(movie.published_at).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">説明・クレジット</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">説明（日本語）</label>
                <textarea
                  name="description_ja"
                  defaultValue={movie?.description_ja ?? ""}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">説明（English）</label>
                <textarea
                  name="description_en"
                  defaultValue={movie?.description_en ?? ""}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  クレジット（作詞・作曲など）
                </label>
                <textarea
                  name="credits"
                  defaultValue={movie?.credits ?? ""}
                  rows={3}
                  placeholder={"例）\n作詞・作曲・編曲　JVNTA\n歌　Crazy Fantasy"}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">YouTube動画</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  YouTube URL または 動画ID<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="youtube_id"
                  required
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="例）https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <p className="mt-1 text-xs text-zinc-500">YouTube URL・embed URL・動画IDのいずれかを入力してください。</p>
              </div>
              {previewId && (
                <div>
                  <p className="mb-2 text-xs font-medium text-zinc-500">プレビュー</p>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${previewId}`}
                      title="preview"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
