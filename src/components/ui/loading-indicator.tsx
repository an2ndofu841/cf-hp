import React from "react";

export function LoadingIndicator() {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full border-2 border-white text-white font-pixel text-xs animate-pulse">
      <span>Now Loading</span>
      <div className="flex gap-1">
         <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "0s" }}></div>
         <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "0.2s" }}></div>
         <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
}
