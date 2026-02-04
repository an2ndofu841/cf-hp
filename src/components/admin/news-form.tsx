"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, Save, ArrowLeft, Maximize2, X } from "lucide-react";
import Link from "next/link";
import { upsertNews } from "@/app/admin/news/actions";
import dynamic from "next/dynamic";
import { ImageModal } from "./image-modal";

const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((m) => m.RichTextEditor),
  { ssr: false }
);

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bodyJa, setBodyJa] = useState(initialData?.body_ja || "");
  const [bodyEn, setBodyEn] = useState(initialData?.body_en || "");

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

  const handleRemoveImage = () => {
    setEyecatchUrl("");
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    // Append rich text content manually since they are controlled components
    formData.set("body_ja", bodyJa);
    formData.set("body_en", bodyEn);
    // Ensure eyecatch_url is set correctly
    formData.set("eyecatch_url", eyecatchUrl);

    try {
        const result = await upsertNews(formData);
        
        if (result.success) {
            router.push('/admin/news');
            router.refresh();
        } else {
            alert(`Failed to save news: ${result.error}`);
            setIsSubmitting(false);
        }
    } catch (e) {
        alert("An unexpected error occurred. Please check console for details.");
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
    <>
        <form action={handleSubmit} className="max-w-5xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8 sticky top-16 z-10 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur py-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link 
                href="/admin/news"
                className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to List
            </Link>
            <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400">
                    {initialData?.id ? "Editing existing post" : "Creating new post"}
                </span>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                </button>
            </div>
        </div>

        <input type="hidden" name="id" value={initialData?.id || "new"} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Japanese Content */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Japanese Content</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">PRIMARY</span>
                    </div>
                    
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            name="title_ja"
                            required
                            defaultValue={initialData?.title_ja}
                            className="w-full px-0 py-2 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 text-3xl font-bold placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none transition-colors"
                            placeholder="Post Title (JA)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Body Content</label>
                        <RichTextEditor 
                            content={bodyJa} 
                            onChange={setBodyJa} 
                            placeholder="Write your content here..."
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-8"></div>

                {/* English Content */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">English Content</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800">OPTIONAL</span>
                    </div>
                    
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            name="title_en"
                            defaultValue={initialData?.title_en || ""}
                            className="w-full px-0 py-2 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 text-2xl font-bold placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none transition-colors"
                            placeholder="Post Title (EN)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Body Content (EN)</label>
                        <RichTextEditor 
                            content={bodyEn} 
                            onChange={setBodyEn} 
                            placeholder="Write content in English..."
                        />
                    </div>
                </div>
            </div>

            {/* Sidebar / Meta */}
            <div className="space-y-6">
                {/* Publishing Card */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Publishing</h3>

                    <div className="space-y-1.5">
                        <label htmlFor="status" className="text-xs font-medium text-zinc-500">Status</label>
                        <select 
                            id="status" 
                            name="status"
                            defaultValue={initialData?.status || "draft"}
                            className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="published_at" className="text-xs font-medium text-zinc-500">Publish Date</label>
                        <input 
                            type="datetime-local" 
                            id="published_at" 
                            name="published_at"
                            defaultValue={formatDateForInput(initialData?.published_at)}
                            className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                        />
                    </div>
                </div>

                {/* Metadata Card */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Metadata</h3>

                    <div className="space-y-1.5">
                        <label htmlFor="slug" className="text-xs font-medium text-zinc-500">Slug URL *</label>
                        <input 
                            type="text" 
                            id="slug" 
                            name="slug"
                            required
                            defaultValue={initialData?.slug}
                            className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                            placeholder="unique-slug-url"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="category" className="text-xs font-medium text-zinc-500">Category</label>
                        <select 
                            id="category" 
                            name="category"
                            defaultValue={initialData?.category || ""}
                            className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                        >
                            <option value="">Uncategorized</option>
                            <option value="release">Release</option>
                            <option value="live">Live</option>
                            <option value="media">Media</option>
                            <option value="info">Info</option>
                            <option value="blog">Blog</option>
                        </select>
                    </div>
                </div>

                {/* Image Card */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Featured Image</h3>

                    <div className="space-y-2">
                        {!eyecatchUrl ? (
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
                                    <span className="text-xs font-medium text-zinc-500">Upload Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 aspect-video">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={eyecatchUrl} 
                                    alt="Preview" 
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
                        <input type="hidden" name="eyecatch_url" value={eyecatchUrl} />
                    </div>
                </div>
            </div>
        </div>
        </form>
        
        {/* Preview Modal */}
        <ImageModal 
            src={eyecatchUrl} 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
        />
    </>
  );
}
