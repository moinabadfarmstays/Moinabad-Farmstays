// app/(app)/detail/[id]/_components/AmenitiesSection.jsx
"use client";
import { useState } from "react";
import { Wifi, Tv, Coffee, Wind, Droplet, Check, ChevronDown, ChevronUp } from "lucide-react";

const PREVIEW = 6;

function getIcon(amenity) {
  const a = amenity.toLowerCase();
  if (a.includes("wifi")) return <Wifi className="w-4 h-4 shrink-0" />;
  if (a.includes("tv")) return <Tv className="w-4 h-4 shrink-0" />;
  if (a.includes("breakfast")) return <Coffee className="w-4 h-4 shrink-0" />;
  if (a.includes("ac")) return <Wind className="w-4 h-4 shrink-0" />;
  if (a.includes("geyser")) return <Droplet className="w-4 h-4 shrink-0" />;
  return <Check className="w-4 h-4 shrink-0" />;
}

export default function AmenitiesSection({ amenities = [] }) {
  const [expanded, setExpanded] = useState(false);

  const preview = amenities.slice(0, PREVIEW);
  const extra = amenities.slice(PREVIEW);
  const hasMore = extra.length > 0;

  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-5 sm:p-6 shadow-luxury">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-luxury-black">Amenities</h2>
        {amenities.length > 0 && (
          <span className="rounded-full bg-luxury-sand px-3 py-1 text-xs font-semibold text-luxury-charcoal">
            {amenities.length} total
          </span>
        )}
      </div>

      {/* First 6 — always visible */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {preview.map((amenity, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-luxury-stone/60 bg-luxury-sand/50 px-4 py-3 transition-all duration-200 hover:border-luxury-gold/40 hover:bg-luxury-sand"
          >
            {getIcon(amenity)}
            <span className="text-sm font-medium text-luxury-black truncate">{amenity}</span>
          </div>
        ))}
      </div>

      {/* Extra amenities — scrollable container, revealed on expand */}
      {hasMore && (
        <>
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              expanded ? "max-h-[280px]" : "max-h-0"
            }`}
          >
            {/* Scrollable inner */}
            <div className="mt-3 max-h-[260px] overflow-y-auto pr-1 custom-scroll">
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {extra.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-luxury-stone/60 bg-luxury-sand/50 px-4 py-3 transition-all duration-200 hover:border-luxury-gold/40 hover:bg-luxury-sand"
                  >
                    {getIcon(amenity)}
                    <span className="text-sm font-medium text-luxury-black truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle button */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-luxury-gold/40 bg-luxury-gold/10 py-2.5 text-sm font-semibold text-luxury-gold-dark transition-all duration-200 hover:bg-luxury-gold/20 hover:border-luxury-gold/60 active:scale-[0.99]"
          >
            {expanded ? (
              <><ChevronUp className="h-4 w-4" /> Show less</>
            ) : (
              <><ChevronDown className="h-4 w-4" /> Show {extra.length} more amenit{extra.length === 1 ? "y" : "ies"}</>
            )}
          </button>
        </>
      )}

      {/* Scrollbar style */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f0ebe3;
          border-radius: 99px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #c9a227;
          border-radius: 99px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #8a7019;
        }
      `}</style>
    </div>
  );
}
