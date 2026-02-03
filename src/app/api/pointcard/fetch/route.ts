import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EDGE_FUNCTION_URL = process.env.POINTCARD_FUNCTION_URL || "https://slrlavptojlkvujoiied.functions.supabase.co/link-profile";
const API_KEY = process.env.POINTCARD_LINK_API_KEY;
const ANON_KEY = process.env.POINTCARD_ANON_KEY;

export async function POST(request: Request) {
  if (!API_KEY) {
    console.error("POINTCARD_LINK_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error (API Key)" }, { status: 500 });
  }

  if (!ANON_KEY) {
    console.error("POINTCARD_ANON_KEY is not set");
    return NextResponse.json({ error: "Server configuration error (Anon Key)" }, { status: 500 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        action: "fetch",
        groupId: groupId,
        hpUserId: user.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Function Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Fetch API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
