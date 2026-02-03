import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      console.warn("Admin check failed:", error?.message || "Not an admin");
      return null;
    }

    return user;
  } catch (e) {
    console.error("Admin check exception:", e);
    return null;
  }
}

export async function requireAdmin() {
  const user = await checkAdmin();
  if (!user) {
    redirect("/ja/auth/login"); // Or a specific admin login page if separated
  }
  return user;
}
