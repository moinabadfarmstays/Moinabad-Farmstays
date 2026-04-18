"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import HeroSearch from "./HeroSearch";
import ProductCollection from "./ProductCollection";
import Image from "next/image";
import { MapPin, Star, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatDate } from "../utils/formatDate";

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ resort }) => {
  if (resort.available === false) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
        Not Available
      </span>
    );
  }
  // approved booking exists => Booked
  if (resort.bookings?.length > 0) {
    const b = resort.bookings[0];
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
        <XCircle className="h-3 w-3" />
        Booked {formatDate(b.startDate)} – {formatDate(b.endDate)}
      </span>
    );
  }
  // pending booking exists => still Available to others
  if (resort.pendingBookings?.length > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
        <Clock className="h-3 w-3" />
        Pending Approval
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
      <CheckCircle className="h-3 w-3" />
      Available
    </span>
  );
};

// ─── Mini Resort Card (for the sectioned view) ─────────────────────────────────
const MiniResortCard = ({ resort }) => {
  const router = useRouter();
  const thumb =
    resort.profileImages?.[0] ||
    resort.image ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945";
  const avg =
    resort.reviews?.length > 0
      ? (
          resort.reviews.reduce((s, r) => s + (r.rating || 0), 0) /
          resort.reviews.length
        ).toFixed(1)
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(`/detail/${resort._id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={thumb}
          alt={resort.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {avg && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-yellow-300 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {avg}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-display text-base font-semibold text-luxury-black group-hover:text-luxury-gold-dark">
          {resort.title}
        </h3>
        <div className="mb-2 flex items-center gap-1 text-xs text-luxury-charcoal/65">
          <MapPin className="h-3 w-3 flex-shrink-0 text-luxury-gold-dark" />
          <span className="line-clamp-1">{resort.address}</span>
        </div>

        {/* Amenities */}
        {resort.amen?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {resort.amen.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="rounded-full bg-luxury-sand px-2 py-0.5 text-[10px] font-medium text-luxury-charcoal"
              >
                {a}
              </span>
            ))}
            {resort.amen.length > 3 && (
              <span className="rounded-full bg-luxury-stone/70 px-2 py-0.5 text-[10px] font-medium text-luxury-charcoal/70">
                +{resort.amen.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Status + Price row */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge resort={resort} />
          <p className="text-base font-bold text-luxury-black">
            ₹{resort.price?.toLocaleString()}
            <span className="text-[10px] font-normal text-luxury-charcoal/55"> /night</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sectioned Resort Grid ─────────────────────────────────────────────────────
const SectionedResorts = () => {
  const [allResorts, setAllResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/admin/add-product")
      .then((r) => r.json())
      .then((d) => setAllResorts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const available = allResorts.filter(
    (r) => r.available !== false && !r.bookings?.length
  );
  const booked = allResorts.filter(
    (r) => r.available !== false && r.bookings?.length > 0
  );
  const pending = allResorts.filter(
    (r) => r.available !== false && r.pendingBookings?.length > 0 && !r.bookings?.length
  );

  const tabs = [
    { key: "all", label: "All Resorts", count: allResorts.length },
    { key: "available", label: "Available", count: available.length },
    { key: "booked", label: "Booked", count: booked.length },
    { key: "pending", label: "Pending", count: pending.length },
  ];

  const displayed =
    activeTab === "all"
      ? allResorts
      : activeTab === "available"
      ? available
      : activeTab === "booked"
      ? booked
      : pending;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-luxury-sand" />
        ))}
      </div>
    );
  }

  // return (
  //   <section className="mt-16 border-t border-luxury-stone/40 pt-12">
  //     {/* Section Header */}
  //     <div className="mb-8">
  //       {/* <h2 className="font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
  //         All Resorts
  //       </h2>
  //       <p className="mt-2 text-luxury-charcoal/70">
  //         Browse by availability — color codes tell you everything at a glance.
  //       </p> */}

  //       {/* Legend */}
  //       {/* <div className="mt-4 flex flex-wrap gap-3">
  //         <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
  //           <CheckCircle className="h-3.5 w-3.5" /> Available
  //         </span>
  //         <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
  //           <Clock className="h-3.5 w-3.5" /> Pending Approval
  //         </span>
  //         <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
  //           <XCircle className="h-3.5 w-3.5" /> Booked
  //         </span>
  //       </div> */}
  //     </div>

  //     {/* Tab Bar */}
  //     {/* <div className="mb-8 flex flex-wrap gap-2">
  //       {tabs.map((t) => (
  //         <button
  //           key={t.key}
  //           type="button"
  //           onClick={() => setActiveTab(t.key)}
  //           className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
  //             activeTab === t.key
  //               ? "bg-luxury-black text-luxury-gold-light shadow-luxury scale-[1.03]"
  //               : "border border-luxury-stone bg-white/95 text-luxury-charcoal hover:border-luxury-gold/40 hover:bg-luxury-sand/70"
  //           }`}
  //         >
  //           {t.label}
  //           <span
  //             className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
  //               activeTab === t.key
  //                 ? "bg-luxury-gold/20 text-luxury-gold-light"
  //                 : "bg-luxury-stone/60 text-luxury-charcoal/70"
  //             }`}
  //           >
  //             {t.count}
  //           </span>
  //         </button>
  //       ))}
  //     </div> */}

  //     {/* Grid */}
  //     {/* <AnimatePresence mode="wait">
  //       {displayed.length === 0 ? (
  //         <motion.div
  //           key="empty"
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           exit={{ opacity: 0 }}
  //           className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-glass"
  //         >
  //           <p className="text-luxury-charcoal/60">
  //             No resorts in this category yet.
  //           </p>
  //         </motion.div>
  //       ) : (
  //         <motion.div
  //           key={activeTab}
  //           initial={{ opacity: 0, y: 8 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           exit={{ opacity: 0 }}
  //           transition={{ duration: 0.25 }}
  //           className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
  //         >
  //           {displayed.map((resort) => (
  //             <MiniResortCard key={resort._id} resort={resort} />
  //           ))}
  //         </motion.div>
  //       )}
  //     </AnimatePresence> */}
  //   </section>
  // );
};

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function HomeWithHero() {
  const [locationQuery, setLocationQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = useCallback(() => {
    setHeroSearch(locationQuery.trim());
    const el = document.getElementById("resorts-explore");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [locationQuery]);

  return (
    <>
      <HeroSearch
        locationQuery={locationQuery}
        onLocationChange={setLocationQuery}
        onSearch={handleHeroSearch}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        guests={guests}
        onGuestsChange={setGuests}
      />

      {/* ── Search Results / Main Collection ── */}
      <div id="resorts-explore">
        <ProductCollection
          variant="home"
          searchQuery={heroSearch}
          setSearchQuery={setHeroSearch}
        />
      </div>

      {/* ── Sectioned "All Resorts" bottom section ── */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionedResorts />
      </div>
    </>
  );
}
