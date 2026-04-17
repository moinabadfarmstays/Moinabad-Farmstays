"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { MapPin, Check, AlertCircle, Star, Navigation } from "lucide-react";

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
      const similar = (data.products || []).filter(
        (p) =>
          p._id !== current._id &&
          extractArea(p.address)
            .split(",")
            .some((part) => currentArea.includes(part) && part.length > 2)
      );
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
        {/* ── Header ── */}
        <div className="mb-8">
          <BackButton label="Back to listings" className="mb-4" />

          <h1 className="mb-2 flex flex-wrap items-center gap-3 font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            {resortRoom.title}
            {avgRating && (
              <span className="flex items-center gap-1 rounded-full bg-luxury-black px-3 py-1 text-sm font-semibold text-luxury-gold-light">
                <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                {avgRating}
                <span className="font-medium text-luxury-sand/90">({reviews.length} reviews)</span>
              </span>
            )}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Address / Map link */}
            {resortRoom.address || (resortRoom.latitude && resortRoom.longitude) ? (
              <a
                href={
                  resortRoom.latitude && resortRoom.longitude
                    ? `https://www.google.com/maps?q=${resortRoom.latitude},${resortRoom.longitude}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(resortRoom.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-luxury-charcoal/75 hover:text-luxury-gold-dark transition-colors group"
              >
                <MapPin className="h-5 w-5 text-luxury-gold-dark shrink-0 group-hover:scale-110 transition-transform" />
                <span className="underline-offset-2 group-hover:underline">
                  {resortRoom.address || "View Location"}
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-luxury-charcoal/75">
                <MapPin className="h-5 w-5 text-luxury-gold-dark" />
                <span>Location not specified</span>
              </div>
            )}

            {/* Directions button */}
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
                className="inline-flex items-center gap-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 px-4 py-1.5 text-sm font-medium text-luxury-gold-dark hover:bg-luxury-gold/25 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Directions
              </button>
            )}
          </div>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">

          {/* ── Col 1-2 top: Galleries ── */}
          <div className="lg:col-span-2 order-1 space-y-8">
            <ResortGallery
              images={displayImages}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
              onOpen={(i) => { setGalleryIndex(i); setShowGallery(true); }}
            />
          </div>

          {/* ── Col 3: Booking sidebar ── */}
          <div className="lg:col-span-1 lg:row-span-2 space-y-6 lg:sticky lg:top-8 order-2">
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
            <ImportantInfo />
            <BookingProcess />
          </div>

          {/* ── Col 1-2 bottom: Description, Amenities, Reviews ── */}
          <div className="lg:col-span-2 space-y-6 order-3">
            {/* Description */}
            <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury">
              <h2 className="mb-4 font-display text-2xl font-bold text-luxury-black">About This Room</h2>
              <p className="text-lg text-luxury-charcoal/90">{resortRoom.desc}</p>
            </div>

            <AmenitiesSection amenities={resortRoom.amen || []} />

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