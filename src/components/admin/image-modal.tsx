"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function ImageModal({ 
    src, 
    isOpen, 
    onClose 
}: { 
    src: string; 
    isOpen: boolean; 
    onClose: () => void;
}) {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-3xl p-4 outline-none animate-in zoom-in-95 duration-200">
                    <div className="relative bg-zinc-900 rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={src} 
                            alt="Preview" 
                            className="w-full h-auto max-h-[80vh] object-contain" 
                        />
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
