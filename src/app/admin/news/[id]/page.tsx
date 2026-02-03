import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/news-form";
import { notFound } from "next/navigation";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  let initialData = undefined;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }
    initialData = data;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? "Create News" : "Edit News"}
        </h1>
      </div>
      
      <NewsForm initialData={initialData} />
    </div>
  );
}
