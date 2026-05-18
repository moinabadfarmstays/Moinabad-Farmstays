"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { MapPin, Check, AlertCircle, Star, Navigation, ChevronDown, ArrowLeft } from "lucide-react";

// Server actions / helpers
import { bookingAction } from "../../../serverActions/bookingAction";
import { addReviewAction } from "../../../serverActions/reviewAction";
import { sendBookingEmail } from "../../../utils/sendEmail/sendEmail";
import { getSession } from "next-auth/react";
import { formatDate } from "../../../utils/formatDate";
import { calculateTotal, getNights, isWeekendDay, getPricing } from "../../../utils/pricingUtils";

// Shared UI
import LoginModal from "../../../components/LoginModal";
import PhoneRequiredModal from "../../../components/PhoneRequiredModal";
import BackButton from "../../../components/ui/BackButton";

// Local sub-components (co-located under _components/)
import GalleryModal from "./_components/GalleryModal";
import ResortGallery from "./_components/ResortGallery";
import BookingCard from "./_components/BookingCard";
import AmenitiesSection from "./_components/AmenitiesSection";
import ReviewsSection from "./_components/ReviewsSection";
import SimilarResorts from "./_components/SimilarResorts";

// ─── Pure helpers ────────────────────────────────────────────────────────────

// getNights and calculateTotal are now imported from pricingUtils

