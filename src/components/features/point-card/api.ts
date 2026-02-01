import { createClient } from "@/lib/supabase/client";

export type LevelInfo = {
  level: number;
  total_points: number;
  next_remaining: number;
  group_name?: string; // Optional, depends on RPC
};

export type Trophy = {
  id: string;
  name: string;
  description?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  achieved: boolean;
  achieved_at?: string;
};

export type LinkedGroup = {
  id: number; // link id
  group_id: number;
  group_name: string;
};

// RPC Actions (Client-side wrapper)
export const pointCardApi = {
  claimLinkCode: async (code: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("claim_user_link_code", {
      p_code: code,
    });
    if (error) throw error;
    return data; // { group_id, point_user_id }
  },

  getLevel: async (groupId: number) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_linked_level", {
      p_group_id: groupId,
    });
    if (error) throw error;
    // Ensure array or single object handling
    return (Array.isArray(data) ? data[0] : data) as LevelInfo;
  },

  getTrophies: async (groupId: number) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_linked_trophies", {
      p_group_id: groupId,
    });
    if (error) throw error;
    return data as Trophy[];
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
