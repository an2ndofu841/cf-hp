"use client";

import { useEffect, useRef, useState } from "react";
import { MascotCharacter } from "@/components/ui/mascot-character";

const MESSAGES_JA = [
  "Crazy Fantasyの公式サイトへようこそ！",
  "次のライブ、絶対来てね！",
  "グッズもチェックしてみてね！",
  "みんなの応援がパワーになるよ！",
  "ニュースも要チェックだよ！",
  "いつも応援ありがとう！",
  "一緒にCrazy Fantasyを盛り上げよう！",
  "レギュレーションも読んでね！",
];

const MESSAGES_EN = [
  "Welcome to the official Crazy Fantasy site!",
  "Don't miss our next live show!",
  "Check out our merch too!",
  "Your support gives us power!",
  "Stay tuned for the latest news!",
  "Thank you for your support!",
  "Let's make Crazy Fantasy even more exciting together!",
  "Please read the regulations too!",
];

function useTypewriter(text: string, speed = 55) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

interface MascotWithBubbleProps {
  lang?: string;
}

export function MascotWithBubble({ lang }: MascotWithBubbleProps) {
  const messages = lang === "en" ? MESSAGES_EN : MESSAGES_JA;
  const [msgIndex, setMsgIndex] = useState(0);
  const { displayed, done } = useTypewriter(messages[msgIndex]);
  const isTyping = useRef(false);

  const handleClick = () => {
    if (!done && isTyping.current) return;
    isTyping.current = true;
    setMsgIndex((prev) => {
      let next: number;
      do {
        next = Math.floor(Math.random() * messages.length);
      } while (next === prev && messages.length > 1);
      return next;
    });
  };

  useEffect(() => {
    if (done) isTyping.current = false;
  }, [done]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-end px-4 pb-4 md:px-10 md:pb-8">
      <div className="flex flex-col items-center gap-0">
        {/* 吹き出し */}
        <div className="relative bg-white border-[3px] border-black rounded-sm px-3 py-2 md:px-4 md:py-3 w-[200px] md:w-[260px] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
          <p className="text-[11px] md:text-sm font-bold leading-relaxed text-black min-h-[2.5em] md:min-h-[1.6em]">
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1em] bg-black ml-[1px] align-middle animate-pulse" />
            )}
          </p>
          {/* 三角（下向き、中央） */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-[10px] border-r-[10px] border-t-[13px] border-l-transparent border-r-transparent border-t-black" />
          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 translate-y-[-5px] border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
        </div>

        {/* キャラクター（クリック可能） */}
        <button
          type="button"
          onClick={handleClick}
          className="pointer-events-auto focus:outline-none active:scale-95 transition-transform cursor-pointer mt-[-2px]"
          aria-label="キャラクターに話しかける"
        >
          <MascotCharacter
            src="/images/mascot.png"
            className="w-20 h-20 md:w-36 md:h-36 drop-shadow-lg z-10"
          />
        </button>
      </div>
    </div>
  );
}
