// app/(app)/detail/[id]/_components/BookingCard.jsx
"use client";
import { Calendar, AlertCircle, Sun, Moon, Clock, Phone, Users, Sparkles } from "lucide-react";
import CalendarComponent from "../../../../components/Calender";
import { formatDateShort } from "../../../../utils/formatDate";
import { getPricing } from "../../../../utils/pricingUtils";

const ADMIN_PHONE = "6304691625";

/* ── Phone SVG ─────────────────────────────────────────────────────────────── */
function PhoneIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

/* ── Booked dates strip ─────────────────────────────────────────────────────── */
function BookedDatesStrip({ bookings }) {
  if (!bookings?.length) return null;
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 to-rose-50/60">
      <div className="flex items-center gap-2 border-b border-red-200/60 bg-red-100/60 px-4 py-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-200">
          <AlertCircle className="h-3 w-3 text-red-700" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-red-700">
          Unavailable Dates
        </p>
      </div>
      <ul className="divide-y divide-red-100/60 px-4 py-1">
        {bookings.slice(0, 4).map((b, idx) => (
          <li key={idx} className="flex items-center gap-2.5 py-2 text-xs text-red-800">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="font-bold">{formatDateShort(b.startDate)}</span>
            <span className="text-red-300">→</span>
            <span className="font-bold">{formatDateShort(b.endDate)}</span>
          </li>
        ))}
        {bookings.length > 4 && (
          <li className="py-2 text-center text-[11px] font-semibold text-red-500">
            +{bookings.length - 4} more unavailable period{bookings.length - 4 > 1 ? "s" : ""}
          </li>
        )}
      </ul>
      <div className="border-t border-red-200/60 px-4 py-3">
        <p className="mb-2 text-xs text-red-600/80">
          Need a booked date? Contact admin directly.
        </p>
        <a
          href={`tel:+91${ADMIN_PHONE}`}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95"
        >
          <PhoneIcon className="h-3.5 w-3.5" />
          Call Admin — {ADMIN_PHONE}
        </a>
      </div>
    </div>
  );
}

