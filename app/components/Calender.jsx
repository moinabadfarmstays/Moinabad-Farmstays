"use client";
import { useState } from "react";
import { Calendar } from "react-date-range";
import { format, addDays, isBefore, isEqual } from "date-fns";
import { CalendarCheck, CalendarDays, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/**
 * Two-step date picker:
 *  Step 1 → pick start date (check-in)
 *  Step 2 → pick end date (check-out, min = start date)
 * Calls onDateChange({ startDate, endDate, key:"selection" }) once both are set.
 */
const CalendarComponent = ({ onDateChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [step, setStep] = useState(1); // 1 = pick start, 2 = pick end
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fmt = (d) => (d ? format(d, "EEE, dd MMM yyyy") : "—");
  const fmtShort = (d) => (d ? format(d, "dd MMM") : "—");

  const handleStartSelect = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setStartDate(d);
    setEndDate(null);
    setStep(2);
    // Notify parent with same-day selection until end is chosen
    onDateChange({ startDate: d, endDate: d, key: "selection" });
  };

  const handleEndSelect = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Clamp: end cannot be before start
    const finalEnd = isBefore(d, startDate) ? startDate : d;
    setEndDate(finalEnd);
    onDateChange({ startDate, endDate: finalEnd, key: "selection" });
  };

  const reset = () => {
    setStep(1);
    setStartDate(null);
    setEndDate(null);
    onDateChange({ startDate: today, endDate: today, key: "selection" });
  };

  const bothSelected = startDate && endDate;
  const nights =
    bothSelected && !isEqual(startDate, endDate)
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : null;

  return (
    <div className="w-full">

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2 mb-4">
        {/* Step 1 bubble */}
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all flex-1 justify-center min-w-0 ${
            step === 1
              ? "bg-luxury-gold text-luxury-black shadow-md scale-[1.02]"
              : startDate
              ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
              : "bg-luxury-sand/80 border border-luxury-stone text-luxury-charcoal/60"
          }`}
        >
          {startDate && step !== 1 ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          ) : (
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate">
            {startDate ? (
              <span className="font-bold">{fmtShort(startDate)}</span>
            ) : (
              "Check-in"
            )}
          </span>
        </button>

        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-luxury-charcoal/30" />

        {/* Step 2 bubble */}
        <button
          type="button"
          onClick={() => startDate && setStep(2)}
          disabled={!startDate}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all flex-1 justify-center min-w-0 ${
            !startDate
              ? "bg-luxury-sand/40 border border-luxury-stone/40 text-luxury-charcoal/30 cursor-not-allowed"
              : step === 2
              ? "bg-luxury-gold text-luxury-black shadow-md scale-[1.02]"
              : endDate
              ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
              : "bg-luxury-sand/80 border border-luxury-stone text-luxury-charcoal/60"
          }`}
        >
          {endDate && step !== 2 ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          ) : (
            <CalendarCheck className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate">
            {endDate ? (
              <span className="font-bold">{fmtShort(endDate)}</span>
            ) : (
              "Check-out"
            )}
          </span>
        </button>
      </div>

      {/* ── Instruction label ── */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-luxury-charcoal/60 uppercase tracking-wide">
          {step === 1 ? "📅 Select your check-in date" : "📅 Select your check-out date"}
        </p>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-[11px] text-luxury-charcoal/50 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* ── Calendar ── */}
      <div className="rdr-custom-wrapper overflow-hidden rounded-xl border border-luxury-stone/60 bg-white">
        {step === 1 ? (
          <Calendar
            date={startDate || today}
            onChange={handleStartSelect}
            minDate={today}
            showDateDisplay={false}
            className="w-full"
          />
        ) : (
          <Calendar
            date={endDate || startDate}
            onChange={handleEndSelect}
            minDate={startDate}
            shownDate={startDate}
            showDateDisplay={false}
            className="w-full"
          />
        )}
      </div>

      {/* ── Summary bar ── */}
      {bothSelected && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-luxury-gold/40 bg-luxury-gold/8 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold-dark mb-0.5">
              Check-in
            </p>
            <p className="text-xs font-semibold text-luxury-black truncate">{fmt(startDate)}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-luxury-charcoal/30" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold-dark mb-0.5">
              Check-out
            </p>
            <p className="text-xs font-semibold text-luxury-black truncate">{fmt(endDate)}</p>
          </div>
          {nights && (
            <div className="shrink-0 ml-1">
              <span className="rounded-full bg-luxury-gold px-2.5 py-1 text-[11px] font-bold text-luxury-black">
                {nights}N
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Global calendar overrides ── */}
      <style jsx global>{`
        /* Wrapper sizing */
        .rdr-custom-wrapper .rdrCalendarWrapper {
          width: 100% !important;
          font-size: 13px !important;
          border-radius: 12px;
          overflow: hidden;
        }
        .rdr-custom-wrapper .rdrMonth {
          width: 100% !important;
          padding: 0 8px 8px !important;
        }
        .rdr-custom-wrapper .rdrMonths {
          justify-content: center;
        }

        /* Header */
        .rdr-custom-wrapper .rdrMonthAndYearWrapper {
          background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
          padding: 10px 4px 6px;
          border-bottom: 1px solid #e5ddd1;
        }
        .rdr-custom-wrapper .rdrMonthAndYearPickers select {
          font-weight: 700;
          color: #8a7019;
          background-color: #f0ebe3;
          border: 1px solid #d4b96a40;
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.2s;
        }
        .rdr-custom-wrapper .rdrMonthAndYearPickers select:hover {
          background-color: #e8d48b;
        }

        /* Nav buttons */
        .rdr-custom-wrapper .rdrNextPrevButton {
          background: #f0ebe3 !important;
          border-radius: 10px !important;
          border: 1px solid #d4b96a30 !important;
          width: 30px !important;
          height: 30px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.2s, transform 0.15s !important;
        }
        .rdr-custom-wrapper .rdrNextPrevButton:hover {
          background: #c9a227 !important;
          transform: scale(1.08) !important;
        }
        .rdr-custom-wrapper .rdrNextPrevButton:hover i {
          border-color: transparent transparent transparent #fff !important;
        }
        .rdr-custom-wrapper .rdrPprevButton i {
          border-color: transparent #8a7019 transparent transparent !important;
        }
        .rdr-custom-wrapper .rdrNextButton i {
          border-color: transparent transparent transparent #8a7019 !important;
        }
        .rdr-custom-wrapper .rdrNextPrevButton:hover .rdrPprevButton i {
          border-color: transparent #fff transparent transparent !important;
        }

        /* Weekday headers */
        .rdr-custom-wrapper .rdrWeekDay {
          color: #8a7019 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Day numbers */
        .rdr-custom-wrapper .rdrDayNumber span {
          font-weight: 500;
          color: #2c2416;
        }

        /* Today dot */
        .rdr-custom-wrapper .rdrDayToday .rdrDayNumber span::after {
          background-color: #c9a227 !important;
          width: 5px !important;
          height: 5px !important;
        }
        .rdr-custom-wrapper .rdrDayToday .rdrDayNumber span {
          font-weight: 800 !important;
        }

        /* Selected day */
        .rdr-custom-wrapper .rdrSelected {
          background: #c9a227 !important;
          border-radius: 50% !important;
        }
        .rdr-custom-wrapper .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span {
          color: #fff !important;
          font-weight: 800;
        }

        /* Hover */
        .rdr-custom-wrapper .rdrDayHovered .rdrDayNumber span {
          border: 2px solid #c9a227 !important;
          border-radius: 50%;
        }
        .rdr-custom-wrapper .rdrDay:not(.rdrDayPassive):not(.rdrDayDisabled) .rdrDayNumber:hover span {
          background: #e8d48b !important;
          border-radius: 50%;
          color: #5a4a0a !important;
        }

        /* Disabled */
        .rdr-custom-wrapper .rdrDayDisabled {
          background: transparent !important;
          opacity: 0.3;
          cursor: not-allowed !important;
        }
        .rdr-custom-wrapper .rdrDayDisabled .rdrDayNumber span {
          color: #9ca3af !important;
          text-decoration: line-through;
        }

        /* Passive days (other month) */
        .rdr-custom-wrapper .rdrDayPassive .rdrDayNumber span {
          color: #d1c9b8 !important;
        }

        /* Day cells size */
        .rdr-custom-wrapper .rdrDay {
          height: 38px !important;
        }
        @media (max-width: 380px) {
          .rdr-custom-wrapper .rdrDay {
            height: 34px !important;
          }
          .rdr-custom-wrapper .rdrCalendarWrapper {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
