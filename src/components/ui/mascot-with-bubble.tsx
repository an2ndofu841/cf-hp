"use client";

import { useEffect, useState } from "react";
import { MascotCharacter } from "@/components/ui/mascot-character";

interface MascotWithBubbleProps {
  message: string;
  lang?: string;
}

export function MascotWithBubble({ message }: MascotWithBubbleProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 60);
    return () => clearInterval(id);
  }, [message]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-end px-4 pb-4 md:px-10 md:pb-8">
      {/* キャラクター＋吹き出しを縦に重ねるラッパー */}
      <div className="flex flex-col items-center gap-0">
        {/* 吹き出し本体 */}
        <div className="relative border-4 border-foreground bg-background shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] px-3 py-2 md:px-4 md:py-3 w-[200px] md:w-[280px]">
          <p className="text-[11px] md:text-sm font-bold leading-relaxed text-foreground min-h-[2.5em] md:min-h-[1.8em]">
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1em] bg-foreground ml-[1px] align-middle animate-pulse" />
            )}
          </p>
          <div className="mt-1 inline-block border-2 border-foreground bg-foreground px-2 py-[2px] text-[9px] md:text-[10px] font-bold text-background">
            RPG
          </div>
          {/* 吹き出しの三角（下向き、中央） */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-foreground" />
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 translate-y-[-5px] border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent border-t-background" />
        </div>

        {/* キャラクター */}
        <MascotCharacter
          src="/images/mascot.png"
          className="w-20 h-20 md:w-36 md:h-36 drop-shadow-lg z-10 mt-[-2px]"
        />
      </div>
    </div>
  );
}