/* ── Overlap conflict banner ────────────────────────────────────────────────── */
function OverlapBanner({ booking }) {
  if (!booking) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-rose-50 shadow-md">
      <div className="h-1 w-full bg-gradient-to-r from-red-400 via-rose-500 to-red-400" />
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 ring-2 ring-red-300">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-bold text-red-700 text-sm">Resort Already Booked</p>
            <p className="text-[11px] text-red-500">These dates are confirmed for another guest</p>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-100/70 px-3 py-2.5 text-sm">
          <Calendar className="h-4 w-4 shrink-0 text-red-500" />
          <span className="font-bold text-red-800">
            {formatDateShort(booking.startDate)} → {formatDateShort(booking.endDate)}
          </span>
        </div>
        <a
          href={`tel:+91${ADMIN_PHONE}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95"
        >
          <PhoneIcon className="h-4 w-4" />
          Call Admin — {ADMIN_PHONE}
        </a>
      </div>
    </div>
  );
}

/* ── Compact pricing table ──────────────────────────────────────────────────── */
function PricingTable({ pricing }) {
  const rows = [
    {
      icon: <Sun className="h-3.5 w-3.5 text-amber-500" />,
      label: "Weekend",
      sub: "Sat – Sun · 24 hrs",
      price: pricing.weekendFullDay,
      pill: "bg-amber-50 border-amber-200 text-amber-800",
      dot: "bg-amber-400",
    },
    {
      icon: <Moon className="h-3.5 w-3.5 text-blue-500" />,
      label: "Weekday",
      sub: "Mon – Fri · 24 hrs",
      price: pricing.weekdayFullDay,
      pill: "bg-blue-50 border-blue-200 text-blue-800",
      dot: "bg-blue-400",
    },
    {
      icon: <Clock className="h-3.5 w-3.5 text-emerald-500" />,
      label: "Weekday",
      sub: "Mon – Fri · 12 hrs",
      price: pricing.weekdayHalfDay,
      pill: "bg-emerald-50 border-emerald-200 text-emerald-800",
      dot: "bg-emerald-400",
    },
  ];

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-luxury-stone/50 bg-gradient-to-br from-luxury-sand/60 to-luxury-cream/80">
      <div className="flex items-center gap-2 border-b border-luxury-stone/40 bg-luxury-sand/70 px-4 py-3">
        <Sparkles className="h-3.5 w-3.5 text-luxury-gold-dark" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-luxury-charcoal/60">
          Pricing Schedule
        </p>
      </div>
      <div className="divide-y divide-luxury-stone/30">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-luxury-sand/30 transition-colors">
            <div className={`h-2 w-2 shrink-0 rounded-full ${row.dot}`} />
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {row.icon}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-luxury-charcoal truncate leading-tight">{row.label}</p>
                <p className="text-[10px] text-luxury-charcoal/45 leading-tight">{row.sub}</p>
              </div>
            </div>
            <span className={`ml-auto shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${row.pill}`}>
              ₹{row.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main BookingCard ───────────────────────────────────────────────────────── */
export default function BookingCard({
  resortRoom,
  showCalendar,
  onToggleCalendar,
  onDateChange,
  numberOfPeople,
  onPeopleChange,
  occasion,
  onOccasionChange,
  durationType,
  onDurationChange,
  totalAmount,
  isSameDay,
  isWeekend,
  getNights,
  selectedDates,
  overlappingBooking,
  onBook,
}) {
  const pricing = getPricing(resortRoom);
  const bookingDisabled = totalAmount === 0 || !occasion || !!overlappingBooking;
  const showDurationSelect = isSameDay && !isWeekend;

  return (
    <div className="rounded-3xl border border-luxury-stone/70 bg-white/97 shadow-[0_8px_40px_-8px_rgba(180,145,30,0.18)] backdrop-blur-sm overflow-hidden">

      {/* ── Card header accent ── */}
      <div className="h-1 w-full bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold-dark" />

      <div className="p-5 sm:p-6">

        {/* Pricing Table */}
        <PricingTable pricing={pricing} />

        {/* Booked dates info strip */}
        <BookedDatesStrip bookings={resortRoom.bookings} />

        {/* ── Calendar toggle button ── */}
        {!showCalendar ? (
          /* ── CLOSED: premium CTA ── */
          <div className="mb-4 relative">
            {/* Outer glow pulse ring */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl animate-ping-slow bg-luxury-gold/25" />

            <button
              type="button"
              onClick={onToggleCalendar}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-luxury-gold to-amber-400 px-4 py-4 shadow-[0_6px_28px_-4px_rgba(180,145,30,0.55)] transition-all duration-200 hover:scale-[1.015] hover:shadow-[0_10px_36px_-4px_rgba(180,145,30,0.70)] active:scale-[0.99] group"
            >
              {/* Shimmer sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

              <span className="relative flex flex-col items-center gap-1">
                {/* Icon row */}
                <span className="flex items-center gap-2.5">
                  <Calendar
                    size={20}
                    className="text-luxury-black/90 drop-shadow-sm group-hover:animate-bounce"
                  />
                  <span className="text-base font-black tracking-wide text-luxury-black">
                    {selectedDates?.startDate ? "Change Dates" : "Select Dates"}
                  </span>
                  {selectedDates?.startDate && (
                    <span className="rounded-full bg-luxury-black/15 px-2.5 py-0.5 text-[11px] font-bold text-luxury-black/80">
                      ✓ Set
                    </span>
                  )}
                </span>
                {/* Sub-hint */}
                {!selectedDates?.startDate && (
                  <span className="text-[11px] font-medium text-luxury-black/60 tracking-wide">
                    ↓ Tap to pick your check-in &amp; check-out
                  </span>
                )}
              </span>
            </button>
          </div>
        ) : (
          /* ── OPEN: compact muted close button ── */
          <button
            type="button"
            onClick={onToggleCalendar}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-luxury-gold/50 bg-luxury-gold/10 px-4 py-3 text-sm font-semibold text-luxury-gold-dark transition-all hover:bg-luxury-gold/15 active:scale-[0.99]"
          >
            <Calendar size={16} className="text-luxury-gold-dark" />
            Hide Calendar
          </button>
        )}

        {/* ── Calendar panel ── */}
        {showCalendar && (
          <div className="mb-4 space-y-4 rounded-2xl border border-luxury-stone/60 bg-gradient-to-br from-luxury-sand/30 to-white/80 p-4 shadow-inner">
            <CalendarComponent onDateChange={onDateChange} />

            <div className="space-y-3 border-t border-luxury-stone/50 pt-4">

              {/* People counter */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-luxury-charcoal/60">
                  <Users className="h-3.5 w-3.5" />
                  Number of Guests
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-luxury-stone/70 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => onPeopleChange(Math.max(1, numberOfPeople - 1))}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-luxury-sand/80 text-lg font-bold text-luxury-charcoal hover:bg-luxury-gold/20 hover:text-luxury-gold-dark transition-colors"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-bold text-luxury-black">
                    {numberOfPeople} {numberOfPeople === 1 ? "Guest" : "Guests"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onPeopleChange(numberOfPeople + 1)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-luxury-sand/80 text-lg font-bold text-luxury-charcoal hover:bg-luxury-gold/20 hover:text-luxury-gold-dark transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-luxury-charcoal/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => onOccasionChange(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm font-medium bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 ${
                    occasion
                      ? "border-luxury-gold/60 text-luxury-black"
                      : "border-luxury-stone/70 text-luxury-charcoal/50"
                  }`}
                  required
                >
                  <option value="" disabled>Select an occasion…</option>
                  <option value="Birthday">🎂 Birthday</option>
                  <option value="Anniversary">💍 Anniversary</option>
                  <option value="Business Meeting">💼 Business Meeting</option>
                  <option value="Party">🎉 Party</option>
                  <option value="Family Getaway">🏡 Family Getaway</option>
                  <option value="Other">✨ Other</option>
                </select>
              </div>

              {/* Duration — weekday same-day only */}
              {isSameDay && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-luxury-charcoal/60">
                    <Clock className="h-3.5 w-3.5" />
                    Duration {isWeekend ? "(Weekend — 24hr only)" : "(Same Day)"}
                  </label>
                  {showDurationSelect ? (
                    <div className="grid grid-cols-2 gap-2">
                      {["12hr", "24hr"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => onDurationChange(d)}
                          className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                            durationType === d
                              ? "border-luxury-gold bg-luxury-gold/15 text-luxury-gold-dark shadow-sm"
                              : "border-luxury-stone/60 bg-white text-luxury-charcoal/70 hover:border-luxury-gold/40"
                          }`}
                        >
                          {d === "12hr"
                            ? `12 hrs · ₹${pricing.weekdayHalfDay.toLocaleString()}`
                            : `24 hrs · ₹${pricing.weekdayFullDay.toLocaleString()}`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2.5 text-sm font-bold text-amber-800">
                      <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                      24 hrs — ₹{pricing.weekendFullDay.toLocaleString()}
                      <span className="ml-auto rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Weekend rate
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Price summary ── */}
            {totalAmount > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-luxury-gold/50 bg-gradient-to-br from-luxury-gold/12 to-amber-50/60 shadow-sm">
                <div className="px-4 py-3 text-center border-b border-luxury-gold/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold-dark/70 mb-1">
                    Total Estimate
                  </p>
                  <p className="text-3xl font-black text-luxury-black tracking-tight">
                    ₹{totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-luxury-charcoal/55 mt-0.5">
                    {isSameDay
                      ? isWeekend
                        ? "Weekend 24hr rate"
                        : `Same day — ${durationType}`
                      : `${getNights(selectedDates)} night${getNights(selectedDates) > 1 ? "s" : ""}`}
                  </p>
                </div>
                {/* Per-night breakdown for multi-day */}
                {!isSameDay && selectedDates?.startDate && selectedDates?.endDate && (() => {
                  const nights = getNights(selectedDates);
                  const perNight = Math.round(totalAmount / nights);
                  return (
                    <p className="px-4 py-2.5 text-center text-xs text-luxury-charcoal/55">
                      Avg <span className="font-semibold text-luxury-black">₹{perNight.toLocaleString()}</span> / night
                      <span className="text-[10px] block text-luxury-charcoal/40">(rates vary by weekday / weekend)</span>
                    </p>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Overlap conflict banner */}
        <OverlapBanner booking={overlappingBooking} />

        {/* ── Book button ── */}
        <button
          type="button"
          className={`w-full rounded-2xl py-4 text-sm font-bold tracking-wide transition-all duration-200 ${
            !bookingDisabled
              ? "bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold-dark text-luxury-black shadow-[0_4px_20px_-4px_rgba(180,145,30,0.45)] hover:shadow-[0_6px_24px_-4px_rgba(180,145,30,0.60)] hover:scale-[1.015] active:scale-[0.99]"
              : "cursor-not-allowed bg-luxury-stone/50 text-luxury-charcoal/40"
          }`}
          onClick={onBook}
          disabled={bookingDisabled}
        >
          {overlappingBooking
            ? "⛔ Dates Unavailable"
            : totalAmount > 0
            ? occasion
              ? "✦ Request Booking"
              : "Select Occasion First"
            : "Select Dates to Continue"}
        </button>

        {totalAmount === 0 && (
          <p className="mt-2.5 text-center text-xs text-luxury-charcoal/45">
            Choose your check-in and check-out dates above
          </p>
        )}
      </div>
    </div>
  );
}
