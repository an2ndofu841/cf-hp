import { createClient } from "@/lib/supabase/client";
import { LevelInfo, LinkedGroup, Trophy } from "./types";

export type { LevelInfo, LinkedGroup, Trophy };

// RPC Actions (Client-side wrapper)
export const pointCardApi = {
  claimLinkCode: async (code: string) => {
    const response = await fetch("/api/pointcard/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to claim code");
    }

    return await response.json(); // Expected: { group_id, point_user_id, ... }
  },

  getPointCardData: async (groupId: number) => {
    const response = await fetch("/api/pointcard/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch data");
    }

    return await response.json(); // Expected: { level_info: ..., trophies: ... } or flat structure
  },

  getMyLinks: async () => {
    const supabase = createClient();
    // Assuming user_profile_links table exists and has RLS for select
    // We also need group name. Assuming a 'groups' table exists.
    // If we can't join, we'll just show IDs.
    const { data, error } = await supabase
      .from("user_profile_links")
      .select(`
        id,
        group_id,
        groups (
          name
        )
      `);
    
    if (error) throw error;
    
    return data.map((link: any) => ({
      id: link.id,
      group_id: link.group_id,
      group_name: link.groups?.name || `Group ${link.group_id}`,
    })) as LinkedGroup[];
  },

  unlinkGroup: async (groupId: number) => {
    const supabase = createClient();
    const { error } = await supabase.rpc("unlink_user_group", {
      p_group_id: groupId,
    });
    if (error) throw error;
  }
};
