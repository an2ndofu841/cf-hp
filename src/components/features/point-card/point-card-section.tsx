"use client";

import React, { useEffect, useState } from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { LinkForm } from "./link-form";
import { LevelDisplay } from "./level-display";
import { TrophyList } from "./trophy-list";
import { pointCardApi, LinkedGroup, LevelInfo, Trophy } from "./api";
import { Loader2, ChevronDown, Trash2 } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";

export function PointCardSection() {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<LinkedGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Initial Fetch: Get Linked Groups
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const myLinks = await pointCardApi.getMyLinks();
      setLinks(myLinks);
      if (myLinks.length > 0) {
        // Keep selected if still exists, else select first
        if (!selectedGroupId || !myLinks.find(l => l.group_id === selectedGroupId)) {
            setSelectedGroupId(myLinks[0].group_id);
        }
      } else {
        setSelectedGroupId(null);
      }
    } catch (error) {
      console.error("Failed to fetch links", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!selectedGroupId) return;
    if (!confirm("Are you sure you want to unlink this card? You will need a NEW code to link again.")) return;

    try {
        setLoading(true);
        await pointCardApi.unlinkGroup(selectedGroupId);
        await fetchLinks();
    } catch (error) {
        console.error("Failed to unlink", error);
        alert("Failed to unlink card.");
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Fetch Data when Group Changes
  useEffect(() => {
    if (!selectedGroupId) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const data = await pointCardApi.getPointCardData(selectedGroupId);
        
        // Map response to LevelInfo
        setLevelInfo({
            level: data.level,
            total_points: data.total_points,
            next_remaining: data.next_remaining,
            // group_name is handled by the selector/link list
        });

        // Map response to Trophy[]
        // Note: Edge Function returns 'earned', UI expects 'achieved'
        // Also need to generate IDs if not provided
        const mappedTrophies: Trophy[] = (data.trophies || []).map((t: any, index: number) => ({
            id: t.id || `trophy-${index}`,
            name: t.name,
            description: t.description,
            rarity: t.rarity,
            achieved: t.earned, // Map earned -> achieved
            achieved_at: t.achieved_at
        }));

        setTrophies(mappedTrophies);
      } catch (error) {
        console.error("Failed to fetch point data", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [selectedGroupId]);

  if (loading) {
    return (
      <PixelCard className="animate-pulse h-48 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </PixelCard>
    );
  }

  // Not Linked State
  if (links.length === 0) {
    return (
      <PixelCard className="border-4 border-dashed border-gray-400 bg-gray-50 dark:bg-zinc-900">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-gray-800 text-white px-2 py-1 text-sm">OFFLINE</span>
          POINT CARD
        </h2>
        <LinkForm onSuccess={fetchLinks} />
      </PixelCard>
    );
  }

  // Linked State
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-pixel-blue text-white px-4 py-1 border-2 border-black">
          POINT CARD
        </h2>
        
        {/* Group Selector (if multiple) */}
        {links.length > 1 && (
          <div className="relative">
            <select
              value={selectedGroupId || ""}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              className="appearance-none bg-white border-4 border-black px-4 py-1 pr-8 font-bold text-sm focus:outline-none cursor-pointer"
            >
              {links.map((link) => (
                <option key={link.id} value={link.group_id}>
                  {link.group_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
          </div>
        )}
        {links.length === 1 && (
            <span className="font-bold text-sm text-gray-500">{links[0].group_name}</span>
        )}
        
        {/* Unlink Button */}
        <button 
            onClick={handleUnlink}
            className="ml-2 text-gray-400 hover:text-pixel-red transition-colors"
            title="Unlink Card"
        >
            <Trash2 size={18} />
        </button>
      </div>

      {dataLoading ? (
        <div className="space-y-4 animate-pulse">
           <div className="h-32 bg-gray-200 rounded border-2 border-gray-300"></div>
           <div className="h-64 bg-gray-200 rounded border-2 border-gray-300"></div>
        </div>
      ) : (
        <>
          {levelInfo && <LevelDisplay levelInfo={levelInfo} />}
          
          <PixelCard>
            <h3 className="text-lg font-bold mb-4 border-b-2 border-dashed border-gray-300 pb-2">
              TROPHIES
            </h3>
            <TrophyList trophies={trophies} />
          </PixelCard>
        </>
      )}
      
      {/* Add Link Button (for linking more groups) */}
      {/* Optional: Could be a modal or toggle */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-gray-500 hover:text-pixel-blue list-none text-right mt-2">
          [+] LINK ANOTHER CARD
        </summary>
        <div className="mt-4">
            <LinkForm onSuccess={fetchLinks} />
        </div>
      </details>
    </div>
  );
}