function extractArea(address = "") {
  return address
    .split(/[,\-|]/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(",")
    .toLowerCase();
}

function getAverageRating(reviews) {
  if (!reviews?.length) return null;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

// ─── Sidebar info panels (small, static) ─────────────────────────────────────

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

// ─── Description (mobile collapsible) ────────────────────────────────────────

function DescriptionCard({ desc }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 shadow-luxury overflow-hidden">
      {/* Header — always visible, acts as toggle on mobile */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-6 py-5 lg:cursor-default lg:pointer-events-none"
        aria-expanded={open}
      >
        <h2 className="font-display text-2xl font-bold text-luxury-black text-left">
          About This Room
        </h2>
        {/* Chevron — hidden on desktop since we show full text */}
        <span
          className={`lg:hidden flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold-dark transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {/* Body — always visible on desktop, toggles on mobile */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out
          lg:max-h-none lg:opacity-100 lg:pb-6 lg:px-6
          ${open ? "max-h-[600px] opacity-100 pb-6 px-6" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"}
        `}
        style={{ transitionProperty: "max-height, opacity, padding" }}
      >
        <div className="pt-0 lg:pt-0 border-t border-luxury-stone/30 lg:border-none pt-4 lg:pt-0">
          <p className="text-base lg:text-lg leading-relaxed text-luxury-charcoal/90 whitespace-pre-line">
            {desc}
          </p>
        </div>
      </div>

      {/* Mobile closed hint */}
      {!open && (
        <p className="lg:hidden px-6 pb-4 text-xs text-luxury-charcoal/40 italic">
          Tap &quot;About This Room&quot; to read more ↑
        </p>
      )}
    </div>
  );
}

// ─── Manager Contact Card ────────────────────────────────────────────────────

function ManagerCard() {
  const phone = "6304691625";
  const waMsg = encodeURIComponent("Hello Jagan, I'd like to know more about booking a resort at Moinabad Farmstays.");
  return (
    <div className="overflow-hidden rounded-3xl border border-luxury-stone/70 bg-white/95 shadow-luxury">
      {/* Gold top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold-dark" />

      <div className="p-5">
        {/* Avatar + name row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-luxury-gold via-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-white select-none">J</span>
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/45 mb-0.5">Managed by</p>
            <p className="text-base font-bold text-luxury-black leading-tight">Jagan Sangeri</p>
            <p className="text-xs text-luxury-charcoal/55">Resort Manager · Moinabad Farmstays</p>
          </div>
        </div>

        {/* Tag line */}
        <p className="text-xs text-luxury-charcoal/65 leading-relaxed mb-4 px-1">
          Jagan personally oversees all resorts and is available to answer queries, arrange visits, or assist with bookings.
        </p>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:+91${phone}`}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-luxury-stone/70 bg-luxury-sand/70 py-2.5 text-xs font-bold text-luxury-charcoal hover:border-luxury-gold/50 hover:bg-luxury-gold/10 hover:text-luxury-gold-dark transition-all active:scale-95"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            Call
          </a>
          <a
            href={`https://wa.me/91${phone}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all active:scale-95"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DynamicProduct = () => {
  const { id } = useParams();
  const router = useRouter();

  // ── Data ──
  const [resortRoom, setResortRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarResorts, setSimilarResorts] = useState([]);

  // ── UI State ──
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // ── Booking State ──
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [occasion, setOccasion] = useState("");
  const [durationType, setDurationType] = useState("12hr");
  const [overlappingBooking, setOverlappingBooking] = useState(null);

  // ── Review State ──
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(0);
  const [reviewTextInput, setReviewTextInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // ── Fetch product ──
  const dynamicProductHandler = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product/${id}`);
      if (!res.ok) throw new Error("Could not fetch product.");
      const data = await res.json();
      setResortRoom(data.product);
      setReviews(data.product.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ── Fetch similar resorts ──
  const fetchSimilarResorts = useCallback(async (current) => {
    try {
      const res = await fetch("/api/admin/add-product");
      const data = await res.json();
      const currentArea = extractArea(current?.address);
      let similar = (data.products || []).filter(
        (p) =>
          p._id !== current._id &&
          extractArea(p.address)
            .split(",")
            .some((part) => currentArea.includes(part) && part.length > 2)
      );
      
      // If no resorts hit the exact area matching, fallback to any other resorts
      if (similar.length === 0) {
        similar = (data.products || []).filter((p) => p._id !== current._id);
      }
      
      setSimilarResorts(similar.slice(0, 6));
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { dynamicProductHandler(); }, [dynamicProductHandler]);
  useEffect(() => { if (resortRoom) fetchSimilarResorts(resortRoom); }, [resortRoom, fetchSimilarResorts]);

  // ── Derived ──
  const isSameDay =
    selectedDates?.startDate &&
    selectedDates?.endDate &&
    new Date(selectedDates.startDate).toDateString() === new Date(selectedDates.endDate).toDateString();

  // On weekends, only 24hr is available
  const isWeekend = isSameDay && selectedDates?.startDate
    ? isWeekendDay(new Date(selectedDates.startDate))
    : false;

  const displayImages = resortRoom
    ? [...(resortRoom.profileImages || []), ...(resortRoom.carouselImages || [])].length > 0
      ? [...(resortRoom.profileImages || []), ...(resortRoom.carouselImages || [])]
      : resortRoom.images?.length > 0
      ? resortRoom.images
      : [resortRoom?.image].filter(Boolean)
    : [];

  // ── Handlers ──
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

    // Gate: Google users need a phone number
    if (session.user?.provider === "google" || session.user?.image?.includes("googleusercontent")) {
      try {
        const res = await fetch("/api/user/profile-check");
        if (res.ok) {
          const data = await res.json();
          if (!data.phone || !String(data.phone).trim()) { setShowPhoneModal(true); return; }
        }
      } catch { /* non-blocking */ }
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
        const msg = `Booking Request\n\nResort: ${resortRoom.title}\nPeople: ${numberOfPeople}\nOccasion: ${occasion}\nStart Date: ${formatDate(selectedDates.startDate)}\nEnd Date: ${formatDate(selectedDates.endDate)}\n${isSameDay ? `Duration: ${durationType}` : `Nights: ${nights}`}\nTotal Price: ₹${totalAmount}`;
        window.open(`https://wa.me/6304691625?text=${encodeURIComponent(msg)}`, "_blank");

        sendBookingEmail({
          productName: resortRoom.title,
          numberOfPeople,
          occasion,
          startDate: formatDate(selectedDates.startDate),
          endDate: formatDate(selectedDates.endDate),
          price: totalAmount,
        }).catch((err) => console.error("Email API Error:", err));

        alert("Booking request submitted successfully!");
        setSelectedDates(null);
        setTotalAmount(0);
        setShowCalendar(false);
        setDurationType("12hr");
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
    if (ratingInput < 1 || ratingInput > 5) { alert("Please select a rating between 1 and 5 stars."); return; }
    if (!reviewTextInput.trim()) { alert("Please write a review."); return; }

    setSubmittingReview(true);
    try {
      const result = await addReviewAction(id, ratingInput, reviewTextInput);
      if (result.success) {
        setReviews(result.product.reviews || []);
        setRatingInput(0);
        setReviewTextInput("");
      } else {
        alert(result.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Loading / Error / Empty states ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h2 className="mb-2 font-display text-2xl font-semibold text-luxury-black">Oops!</h2>
          <p className="text-luxury-charcoal/75">{error}</p>
        </div>
      </div>
    );
  }
  if (!resortRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream p-4">
        <div className="w-full max-w-md rounded-2xl border border-luxury-stone/80 bg-white/95 p-8 text-center shadow-luxury">
          <p className="text-luxury-charcoal/75">No product found</p>
        </div>
      </div>
    );
  }

  const avgRating = getAverageRating(reviews);

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-cream via-luxury-sand/40 to-luxury-cream">
      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <PhoneRequiredModal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)} />

      {/* Fullscreen gallery */}
      {showGallery && (
        <GalleryModal
          images={displayImages}
          index={galleryIndex}
          onClose={() => setShowGallery(false)}
          onIndex={setGalleryIndex}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ── Hero Header Card ── */}
        <div className="mb-8">
          {/* Icon-only back button */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-luxury-stone/70 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-luxury-gold/50 hover:bg-luxury-sand hover:scale-105 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 text-luxury-charcoal" />
          </button>

          <div className="rounded-2xl border border-luxury-stone/60 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-sm sm:px-8 sm:py-6">
            {/* Eyebrow */}
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold-dark/70">
              Moinabad Farmstays
            </p>

            {/* Title */}
            <h1 className="font-display text-2xl font-bold text-luxury-black sm:text-3xl lg:text-4xl leading-tight mb-2">
              {resortRoom.title}
            </h1>

            {/* Gold underline */}
            <div className="mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              {avgRating && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {avgRating}
                  <span className="font-normal text-amber-600/70">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                </span>
              )}

              {(resortRoom.address || (resortRoom.latitude && resortRoom.longitude)) ? (
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
                  <span className="line-clamp-1 max-w-[180px] sm:max-w-none">{resortRoom.address || "View on Map"}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-luxury-charcoal/40">
                  <MapPin className="h-3 w-3" /> Location not specified
                </span>
              )}

              {(resortRoom.address || (resortRoom.latitude && resortRoom.longitude)) && (
                <button
                  type="button"
                  onClick={() => {
                    if (resortRoom.latitude && resortRoom.longitude) {
                      if (!navigator.geolocation) {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${resortRoom.latitude},${resortRoom.longitude}`, "_blank");
                        return;
                      }
                      navigator.geolocation.getCurrentPosition(
                        ({ coords }) => window.open(`https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${resortRoom.latitude},${resortRoom.longitude}`, "_blank"),
                        () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${resortRoom.latitude},${resortRoom.longitude}`, "_blank")
                      );
                    } else {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resortRoom.address)}`, "_blank");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400 px-4 py-1.5 text-xs font-bold text-luxury-black shadow-[0_4px_16px_-4px_rgba(201,162,39,0.6)] transition-all hover:scale-[1.04] hover:shadow-[0_6px_20px_-4px_rgba(201,162,39,0.75)] active:scale-95"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get Directions
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">

          {/* ── Col 1-2 top: Gallery ── order-1 everywhere */}
          <div className="lg:col-span-2 order-1 space-y-8">
            <ResortGallery
              images={displayImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
              onOpen={(i) => { setGalleryIndex(i); setShowGallery(true); }}
            />
          </div>

          {/* ── Col 3: Booking sidebar ── order-3 mobile → order-2 lg (right col, sticky) */}
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

          {/* ── Col 1-2: Description + Amenities ── order-2 mobile, order-3 lg */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-3">
            {/* Description — collapsible on mobile */}
            <DescriptionCard desc={resortRoom.desc} />
            <AmenitiesSection amenities={resortRoom.amen || []} />
          </div>

          {/* ── Col 1-2: Reviews ── order-4 (always last on mobile & desktop) */}
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

        </div>{/* ── End grid ── */}

        {/* Similar resorts (full width below grid) */}
        <SimilarResorts resorts={similarResorts} />

      </div>
    </div>
  );
};

export default DynamicProduct;