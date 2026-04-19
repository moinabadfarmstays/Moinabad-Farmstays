"use client";

import React from "react";
import ProductCollection from "@/app/components/ProductCollection";
import { Sparkles, Calendar, LayoutGrid, Leaf, Flame, MountainSnow, Wind } from "lucide-react";
import { motion } from "framer-motion";

const EXPERIENCE_FEATURES = [
  {
    icon: Leaf,
    color: "text-emerald-400",
    bg: "bg-emerald-900/20",
    border: "border-emerald-600/20",
    title: "Farm to Table",
    desc: "Fresh organic produce harvested steps from your suite",
  },
  {
    icon: MountainSnow,
    color: "text-sky-400",
    bg: "bg-sky-900/20",
    border: "border-sky-600/20",
    title: "Scenic Trails",
    desc: "Curated nature walks through the Moinabad highlands",
  },
  {
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-900/20",
    border: "border-orange-600/20",
    title: "Bonfire Nights",
    desc: "Star-lit evenings around crackling open-air bonfires",
  },
  {
    icon: Wind,
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    border: "border-purple-600/20",
    title: "Total Serenity",
    desc: "Zero traffic noise — just birdsong and open skies",
  },
];

const STATS = [
  { value: "12+", label: "Farmstay Resorts" },
  { value: "500+", label: "Happy Guests" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "100%", label: "Nature Immersion" },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-luxury-cream">

      {/* ── Mobile-first Hero Header ── */}
      <section className="bg-luxury-black py-8 sm:py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Icon + Title row */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-luxury-gold/20 ring-1 ring-luxury-gold/40 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Sparkles className="h-6 w-6 text-luxury-gold-light sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
                Your Dashboard
              </h1>
              <p className="mt-0.5 text-sm text-luxury-sand/70 sm:mt-2 sm:text-base">
                Find the perfect escape for your next adventure.
              </p>
            </div>
          </div>

          {/* Stats — horizontal scroll on mobile, grid on desktop */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-1 sm:mt-8 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible hide-scrollbar">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="min-w-[110px] shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center sm:min-w-0 sm:rounded-2xl"
              >
                <p className="font-display text-xl font-bold text-luxury-gold-light sm:text-2xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] text-white/50 sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* ── Available Resorts ── */}
        {/* <div className="mb-8 sm:mb-10">
          <div className="mb-4 flex items-center gap-2.5 border-b border-luxury-stone/30 pb-3 sm:mb-6 sm:pb-4">
            <Calendar className="h-5 w-5 text-luxury-gold-dark sm:h-6 sm:w-6" />
            <h2 className="font-display text-xl font-semibold text-luxury-black sm:text-2xl">
              Available Right Now
            </h2>
          </div>
          <ProductCollection
            variant="dashboard"
            initialOnlyAvailable={true}
            title=""
          />
        </div> */}

        {/* ── Experience / Moinabad Promise Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#12100a] to-[#0a110a] p-5 shadow-luxury sm:my-14 sm:rounded-3xl sm:p-10"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-luxury-gold/8 blur-3xl sm:-left-16 sm:-top-16 sm:h-64 sm:w-64" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-emerald-800/20 blur-2xl sm:-bottom-12 sm:-right-12 sm:h-48 sm:w-48" />

          <div className="relative z-10">
            {/* Header */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-luxury-gold-light/60 sm:text-[11px]">
              The Moinabad Promise
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-white sm:mt-3 sm:text-3xl">
              More than just a stay
            </h2>
            <p className="mt-1.5 max-w-xl text-xs text-white/50 sm:mt-2 sm:text-sm">
              Every corner of Moinabad Farmstays is crafted to reconnect you with nature, culture, and calm.
            </p>

            {/* Feature Cards — 2-col on mobile, 4-col on desktop */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
              {EXPERIENCE_FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`group rounded-xl border ${f.border} ${f.bg} p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:rounded-2xl sm:p-5`}
                >
                  <div className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl ${f.bg} ring-1 ${f.border} sm:mb-3 sm:h-10 sm:w-10`}>
                    <f.icon className={`h-4 w-4 ${f.color} sm:h-5 sm:w-5`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white sm:text-base">{f.title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/55 sm:text-xs">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── All Resorts ── */}
        <div>
          <div className="mb-4 flex items-center gap-2.5 border-b border-luxury-stone/30 pb-3 sm:mb-6 sm:pb-4">
            <LayoutGrid className="h-5 w-5 text-luxury-gold-dark sm:h-6 sm:w-6" />
            <h2 className="font-display text-xl font-semibold text-luxury-black sm:text-2xl">
              Explore All Our Gems
            </h2>
          </div>
          <ProductCollection
            variant="dashboard"
            initialOnlyAvailable={false}
            title=""
          />
        </div>

      </div>
    </div>
  );
}
