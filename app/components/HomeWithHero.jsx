"use client";

import { useState, useCallback } from "react";
import HeroSearch from "./HeroSearch";
import ProductCollection from "./ProductCollection";

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
      <section id="resorts-explore">
        <ProductCollection
          variant="home"
          searchQuery={heroSearch}
          setSearchQuery={setHeroSearch}
        />
      </section>
    </>
  );
}
