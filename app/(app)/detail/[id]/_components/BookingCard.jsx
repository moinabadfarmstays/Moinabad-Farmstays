// app/(app)/detail/[id]/_components/BookingCard.jsx
"use client";
import { Calendar, AlertCircle, Sun, Moon, Clock } from "lucide-react";
import CalendarComponent from "../../../../components/Calender";
import { formatDateShort } from "../../../../utils/formatDate";
import { getPricing } from "../../../../utils/pricingUtils";

const ADMIN_PHONE = "6304691625";

function BookedDatesStrip({ bookings }) {
  if (!bookings?.length) return null;
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-red-50">
      <div className="flex items-center gap-2 border-b border-red-200 bg-red-100/70 px-4 py-2">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          Booked Dates — Not Available
        </p>
      </div>
      <ul className="divide-y divide-red-100 px-4 py-1">
        {bookings.slice(0, 4).map((b, idx) => (
          <li key={idx} className="flex items-center gap-2 py-2 text-xs text-red-800">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="font-semibold">{formatDateShort(b.startDate)}</span>
            <span className="text-red-400">→</span>
            <span className="font-semibold">{formatDateShort(b.endDate)}</span>
          </li>
        ))}
        {bookings.length > 4 && (
          <li className="py-2 text-center text-xs text-red-600 font-medium">
            +{bookings.length - 4} more booked period{bookings.length - 4 > 1 ? "s" : ""}
          </li>
        )}
      </ul>
      <div className="border-t border-red-200 px-4 py-3">
        <p className="mb-2 text-xs text-red-700">Need a booked date? Call the admin directly.</p>
        <a
          href={`tel:+91${ADMIN_PHONE}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2 text-xs font-bold text-white transition hover:bg-red-700 active:scale-95"
        >
          <PhoneIcon className="h-3.5 w-3.5" />
          Call Admin — {ADMIN_PHONE}
        </a>
      </div>
    </div>
  );
}

function OverlapBanner({ booking }) {
  if (!booking) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border-2 border-red-400 bg-red-50 shadow-lg">
      <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-600" />
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 ring-2 ring-red-300">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="font-bold text-red-700">Resort Already Booked</p>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-100/80 px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 shrink-0 text-red-500" />
          <span className="font-semibold text-red-800">
            {formatDateShort(booking.startDate)}
            {" → "}
            {formatDateShort(booking.endDate)}
          </span>
        </div>
        <p className="mb-3 text-xs text-red-700">
          These dates are confirmed for another guest. Please choose different dates or contact the admin.
        </p>
        <a
          href={`tel:+91${ADMIN_PHONE}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95"
        >
          <PhoneIcon className="h-4 w-4" />
          Call Admin — {ADMIN_PHONE}
        </a>
      </div>
    </div>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

/** Compact pricing table shown at the top of the card */
function PricingTable({ pricing }) {
  const rows = [
    {
      icon: <Sun className="h-3.5 w-3.5 text-amber-500" />,
      label: "Weekend (Sat–Sun)",
      duration: "24 hrs",
      price: pricing.weekendFullDay,
      accent: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      icon: <Moon className="h-3.5 w-3.5 text-blue-500" />,
      label: "Weekday (Mon–Fri)",
      duration: "24 hrs",
      price: pricing.weekdayFullDay,
      accent: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      icon: <Clock className="h-3.5 w-3.5 text-emerald-500" />,
      label: "Weekday (Mon–Fri)",
      duration: "12 hrs",
      price: pricing.weekdayHalfDay,
      accent: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-luxury-stone/60 bg-luxury-sand/40">
      <div className="border-b border-luxury-stone/60 bg-luxury-sand/80 px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-luxury-charcoal/60">
          Pricing Schedule
        </p>
      </div>
      <div className="divide-y divide-luxury-stone/40">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {row.icon}
              <div className="min-w-0">
                <p className="text-xs font-medium text-luxury-charcoal truncate">{row.label}</p>
                <p className="text-[10px] text-luxury-charcoal/50">{row.duration}</p>
              </div>
            </div>
            <span className={`ml-2 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${row.accent}`}>
              ₹{row.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  // On weekends, force 24hr only (no 12hr option)
  const showDurationSelect = isSameDay && !isWeekend;

  return (
    <div className="rounded-3xl border border-luxury-stone/80 bg-white/95 p-6 shadow-luxury backdrop-blur-sm">

      {/* Pricing Table */}
      <PricingTable pricing={pricing} />

      {/* Booked dates info strip */}
      <BookedDatesStrip bookings={resortRoom.bookings} />

      {/* Calendar toggle */}
      <button
        type="button"
        onClick={onToggleCalendar}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-luxury-stone bg-luxury-sand/80 px-4 py-3 font-medium text-luxury-black transition hover:border-luxury-gold/50 hover:bg-luxury-sand"
      >
        <Calendar size={18} />
        {showCalendar ? "Hide Calendar" : "Select Dates"}
      </button>

      {showCalendar && (
        <div className="mb-4 space-y-4 rounded-xl border border-luxury-stone/80 bg-luxury-sand/40 p-4 shadow-sm">
          <CalendarComponent onDateChange={onDateChange} />

          <div className="space-y-3 border-t border-luxury-stone/60 pt-4">
            {/* People */}
            <div>
              <label className="mb-1 block text-sm font-medium text-luxury-charcoal">Number of People</label>
              <input
                type="number"
                min="1"
                value={numberOfPeople}
                onChange={(e) => onPeopleChange(Number(e.target.value))}
                className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
              />
            </div>

            {/* Occasion */}
            <div>
              <label className="mb-1 block text-sm font-medium text-luxury-charcoal">Occasion</label>
              <select
                value={occasion}
                onChange={(e) => onOccasionChange(e.target.value)}
                className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
                required
              >
                <option value="" disabled>Select an occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Meeting">Business Meeting</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Duration — weekday same-day only */}
            {isSameDay && (
              <div>
                <label className="mb-1 block text-sm font-medium text-luxury-charcoal">
                  Duration {isWeekend ? "(Weekend — 24hr only)" : "(Same Day)"}
                </label>
                {showDurationSelect ? (
                  <select
                    value={durationType}
                    onChange={(e) => onDurationChange(e.target.value)}
                    className="w-full rounded-lg border border-luxury-stone p-2 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20"
                  >
                    <option value="12hr">12 hrs — ₹{pricing.weekdayHalfDay.toLocaleString()}</option>
                    <option value="24hr">24 hrs — ₹{pricing.weekdayFullDay.toLocaleString()}</option>
                  </select>
                ) : (
                  /* Weekend: show locked 24hr tile */
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                    <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                    24 hrs — ₹{pricing.weekendFullDay.toLocaleString()}
                    <span className="ml-auto text-[10px] font-normal text-amber-600">(weekend rate)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price summary */}
          {totalAmount > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-luxury-gold/40 bg-luxury-gold/10">
              <div className="border-b border-luxury-gold/20 px-4 py-2 text-center">
                <p className="text-2xl font-bold text-luxury-black">₹{totalAmount.toLocaleString()}</p>
                <p className="text-xs text-luxury-charcoal/60">
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
                  <p className="px-4 py-2 text-center text-xs text-luxury-charcoal/60">
                    Avg ₹{perNight.toLocaleString()} / night (rates vary by day)
                  </p>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Overlap conflict banner */}
      <OverlapBanner booking={overlappingBooking} />

      {/* Book button */}
      <button
        type="button"
        className={`w-full rounded-2xl py-4 font-bold transition-all ${
          !bookingDisabled
            ? "bg-luxury-gold text-luxury-black shadow-luxury-gold hover:bg-luxury-gold-light"
            : "cursor-not-allowed bg-luxury-stone text-luxury-charcoal/60"
        }`}
        onClick={onBook}
        disabled={bookingDisabled}
      >
        {overlappingBooking
          ? "Dates Unavailable"
          : totalAmount > 0
          ? occasion
            ? "Request Booking"
            : "Select Occasion"
          : "Select Dates First"}
      </button>

      {totalAmount === 0 && (
        <p className="mt-2 text-center text-sm text-luxury-charcoal/60">
          Choose your check-in and check-out dates
        </p>
      )}
    </div>
  );
}
