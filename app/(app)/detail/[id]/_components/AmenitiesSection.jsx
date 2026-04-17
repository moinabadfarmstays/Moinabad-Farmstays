// app/(app)/detail/[id]/_components/AmenitiesSection.jsx
"use client";
import { useState } from "react";
import { Wifi, Tv, Coffee, Wind, Droplet, Check, ChevronUp, ChevronDown } from "lucide-react";

const PREVIEW = 8;

function getIcon(amenity) {
  const a = amenity.toLowerCase();
  if (a.includes("wifi")) return <Wifi className="w-5 h-5" />;
  if (a.includes("tv")) return <Tv className="w-5 h-5" />;
  if (a.includes("breakfast")) return <Coffee className="w-5 h-5" />;
  if (a.includes("ac")) return <Wind className="w-5 h-5" />;
  if (a.includes("geyser")) return <Droplet className="w-5 h-5" />;
  return <Check className="w-5 h-5" />;
}

export default function AmenitiesSection({ amenities = [] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? amenities : amenities.slice(0, PREVIEW);

  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-luxury-black">Amenities</h2>
        {amenities.length > 0 && (
          <span className="rounded-full bg-luxury-sand px-3 py-1 text-sm font-medium text-luxury-charcoal">
            {amenities.length} total
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((amenity, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-luxury-stone/60 bg-luxury-sand/50 p-4 transition-all duration-200 hover:border-luxury-gold/40 hover:bg-luxury-sand"
          >
            {getIcon(amenity)}
            <span className="font-medium text-luxury-black">{amenity}</span>
          </div>
        ))}
      </div>

      {amenities.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-luxury-gold/40 bg-luxury-gold/10 py-3 text-sm font-semibold text-luxury-gold-dark transition-all duration-200 hover:bg-luxury-gold/20 hover:border-luxury-gold/60"
        >
          {showAll ? (
            <><ChevronUp className="h-4 w-4" /> Show less</>
          ) : (
            <><ChevronDown className="h-4 w-4" /> Show {amenities.length - PREVIEW} more amenities</>
          )}
        </button>
      )}
    </div>
  );
}
