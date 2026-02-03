import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { LevelInfo } from "./api";
import { Star, Zap } from "lucide-react";

interface LevelDisplayProps {
  levelInfo: LevelInfo;
}

export function LevelDisplay({ levelInfo }: LevelDisplayProps) {
  const { level, current_exp, next_remaining } = levelInfo;
  
  // Calculate progress percentage
  // Total needed for this level = current_exp + next_remaining
  const totalNeeded = current_exp + next_remaining;
  const progressPercent = totalNeeded > 0 ? (current_exp / totalNeeded) * 100 : 0;

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
              <span>CURRENT EXP</span>
              <span>{current_exp} PT</span>
            </div>
            <div className="h-4 w-full bg-gray-200 border-2 border-black relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-pixel-green transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="text-gray-500 font-bold">NEXT LEVEL:</span>
            <span className="font-mono font-bold">{next_remaining} PT</span>
          </div>
        </div>
      </div>
    </PixelCard>
  );
}
