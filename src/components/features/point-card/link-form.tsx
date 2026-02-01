"use client";

import React, { useState } from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import { pointCardApi } from "./api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface LinkFormProps {
  onSuccess: () => void;
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await pointCardApi.claimLinkCode(code);
      setSuccess(true);
      setCode("");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to link code. It might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 border-2 border-dashed border-gray-400 rounded">
        <h3 className="text-sm font-bold mb-2 uppercase text-gray-500">
          Link Point Card
        </h3>
        <p className="text-xs mb-4 text-gray-600 dark:text-gray-400">
          Enter your unique code to sync your level and achievements.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER-CODE-HERE"
              className="w-full bg-white dark:bg-black border-4 border-foreground p-2 font-mono text-center uppercase tracking-widest focus:outline-none focus:border-pixel-blue"
              disabled={loading || success}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-pixel-red text-xs font-bold animate-pulse">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-pixel-green text-xs font-bold">
              <CheckCircle size={14} />
              LINK ESTABLISHED! RELOADING...
            </div>
          )}

          <PixelButton
            type="submit"
            variant="primary"
            disabled={loading || success || !code}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "CONNECT"
            )}
          </PixelButton>
        </form>
      </div>
    </div>
  );
}
