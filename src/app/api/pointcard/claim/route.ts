import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EDGE_FUNCTION_URL = process.env.POINT_CARD_FUNCTION_URL || "https://slrlavptojlkvujoiied.functions.supabase.co/link-profile";
const API_KEY = process.env.POINT_CARD_API_KEY;

export async function POST(request: Request) {
  if (!API_KEY) {
    console.error("POINT_CARD_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        action: "claim",
        code,
        hpUserId: user.id,
      }),
    });

    if (!response.ok) {
      // Edge Functionからの生のエラーレスポンスを取得
      const errorText = await response.text();
      console.error("Edge Function Error:", errorText);
      
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { error: errorText || "Unknown error from Edge Function" };
      }

      // そのままフロントに返す（statusも引き継ぐ）
      return NextResponse.json(
        errorJson, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Claim API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
