import React from "react";

export function Footer() {
  return (
    <footer className="text-center text-sm mt-8 pb-4 border-t-4 border-foreground pt-6">
      <div className="flex justify-center gap-6 mb-4">
        <a href="#" className="hover:text-pixel-blue hover:underline">X (Twitter)</a>
        <a href="#" className="hover:text-pixel-blue hover:underline">Instagram</a>
        <a href="#" className="hover:text-pixel-blue hover:underline">YouTube</a>
      </div>
      <p>© 2026 Crazy Fantasy. All Rights Reserved.</p>
    </footer>
  );
}
