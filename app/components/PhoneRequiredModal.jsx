"use client";

import { useRouter } from "next/navigation";
import { Phone, X, ArrowRight, ShieldAlert } from "lucide-react";

/**
 * PhoneRequiredModal
 * Shown when a Google-authenticated user tries to book without a phone number.
 * Redirects them to the profile page to fill in their number.
 */
const PhoneRequiredModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const goToProfile = () => {
    onClose();
    router.push("/user/profile?editPhone=1");
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="phone-required-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-luxury-stone/60 bg-white shadow-luxury animate-fade-in">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-luxury-sand/80 text-luxury-charcoal transition hover:bg-luxury-stone/60"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold-dark" />

        <div className="p-8">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-2 ring-luxury-gold/30">
            <ShieldAlert className="h-8 w-8 text-luxury-gold-dark" />
          </div>

          {/* Heading */}
          <h2
            id="phone-required-title"
            className="mb-2 text-center font-display text-2xl font-bold text-luxury-black"
          >
            Phone Number Required
          </h2>

          {/* Body text */}
          <p className="mb-2 text-center text-luxury-charcoal/75">
            You signed in with Google, so we don&apos;t have your phone number yet.
          </p>
          <p className="mb-7 text-center text-sm text-luxury-charcoal/60">
            We need your phone number to confirm your booking and keep you updated.
            Please add it in your profile — it only takes a second!
          </p>

          {/* Phone illustration chip */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-luxury-gold/30 bg-luxury-sand/60 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-gold/20 ring-1 ring-luxury-gold/30">
              <Phone className="h-5 w-5 text-luxury-gold-dark" />
            </div>
            <div>
              <p className="text-sm font-semibold text-luxury-black">Add Phone Number</p>
              <p className="text-xs text-luxury-charcoal/60">Your profile → Edit Profile → Phone</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-luxury-stone bg-luxury-sand/80 py-3 px-6 text-sm font-medium text-luxury-black transition hover:bg-luxury-stone/60"
            >
              Maybe Later
            </button>
            <button
              type="button"
              onClick={goToProfile}
              id="go-to-profile-btn"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-luxury-gold py-3 px-6 text-sm font-bold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light"
            >
              Go to Profile
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneRequiredModal;
