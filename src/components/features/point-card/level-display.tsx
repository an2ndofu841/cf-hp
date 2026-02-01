import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { LevelInfo } from "./api";
import { Star, Zap } from "lucide-react";

interface LevelDisplayProps {
  levelInfo: LevelInfo;
}

export function LevelDisplay({ levelInfo }: LevelDisplayProps) {
  const { level, total_points, next_remaining } = levelInfo;
  
  // Calculate progress percentage (just visual estimation if we don't have max for current level)
  // Assuming next_remaining + current_progress = level_cap? No, usually next_remaining is just a number.
  // Let's just show a visual bar that is always full or animated.
  // Or better: We don't know the cap, so let's just show the numbers clearly.

  return (
    <PixelCard className="bg-white dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        {/* Level Header */}
        <div className="flex items-center justify-between border-b-4 border-foreground pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-pixel-yellow p-1 border-2 border-black">
              <Star size={20} className="text-black" />
            </div>
            <span className="font-bold text-xl">LEVEL</span>
          </div>
          <span className="font-bold text-4xl text-pixel-blue">{level}</span>
        </div>

        {/* EXP Stats */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>TOTAL EXP</span>
              <span>{total_points} PT</span>
            </div>
            <div className="h-4 w-full bg-gray-200 border-2 border-black relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-pixel-green animate-pulse"
                style={{ width: '100%' }} // Always full for total? Or maybe we can't calc % without level table.
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="text-gray-500 font-bold">NEXT LEVEL:</span>
            <span className="font-mono font-bold">-{next_remaining} PT</span>
          </div>
        </div>
      </div>
    </PixelCard>
  );
}
