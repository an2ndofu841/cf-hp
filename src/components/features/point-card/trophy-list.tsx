import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { Trophy } from "./api";
import { cn } from "@/lib/utils";
import { Trophy as TrophyIcon, Lock } from "lucide-react";

interface TrophyListProps {
  trophies: Trophy[];
}

export function TrophyList({ trophies }: TrophyListProps) {
  if (!trophies || trophies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-300">
        NO TROPHIES YET
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {trophies.map((trophy) => (
        <div
          key={trophy.id}
          className={cn(
            "flex items-center gap-4 p-3 border-2 border-black bg-white dark:bg-zinc-900 transition-all",
            !trophy.achieved && "opacity-50 grayscale bg-gray-100 dark:bg-zinc-800"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 flex items-center justify-center border-2 border-black shrink-0",
              trophy.achieved ? "bg-pixel-yellow" : "bg-gray-300"
            )}
          >
            {trophy.achieved ? (
              <TrophyIcon size={24} className="text-black" />
            ) : (
              <Lock size={24} className="text-gray-500" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm truncate">{trophy.name}</h4>
              {trophy.achieved && (
                <span className="text-[10px] bg-pixel-blue text-white px-1 py-0.5 border border-black leading-none">
                  GET
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={cn(
                  "uppercase font-bold px-1.5 py-0.5 border border-black text-[10px]",
                  trophy.rarity === "legendary" && "bg-pixel-red text-white",
                  trophy.rarity === "epic" && "bg-purple-500 text-white",
                  trophy.rarity === "rare" && "bg-pixel-blue text-white",
                  trophy.rarity === "common" && "bg-gray-200 text-black"
                )}
              >
                {trophy.rarity}
              </span>
              {trophy.achieved_at && (
                <span className="text-gray-500 font-mono">
                  {new Date(trophy.achieved_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
