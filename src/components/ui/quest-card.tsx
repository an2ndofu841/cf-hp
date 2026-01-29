import React from "react";
import { PixelCard } from "./pixel-card";
import { PixelButton } from "./pixel-button";
import { cn } from "@/lib/utils";
import { Sword, MapPin, Calendar, Trophy, AlertCircle } from "lucide-react";

interface QuestCardProps {
  questName: string; // Live Title
  objective: string; // Venue
  date: string; // Date
  time: string; // Open/Start
  reward?: string; // Price or Bonus
  description?: string; // Notes
  actionUrl?: string; // Ticket URL
  imageUrl?: string; // Flyer Image
  isCompleted?: boolean; // Past event
  className?: string;
  lang: string;
}

export function QuestCard({
  questName,
  objective,
  date,
  time,
  reward,
  description,
  actionUrl,
  imageUrl,
  isCompleted = false,
  className,
  lang,
}: QuestCardProps) {
  return (
    <PixelCard
      className={cn(
        "relative p-6 flex flex-col gap-6",
        isCompleted && "opacity-60 grayscale",
        className
      )}
    >
      {/* Quest Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-dashed border-foreground/30 pb-4 gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-pixel-red text-white p-2 border-2 border-black shrink-0">
            <Sword size={24} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-1">QUEST NAME</div>
            <h3 className="text-xl md:text-2xl font-bold uppercase leading-tight">
              {questName}
            </h3>
          </div>
        </div>
        
        {isCompleted ? (
           <div className="bg-gray-500 text-white px-4 py-1 font-bold border-2 border-black rotate-3">
             CLEARED
           </div>
        ) : (
           <div className="bg-pixel-yellow text-black px-4 py-1 font-bold border-2 border-black animate-pulse">
             NEW QUEST
           </div>
        )}
      </div>

      {/* Quest Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Objectives */}
        <div className="space-y-4">
          
          {/* Flyer Image */}
          {imageUrl && (
            <div className="relative w-full aspect-[3/4] border-4 border-foreground pixel-shadow mb-4 overflow-hidden group cursor-pointer">
              <img 
                src={imageUrl} 
                alt="Quest Flyer" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          )}

          {/* Objective: Location */}
          <div className="flex items-start gap-3">
             <MapPin className="shrink-0 mt-1 text-pixel-blue" size={20} />
             <div>
               <div className="text-xs font-bold text-gray-500">OBJECTIVE (LOCATION)</div>
               <div className="font-bold text-lg">{objective}</div>
             </div>
          </div>

          {/* Condition: Time */}
          <div className="flex items-start gap-3">
             <Calendar className="shrink-0 mt-1 text-pixel-green" size={20} />
             <div>
               <div className="text-xs font-bold text-gray-500">CONDITIONS (TIME)</div>
               <div className="font-bold">
                 {date} <br/>
                 <span className="text-sm text-gray-600">{time}</span>
               </div>
             </div>
          </div>

        </div>

        {/* Right Column: Rewards & Notes */}
        <div className="space-y-4">
           {/* Reward */}
           <div className="flex items-start gap-3">
             <Trophy className="shrink-0 mt-1 text-pixel-yellow" size={20} />
             <div>
               <div className="text-xs font-bold text-gray-500">REWARD (PRICE)</div>
               <div className="font-bold text-lg">{reward || "Unknown"}</div>
             </div>
           </div>
           
           {/* Description */}
           {description && (
             <div className="flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-1 text-gray-400" size={20} />
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {description}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex justify-end">
        {isCompleted ? (
            <PixelButton disabled variant="outline">QUEST COMPLETED</PixelButton>
        ) : (
            <PixelButton href={actionUrl || "#"} variant="danger" size="lg" className="w-full md:w-auto">
                ACCEPT QUEST (TICKET)
            </PixelButton>
        )}
      </div>

    </PixelCard>
  );
}
