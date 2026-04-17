"use client";

import React from "react";
import ProductCollection from "@/app/components/ProductCollection";
import { Sparkles, Calendar, LayoutGrid, Leaf, Sunset, Flame, MountainSnow, Wind, Star } from "lucide-react";
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
  { value: "4.9★", label: "Average Rating" },
  { value: "100%", label: "Nature Immersion" },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Header Section */}
      <section className="bg-luxury-black py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-gold/20 ring-1 ring-luxury-gold/40">
              <Sparkles className="h-8 w-8 text-luxury-gold-light" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight">Your Dashboard</h1>
              <p className="mt-2 text-luxury-sand/70">Find the perfect escape for your next adventure.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Available Resorts Section */}
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-3 border-b border-luxury-stone/30 pb-4">
            <Calendar className="h-6 w-6 text-luxury-gold-dark" />
            <h2 className="font-display text-2xl font-semibold text-luxury-black">Available Right Now</h2>
          </div>
          <ProductCollection
            variant="dashboard"
            initialOnlyAvailable={true}
            title=""
          />
        </div>

        {/* ── Creative Experience Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative my-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#12100a] to-[#0a110a] p-8 shadow-luxury sm:p-10"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-luxury-gold/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-emerald-800/20 blur-2xl" />
          <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-900/15 blur-2xl" />

          <div className="relative z-10">
            {/* Header */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-luxury-gold-light/60">
              The Moinabad Promise
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
              More than just a stay
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              Every corner of Moinabad Farmstays is crafted to reconnect you with nature, culture, and calm.
            </p>

            {/* Feature Cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EXPERIENCE_FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`group rounded-2xl border ${f.border} ${f.bg} p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]`}
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ring-1 ${f.border}`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl font-bold text-luxury-gold-light sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-white/45">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Resorts Section */}
        <div>
          <div className="mb-6 flex items-center gap-3 border-b border-luxury-stone/30 pb-4">
            <LayoutGrid className="h-6 w-6 text-luxury-gold-dark" />
            <h2 className="font-display text-2xl font-semibold text-luxury-black">Explore All Our Gems</h2>
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
