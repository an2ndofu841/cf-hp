"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Upload, Maximize2, X } from "lucide-react";
import Link from "next/link";
import { upsertLive } from "@/app/admin/lives/actions";
import { createClient } from "@/lib/supabase/client";
import { ImageModal } from "@/components/admin/image-modal";

// Types
type Venue = {
    id: string;
    name_ja: string;
};

type LiveItem = {
  id?: string;
  title_ja: string;
  title_en?: string | null;
  image_url?: string | null;
  date: string; // ISO string
  open_time?: string | null;
  start_time?: string | null;
  venue_id?: string | null;
  price_ja?: string | null;
  price_en?: string | null;
  performers_ja?: string | null;
  performers_en?: string | null;
  notes_ja?: string | null;
  notes_en?: string | null;
  status: "draft" | "published" | "archived";
};

export function LiveForm({ initialData, venues }: { initialData?: LiveItem, venues: Venue[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState(initialData?.image_url || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `lives/${fileName}`;

    setIsUploading(true);
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      alert(`アップロードに失敗しました: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    setFlyerUrl(publicUrl);
    setIsUploading(false);
  };

  const handleRemoveImage = () => {
    setFlyerUrl("");
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.set("image_url", flyerUrl);
    try {
        const result = await upsertLive(formData);
        if (result.success) {
            router.push("/admin/lives");
            router.refresh();
        } else {
            alert(`保存に失敗しました: ${result.error}`);
            setIsSubmitting(false);
        }
    } catch (e) {
        alert("保存に失敗しました。詳細はコンソールをご確認ください。");
        console.error(e);
        setIsSubmitting(false);
    }
  };

  // Helper to format date for datetime-local input
  const formatDateForInput = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link 
            href="/admin/lives"
            className="flex items-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
            <ArrowLeft size={16} className="mr-2" />
            一覧へ戻る
        </Link>
        <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            保存する
        </button>
      </div>

      <input type="hidden" name="id" value={initialData?.id || "new"} />
      <input type="hidden" name="image_url" value={flyerUrl} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">イベント詳細（日本語）</h3>
                
                <div className="space-y-2">
                    <label htmlFor="title_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        タイトル <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="title_ja" 
                        name="title_ja"
                        required
                        defaultValue={initialData?.title_ja}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        placeholder="イベント名"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            料金
                        </label>
                        <input 
                            type="text" 
                            id="price_ja" 
                            name="price_ja"
                            defaultValue={initialData?.price_ja || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="¥3,500 (1D別)"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="performers_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            出演者
                        </label>
                        <input 
                            type="text" 
                            id="performers_ja" 
                            name="performers_ja"
                            defaultValue={initialData?.performers_ja || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="出演者..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="notes_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        備考・詳細
                    </label>
                    <textarea 
                        id="notes_ja" 
                        name="notes_ja"
                        rows={5}
                        defaultValue={initialData?.notes_ja || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 font-mono text-sm"
                        placeholder="詳細情報..."
                    />
                </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">イベント詳細（英語）</h3>
                
                <div className="space-y-2">
                    <label htmlFor="title_en" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        タイトル（英語）
                    </label>
                    <input 
                        type="text" 
                        id="title_en" 
                        name="title_en"
                        defaultValue={initialData?.title_en || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        placeholder="Event Name"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price_en" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            料金（英語）
                        </label>
                        <input 
                            type="text" 
                            id="price_en" 
                            name="price_en"
                            defaultValue={initialData?.price_en || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="3,500 JPY"
                        />
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="performers_en" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            出演者（英語）
                        </label>
                        <input 
                            type="text" 
                            id="performers_en" 
                            name="performers_en"
                            defaultValue={initialData?.performers_en || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="Artists..."
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar / Meta */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">公開設定</h3>

                <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        ステータス
                    </label>
                    <select 
                        id="status" 
                        name="status"
                        defaultValue={initialData?.status || "draft"}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="draft">下書き</option>
                        <option value="published">公開</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        開催日時 <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="datetime-local" 
                        id="date" 
                        name="date"
                        required
                        defaultValue={formatDateForInput(initialData?.date)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="open_time" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        開場
                        </label>
                        <input 
                            type="text" 
                            id="open_time" 
                            name="open_time"
                            defaultValue={initialData?.open_time || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="18:00"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="start_time" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        開演
                        </label>
                        <input 
                            type="text" 
                            id="start_time" 
                            name="start_time"
                            defaultValue={initialData?.start_time || ""}
                            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                            placeholder="19:00"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">フライヤー画像</h3>

                <div className="space-y-2">
                    {!flyerUrl ? (
                        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer relative group">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                                {isUploading ? (
                                    <Loader2 className="animate-spin text-zinc-400" size={24} />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                        <Upload className="text-zinc-400 dark:text-zinc-500" size={20} />
                                    </div>
                                )}
                                <span className="text-xs font-medium text-zinc-500">画像をアップロード</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={flyerUrl} 
                                alt="Flyer preview" 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
                                >
                                    <Maximize2 size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded-full text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">会場</h3>

                <div className="space-y-2">
                    <label htmlFor="venue_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        会場
                    </label>
                    <select 
                        id="venue_id" 
                        name="venue_id"
                        defaultValue={initialData?.venue_id || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="">会場を選択...</option>
                        {venues.map(v => (
                            <option key={v.id} value={v.id}>{v.name_ja}</option>
                        ))}
                    </select>
                    <p className="text-xs text-zinc-500">
                        会場はDBで管理します（UIは後で追加予定）
                    </p>
                </div>
            </div>
        </div>
      </div>
    </form>
    <ImageModal 
        src={flyerUrl} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
    />
  );
}
