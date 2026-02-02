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
      console.error("Auth Error:", authError);
      return NextResponse.json({ error: "Unauthorized: Please log in again" }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    console.log("Calling Edge Function for claim...");

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
      console.error(`Edge Function Error (${response.status}):`, errorText);
      
      let errorJson: any;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { error: errorText || `Edge Function Error: ${response.status}` };
      }

      // フロントエンドが期待する { error: "message" } の形式に合わせる
      if (!errorJson.error && errorJson.message) {
        errorJson.error = errorJson.message;
      }

      // そのままフロントに返す（statusも引き継ぐ）
      return NextResponse.json(
        errorJson, 
        { status: response.status }
      );
    }

    const data = await response.json();

    // 連携成功時、ローカルDBに保存
    if (data.success && data.group_id) {
      const { error: dbError } = await supabase
        .from("user_profile_links")
        .upsert(
          {
            user_id: user.id,
            group_id: data.group_id,
          },
          { onConflict: "user_id, group_id" }
        );

      if (dbError) {
        console.error("Failed to save link locally:", dbError);
        // ローカル保存失敗でも、連携自体は成功しているのでエラーにはしないがログに残す
      }
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Claim API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
