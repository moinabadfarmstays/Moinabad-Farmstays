"use client";

/**
 * ResortDetailClient.jsx
 *
 * Pure client-side interactivity shell for the resort detail page.
 * The Server Component (page.jsx) passes `initialResort` as a prop,
 * so the page renders with FULL content server-side for Google,
 * and the client takes over for booking, gallery, calendar, etc.
 *
 * Data strategy:
 *   - initialResort: static resort data from SSR (title, desc, images, amenities)
 *   - Client re-fetches /api/resorts/[slug] for real-time booking availability
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Check, AlertCircle, Star, Navigation, ChevronDown, ArrowLeft,
} from "lucide-react";

import { bookingAction } from "@/app/serverActions/bookingAction";
import { addReviewAction } from "@/app/serverActions/reviewAction";
import { sendBookingEmail } from "@/app/utils/sendEmail/sendEmail";
import { getSession } from "next-auth/react";
import { formatDate } from "@/app/utils/formatDate";
import { calculateTotal, getNights, isWeekendDay } from "@/app/utils/pricingUtils";

import LoginModal from "@/app/components/LoginModal";
import PhoneRequiredModal from "@/app/components/PhoneRequiredModal";
import GalleryModal from "../_components/GalleryModal";
import ResortGallery from "../_components/ResortGallery";
import BookingCard from "../_components/BookingCard";
import AmenitiesSection from "../_components/AmenitiesSection";
import ReviewsSection from "../_components/ReviewsSection";
import SimilarResorts from "../_components/SimilarResorts";

function getAverageRating(reviews) {
  if (!reviews?.length) return null;
  return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
}

function extractArea(address = "") {
  return address
    .split(/[,\-|]/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(",")
    .toLowerCase();
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ImportantInfo() {
  return (
    <div className="hidden rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury lg:block">
      <h3 className="mb-4 text-lg font-bold text-luxury-black">Important Information</h3>
      <ul className="space-y-3 text-sm text-luxury-charcoal/80">
        {[
          "Free cancellation up to 24 hours before check-in",
          "Check-in: 2:00 PM | Check-out: 11:00 AM",
          "Payment required after admin approval",
          "Valid ID proof required at check-in",
        ].map((info, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-luxury-gold-dark" />
            <span>{info}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BookingProcess() {
  return (
    <div className="hidden rounded-3xl border border-luxury-gold/30 bg-luxury-sand/60 p-6 lg:block">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-luxury-gold/20 p-3 ring-1 ring-luxury-gold/30">
          <AlertCircle className="h-6 w-6 text-luxury-gold-dark" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold text-luxury-black">Booking Process</h3>
          <ul className="space-y-2 text-sm text-luxury-charcoal/85">
            {[
              "Submit your booking request with your preferred dates",
              "Admin will review and approve your request",
              'Track your booking status in "My Reservations"',
              "Complete payment after approval",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 text-luxury-gold-dark">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DescriptionCard({ desc }) {
  const [open, setOpen] = useState(true); // open by default
  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 shadow-luxury overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-6 py-5 lg:cursor-default lg:pointer-events-none"
        aria-expanded={open}
      >
        <h2 className="font-display text-2xl font-bold text-luxury-black text-left">
          About This Resort
        </h2>
        <span
          className={`lg:hidden flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold-dark transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out lg:max-h-none lg:opacity-100 lg:pb-6 lg:px-6 ${open ? "max-h-[600px] opacity-100 pb-6 px-6" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"}`}
        style={{ transitionProperty: "max-height, opacity, padding" }}
      >
        <div className="pt-0 lg:pt-0 border-t border-luxury-stone/30 lg:border-none pt-4 lg:pt-0">
          <p className="text-base lg:text-lg leading-relaxed text-luxury-charcoal/90 whitespace-pre-line">
            {desc}
          </p>
        </div>
      </div>

      {!open && (
        <p className="lg:hidden px-6 pb-4 text-xs text-luxury-charcoal/40 italic">
          Tap &quot;About This Resort&quot; to read more ↑
        </p>
      )}
    </div>
  );
}

function ManagerCard() {
  const phone = "6304691625";
  const waMsg = encodeURIComponent(
    "Hello Jagan, I'd like to know more about booking a resort at Moinabad Farmstays."
  );
  return (
    <div className="overflow-hidden rounded-3xl border border-luxury-stone/70 bg-white/95 shadow-luxury">
      <div className="h-1 w-full bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold-dark" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-luxury-gold via-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-white select-none">J</span>
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/45 mb-0.5">Managed by</p>
            <p className="text-base font-bold text-luxury-black leading-tight">Jagan Sangeri</p>
            <p className="text-xs text-luxury-charcoal/55">Resort Manager · Moinabad Farmstays</p>
          </div>
        </div>
        <p className="text-xs text-luxury-charcoal/65 leading-relaxed mb-4 px-1">
          Jagan personally oversees all resorts and is available to answer queries, arrange visits, or assist with bookings.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:+91${phone}`}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-luxury-stone/70 bg-luxury-sand/70 py-2.5 text-xs font-bold text-luxury-charcoal hover:border-luxury-gold/50 hover:bg-luxury-gold/10 hover:text-luxury-gold-dark transition-all active:scale-95"
          >
            Call
          </a>
          <a
            href={`https://wa.me/91${phone}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all active:scale-95"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────────

export default function ResortDetailClient({ initialResort, slug }) {
  const router = useRouter();

  // Hydrate from SSR data, refresh booking availability from API
  const [resortRoom, setResortRoom] = useState(initialResort);
  const [reviews, setReviews] = useState(initialResort?.reviews || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [similarResorts, setSimilarResorts] = useState([]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [occasion, setOccasion] = useState("");
  const [durationType, setDurationType] = useState("12hr");
  const [overlappingBooking, setOverlappingBooking] = useState(null);

  const [ratingInput, setRatingInput] = useState(0);
  const [reviewTextInput, setReviewTextInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Refresh booking availability (real-time blocked dates)
  useEffect(() => {
    fetch(`/api/resorts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setResortRoom((prev) => ({ ...prev, bookings: data.product.bookings }));
        }
      })
      .catch(() => {}); // non-critical
  }, [slug]);

  // Fetch similar resorts
  useEffect(() => {
    if (!resortRoom) return;
    const currentArea = extractArea(resortRoom.address);
    fetch("/api/admin/add-product")
      .then((r) => r.json())
      .then((data) => {
        let similar = (data.products || []).filter(
          (p) =>
            p._id !== resortRoom._id &&
            extractArea(p.address)
              .split(",")
              .some((part) => currentArea.includes(part) && part.length > 2)
        );
        if (similar.length === 0) {
          similar = (data.products || []).filter((p) => p._id !== resortRoom._id);
        }
        setSimilarResorts(similar.slice(0, 6));
      })
      .catch(() => {});
  }, [resortRoom]);

  const isSameDay =
    selectedDates?.startDate &&
    selectedDates?.endDate &&
    new Date(selectedDates.startDate).toDateString() ===
      new Date(selectedDates.endDate).toDateString();

  const isWeekend =
    isSameDay && selectedDates?.startDate
      ? isWeekendDay(new Date(selectedDates.startDate))
      : false;

  const displayImages = resortRoom
    ? [
        ...(resortRoom.profileImages || []),
        ...(resortRoom.carouselImages || []),
      ].length > 0
      ? [...(resortRoom.profileImages || []), ...(resortRoom.carouselImages || [])]
      : resortRoom.images?.length > 0
      ? resortRoom.images
      : [resortRoom?.image].filter(Boolean)
    : [];

  const handleDateChange = (range) => {
    setSelectedDates(range);
    setTotalAmount(calculateTotal(range, durationType, resortRoom));
    if (range?.startDate && range?.endDate && resortRoom?.bookings?.length) {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      const conflict = resortRoom.bookings.find((b) => {
        if (b.status && b.status !== "approved") return false;
        return start < new Date(b.endDate) && end > new Date(b.startDate);
      });
      setOverlappingBooking(conflict || null);
    } else {
      setOverlappingBooking(null);
    }
  };

  const handleDurationChange = (type) => {
    setDurationType(type);
    setTotalAmount(calculateTotal(selectedDates, type, resortRoom));
  };

  const bookingHandler = async () => {
    const session = await getSession();
    if (!session) { setShowLoginModal(true); return; }
    if (session.user?.provider === "google" || session.user?.image?.includes("googleusercontent")) {
      try {
        const res = await fetch("/api/user/profile-check");
        if (res.ok) {
          const data = await res.json();
          if (!data.phone || !String(data.phone).trim()) { setShowPhoneModal(true); return; }
        }
      } catch {}
    }
    if (!selectedDates?.startDate || !selectedDates?.endDate) {
      alert("Please select start and end dates before booking.");
      return;
    }
    try {
      const result = await bookingAction({
        resortRoom: resortRoom._id,
        startDate: new Date(selectedDates.startDate),
        endDate: new Date(selectedDates.endDate),
        productName: resortRoom.title,
        price: totalAmount,
        offer: resortRoom.offer || null,
        image: resortRoom.images?.[0] || resortRoom.image,
        numberOfPeople,
        occasion,
        durationType: isSameDay ? durationType : undefined,
      });
      if (result.success) {
        const nights = getNights(selectedDates);
        const msg = `Booking Request\n\nResort: ${resortRoom.title}\nPeople: ${numberOfPeople}\nOccasion: ${occasion}\nStart: ${formatDate(selectedDates.startDate)}\nEnd: ${formatDate(selectedDates.endDate)}\n${isSameDay ? `Duration: ${durationType}` : `Nights: ${nights}`}\nTotal: ₹${totalAmount}`;
        window.open(`https://wa.me/6304691625?text=${encodeURIComponent(msg)}`, "_blank");
        sendBookingEmail({ productName: resortRoom.title, numberOfPeople, occasion, startDate: formatDate(selectedDates.startDate), endDate: formatDate(selectedDates.endDate), price: totalAmount }).catch(console.error);
        alert("Booking request submitted successfully!");
        setSelectedDates(null); setTotalAmount(0); setShowCalendar(false); setDurationType("12hr");
      } else {
        alert(result.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      alert("An error occurred during booking");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();
    if (!session) { setShowLoginModal(true); return; }
    if (ratingInput < 1 || ratingInput > 5) { alert("Please select a rating."); return; }
    if (!reviewTextInput.trim()) { alert("Please write a review."); return; }
    setSubmittingReview(true);
    try {
      const result = await addReviewAction(resortRoom._id, ratingInput, reviewTextInput);
      if (result.success) {
        setReviews(result.product.reviews || []);
        setRatingInput(0); setReviewTextInput("");
      } else {
        alert(result.message || "Failed to submit review.");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!resortRoom) return null;

  const avgRating = getAverageRating(reviews);

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-cream via-luxury-sand/40 to-luxury-cream">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <PhoneRequiredModal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)} />

      {showGallery && (
        <GalleryModal
          images={displayImages}
          index={galleryIndex}
          onClose={() => setShowGallery(false)}
          onIndex={setGalleryIndex}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ── Hero Header ── */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-luxury-stone/70 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-luxury-gold/50 hover:bg-luxury-sand hover:scale-105 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 text-luxury-charcoal" />
          </button>

          {/* SEO-visible breadcrumb (visual) */}
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark transition-colors">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark transition-colors">Resorts</Link></li>
              <li aria-hidden>/</li>
              <li className="text-luxury-charcoal/80 font-medium truncate max-w-[200px]">{resortRoom.title}</li>
            </ol>
          </nav>

          <div className="rounded-2xl border border-luxury-stone/60 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-sm sm:px-8 sm:py-6">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold-dark/70">
              Moinabad Farmstays
            </p>
            {/* h1 — must be SSR-visible for Google */}
            <h1 className="font-display text-2xl font-bold text-luxury-black sm:text-3xl lg:text-4xl leading-tight mb-2">
              {resortRoom.title}
            </h1>
            <div className="mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />

            <div className="flex flex-wrap items-center gap-2">
              {avgRating && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {avgRating}
                  <span className="font-normal text-amber-600/70">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                </span>
              )}
              {resortRoom.address && (
                <a
                  href={
                    resortRoom.latitude && resortRoom.longitude
                      ? `https://www.google.com/maps?q=${resortRoom.latitude},${resortRoom.longitude}`
                      : `https://www.google.com/maps/search/${encodeURIComponent(resortRoom.address)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-luxury-stone/70 bg-luxury-sand/60 px-3 py-1 text-xs font-medium text-luxury-charcoal/75 hover:border-luxury-gold/50 hover:text-luxury-gold-dark transition-colors"
                >
                  <MapPin className="h-3 w-3 shrink-0 text-luxury-gold-dark" />
                  <span className="line-clamp-1 max-w-[180px] sm:max-w-none">{resortRoom.address}</span>
                </a>
              )}
              {(resortRoom.latitude && resortRoom.longitude) && (
                <button
                  type="button"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${resortRoom.latitude},${resortRoom.longitude}`, "_blank")}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400 px-4 py-1.5 text-xs font-bold text-luxury-black shadow-[0_4px_16px_-4px_rgba(201,162,39,0.6)] transition-all hover:scale-[1.04] active:scale-95"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get Directions
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick Highlights Strip ── */}
        {resortRoom && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-luxury-stone/60 bg-white/95 py-4 shadow-sm">
              <span className="text-2xl">🚗</span>
              <p className="text-xs font-bold text-luxury-black">~45 min</p>
              <p className="text-[10px] text-luxury-charcoal/50">from Hyderabad</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-luxury-stone/60 bg-white/95 py-4 shadow-sm">
              <span className="text-2xl">🏡</span>
              <p className="text-xs font-bold text-luxury-black">Private Venue</p>
              <p className="text-[10px] text-luxury-charcoal/50">exclusive booking</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-luxury-stone/60 bg-white/95 py-4 shadow-sm">
              <span className="text-2xl">💰</span>
              <p className="text-xs font-bold text-luxury-black">₹{resortRoom.price?.toLocaleString()}</p>
              <p className="text-[10px] text-luxury-charcoal/50">starting / night</p>
            </div>
            <div className={`flex flex-col items-center justify-center gap-1 rounded-2xl border py-4 shadow-sm ${
              resortRoom.available
                ? "border-emerald-200/80 bg-emerald-50/60"
                : "border-red-200/80 bg-red-50/60"
            }`}>
              <span className="text-2xl">{resortRoom.available ? "✅" : "🔴"}</span>
              <p className={`text-xs font-bold ${resortRoom.available ? "text-emerald-700" : "text-red-700"}`}>
                {resortRoom.available ? "Available" : "Unavailable"}
              </p>
              <p className="text-[10px] text-luxury-charcoal/50">instant booking</p>
            </div>
          </div>
        )}

        {/* ── 3-column grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          <div className="lg:col-span-2 order-1 space-y-8">
            <ResortGallery
              images={displayImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
              onOpen={(i) => { setGalleryIndex(i); setShowGallery(true); }}
              resortTitle={resortRoom.title} // for SEO alt tags
            />
          </div>

          <div className="lg:col-span-1 lg:row-span-3 space-y-6 lg:sticky lg:top-8 order-3 lg:order-2">
            <BookingCard
              resortRoom={resortRoom}
              showCalendar={showCalendar}
              onToggleCalendar={() => setShowCalendar((v) => !v)}
              onDateChange={handleDateChange}
              numberOfPeople={numberOfPeople}
              onPeopleChange={setNumberOfPeople}
              occasion={occasion}
              onOccasionChange={setOccasion}
              durationType={durationType}
              onDurationChange={handleDurationChange}
              totalAmount={totalAmount}
              isSameDay={isSameDay}
              isWeekend={isWeekend}
              getNights={getNights}
              selectedDates={selectedDates}
              overlappingBooking={overlappingBooking}
              onBook={bookingHandler}
            />
            <ManagerCard />
            <ImportantInfo />
            <BookingProcess />
          </div>

          <div className="lg:col-span-2 space-y-6 order-2 lg:order-3">
            <DescriptionCard desc={resortRoom.desc} />
            <AmenitiesSection amenities={resortRoom.amen || []} />
          </div>

          <div className="lg:col-span-2 order-4">
            <ReviewsSection
              reviews={reviews}
              ratingInput={ratingInput}
              onRatingChange={setRatingInput}
              reviewText={reviewTextInput}
              onReviewTextChange={setReviewTextInput}
              onSubmit={handleReviewSubmit}
              submitting={submittingReview}
            />
          </div>
        </div>

        <SimilarResorts resorts={similarResorts} />
      </div>
    </div>
  );
}
