// app/(app)/detail/[id]/_components/AmenitiesSection.jsx
"use client";
import { useState } from "react";
import {
  Wifi, Tv, Coffee, Wind, Droplet, Flame, Car, TreePine,
  Waves, Utensils, Shield, Sparkles, Zap, Check,
  Moon, Sun, UtensilsCrossed, Dumbbell, Dog,
} from "lucide-react";

// ── Amenity icon + color map ──────────────────────────────────────────────────
const AMENITY_CONFIG = {
  ac:           { icon: Wind,           label: "Air Conditioning", color: "bg-sky-50 border-sky-200 text-sky-700" },
  wifi:         { icon: Wifi,           label: "Free WiFi",        color: "bg-violet-50 border-violet-200 text-violet-700" },
  tv:           { icon: Tv,             label: "Television",       color: "bg-slate-50 border-slate-200 text-slate-700" },
  breakfast:    { icon: Coffee,         label: "Breakfast",        color: "bg-amber-50 border-amber-200 text-amber-700" },
  geyser:       { icon: Droplet,        label: "Hot Water",        color: "bg-orange-50 border-orange-200 text-orange-700" },
  bbq:          { icon: Flame,          label: "BBQ / Bonfire",   color: "bg-red-50 border-red-200 text-red-700" },
  parking:      { icon: Car,            label: "Free Parking",     color: "bg-stone-50 border-stone-200 text-stone-700" },
  lawn:         { icon: TreePine,       label: "Private Lawn",     color: "bg-green-50 border-green-200 text-green-700" },
  garden:       { icon: TreePine,       label: "Garden",           color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  pool:         { icon: Waves,          label: "Swimming Pool",    color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  kitchen:      { icon: Utensils,       label: "Kitchen",          color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  catering:     { icon: UtensilsCrossed,label: "Catering",         color: "bg-lime-50 border-lime-200 text-lime-700" },
  security:     { icon: Shield,         label: "Security",         color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  generator:    { icon: Zap,            label: "Generator",        color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  gym:          { icon: Dumbbell,       label: "Gym",              color: "bg-pink-50 border-pink-200 text-pink-700" },
  pets:         { icon: Dog,            label: "Pets Allowed",     color: "bg-teal-50 border-teal-200 text-teal-700" },
  overnight:    { icon: Moon,           label: "Overnight Stay",   color: "bg-purple-50 border-purple-200 text-purple-700" },
  dayouting:    { icon: Sun,            label: "Day Outing",       color: "bg-orange-50 border-orange-200 text-orange-600" },
};

function getConfig(amenity) {
  const key = amenity.toLowerCase().replace(/\s+/g, "");
  // Direct match
  if (AMENITY_CONFIG[key]) return AMENITY_CONFIG[key];
  // Partial match
  for (const [k, v] of Object.entries(AMENITY_CONFIG)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { icon: Sparkles, label: amenity, color: "bg-luxury-sand border-luxury-stone/60 text-luxury-charcoal" };
}

const PREVIEW_COUNT = 9;

export default function AmenitiesSection({ amenities = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!amenities.length) return null;

  const visible = expanded ? amenities : amenities.slice(0, PREVIEW_COUNT);
  const hiddenCount = amenities.length - PREVIEW_COUNT;

  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 shadow-luxury overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-luxury-black">
            What&apos;s Included
          </h2>
          <p className="mt-0.5 text-xs text-luxury-charcoal/50">
            {amenities.length} amenities across all common areas
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-luxury-gold/15 ring-1 ring-luxury-gold/30 text-sm font-black text-luxury-gold-dark">
          {amenities.length}
        </span>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-luxury-stone/40" />

      {/* Icon chip grid */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {visible.map((amenity, i) => {
            const { icon: Icon, label, color } = getConfig(amenity);
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${color}`}
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-white/60 shadow-sm">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold leading-tight truncate">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more / less */}
      {amenities.length > PREVIEW_COUNT && (
        <div className="px-6 pb-5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-luxury-gold/40 bg-luxury-gold/10 py-2.5 text-sm font-semibold text-luxury-gold-dark transition-all hover:bg-luxury-gold/20 active:scale-[0.99]"
          >
            {expanded ? (
              <span>Show fewer amenities ↑</span>
            ) : (
              <span>+ {hiddenCount} more amenit{hiddenCount === 1 ? "y" : "ies"}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
