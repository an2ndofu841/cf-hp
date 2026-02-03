"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, ImageIcon, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertNews } from "@/app/admin/news/actions";

// Define a type that matches the DB schema loosely for the form
type NewsItem = {
  id?: string;
  title_ja: string;
  title_en?: string | null;
  slug: string;
  body_ja?: string | null;
  body_en?: string | null;
  category?: string | null;
  status: "draft" | "published" | "archived";
  published_at?: string | null;
  eyecatch_url?: string | null;
};

export function NewsForm({ initialData }: { initialData?: NewsItem }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [eyecatchUrl, setEyecatchUrl] = useState(initialData?.eyecatch_url || "");
  const router = useRouter();

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `news/${fileName}`;

    setIsUploading(true);
    const supabase = createClient();
    
    // Check if bucket exists, or just try upload
    // Assuming 'images' bucket exists and has policies
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    setEyecatchUrl(publicUrl);
    setIsUploading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
        await upsertNews(formData);
    } catch (e) {
        alert("Failed to save news. Check console for details.");
        console.error(e);
        setIsSubmitting(false);
    }
  };

  // Helper to format date for datetime-local input
  const formatDateForInput = (dateStr?: string | null) => {
    if (!dateStr) return "";
    // dateStr is usually ISO, we need YYYY-MM-DDThh:mm
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link 
            href="/admin/news"
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
            Save News
        </button>
      </div>

      <input type="hidden" name="id" value={initialData?.id || "new"} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Content (Japanese)</h3>
                
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
                        placeholder="記事のタイトル"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="body_ja" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Body
                    </label>
                    <textarea 
                        id="body_ja" 
                        name="body_ja"
                        rows={10}
                        defaultValue={initialData?.body_ja || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 font-mono text-sm"
                        placeholder="記事の本文..."
                    />
                </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Content (English)</h3>
                
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
                        placeholder="Article Title"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="body_en" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Body (EN)
                    </label>
                    <textarea 
                        id="body_en" 
                        name="body_en"
                        rows={10}
                        defaultValue={initialData?.body_en || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 font-mono text-sm"
                        placeholder="Article body..."
                    />
                </div>
            </div>
        </div>

        {/* Sidebar / Meta */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Publishing</h3>

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
                        <option value="archived">Archived (アーカイブ)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="published_at" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Publish Date
                    </label>
                    <input 
                        type="datetime-local" 
                        id="published_at" 
                        name="published_at"
                        defaultValue={formatDateForInput(initialData?.published_at)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Metadata</h3>

                <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="slug" 
                        name="slug"
                        required
                        defaultValue={initialData?.slug}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 font-mono text-sm"
                        placeholder="hello-world"
                    />
                    <p className="text-xs text-zinc-500">URLの一部になります (一意である必要あり)</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Category
                    </label>
                    <select 
                        id="category" 
                        name="category"
                        defaultValue={initialData?.category || ""}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                    >
                        <option value="">Select category...</option>
                        <option value="release">Release</option>
                        <option value="live">Live</option>
                        <option value="media">Media</option>
                        <option value="info">Info</option>
                        <option value="blog">Blog</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">Image</h3>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Eyecatch Image
                    </label>
                    
                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-4 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                            {isUploading ? (
                                <Loader2 className="animate-spin text-zinc-400" size={24} />
                            ) : (
                                <Upload className="text-zinc-400" size={24} />
                            )}
                            <span className="text-sm text-zinc-500">Click to upload</span>
                        </div>
                    </div>

                    <input type="hidden" name="eyecatch_url" value={eyecatchUrl} />
                    
                    {eyecatchUrl && (
                        <div className="relative aspect-video bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 mt-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={eyecatchUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </form>
  );
}
