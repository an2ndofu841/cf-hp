import { createClient } from "@/lib/supabase/server";
import { LiveForm } from "@/components/admin/live-form";
import { notFound } from "next/navigation";

export default async function AdminLiveEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  const supabase = await createClient();

  // Fetch Venues for dropdown
  const { data: venues } = await supabase
    .from("venues")
    .select("id, name_ja")
    .order("name_ja");

  let initialData = undefined;

  if (!isNew) {
    const { data, error } = await supabase
      .from("lives")
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
          {isNew ? "Create Event" : "Edit Event"}
        </h1>
      </div>
      
      <LiveForm initialData={initialData} venues={venues || []} />
    </div>
  );
}
