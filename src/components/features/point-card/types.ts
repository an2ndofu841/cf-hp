export interface LevelInfo {
  level: number;
  total_points: number;
  next_remaining: number;
  group_id: number;
  group_name?: string; // Optional if available
}

export interface Trophy {
  id: string; // or number depending on DB
  name: string;
  description?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  achieved: boolean;
  achieved_at?: string;
  icon_url?: string;
}

export interface UserLink {
  id: number;
  user_id: string;
  group_id: number;
  point_user_id: number;
  created_at: string;
}
