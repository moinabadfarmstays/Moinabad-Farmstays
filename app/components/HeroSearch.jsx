"use client";

import { motion } from "framer-motion";
import { Compass, ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const HERO_BG =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2400&auto=format&fit=crop";

export default function HeroSearch({
  locationQuery,
  onLocationChange,
  onSearch,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
}) {
  const router = useRouter();

  const handleExploreStays = () => {
    const q = locationQuery?.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/resorts${params.toString() ? `?${params}` : ""}`);
  };

  const scrollToResorts = () => {
    document.getElementById("resorts-explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <div
        className="absolute inset-0 animate-ken-burns bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:justify-center lg:pb-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-luxury-gold-light/90">
            Luxury collection
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Luxury Farmhouses in{" "}
            <span className="text-gold-gradient">Moinabad</span> near Hyderabad
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Book premium farmhouses and resorts in Moinabad, Telangana — 45 minutes from Hyderabad. Perfect for weekend getaways, family outings, and corporate retreats.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={handleExploreStays}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-luxury-gold-light/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-luxury-gold-light/80 hover:bg-white/[0.18] hover:shadow-[0_0_28px_rgba(212,175,55,0.25)] active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Compass className="h-4 w-4 text-luxury-gold-light transition-transform duration-500 group-hover:rotate-45" />
            Explore Stays
            <ArrowRight className="h-4 w-4 text-luxury-gold-light/70 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <span className="flex items-center gap-2 text-sm text-white/45">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Handpicked luxury farmstays
          </span>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={scrollToResorts}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/40 transition-colors hover:text-white/70 lg:flex motion-reduce:hidden"
        aria-label="Scroll to resorts"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce-soft" />
      </button>
    </section>
  );
}
