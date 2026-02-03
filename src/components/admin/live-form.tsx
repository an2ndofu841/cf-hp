"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertLive } from "@/app/admin/lives/actions";

// Types
type Venue = {
    id: string;
    name_ja: string;
};

type LiveItem = {
  id?: string;
  title_ja: string;
  title_en?: string | null;
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
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
        await upsertLive(formData);
    } catch (e) {
        alert("Failed to save live event. Check console for details.");
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
            Back to List
        </Link>
        <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Event
        </button>
      </div>

      <input type="hidden" name="id" value={initialData?.id || "new"} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Event Details (Japanese)</h3>
                
                <div className="space-y-2">
                    <label htmlFor="title_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Title <span className="text-red-500">*</span>
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
                            Price
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
                            Performers
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
                        Notes / Description
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
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Event Details (English)</h3>
                
                <div className="space-y-2">
                    <label htmlFor="title_en" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Title (EN)
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
                            Price (EN)
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
                            Performers (EN)
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
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Scheduling</h3>

                <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Status
                    </label>
                    <select 
                        id="status" 
                        name="status"
                        defaultValue={initialData?.status || "draft"}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="draft">Draft (下書き)</option>
                        <option value="published">Published (公開)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Date <span className="text-red-500">*</span>
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
                            Open
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
                            Start
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
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Location</h3>

                <div className="space-y-2">
                    <label htmlFor="venue_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Venue
                    </label>
                    <select 
                        id="venue_id" 
                        name="venue_id"
                        defaultValue={initialData?.venue_id || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="">Select venue...</option>
                        {venues.map(v => (
                            <option key={v.id} value={v.id}>{v.name_ja}</option>
                        ))}
                    </select>
                    <p className="text-xs text-zinc-500">
                        Venues can be managed in DB (adding UI later)
                    </p>
                </div>
            </div>
        </div>
      </div>
    </form>
  );
}
