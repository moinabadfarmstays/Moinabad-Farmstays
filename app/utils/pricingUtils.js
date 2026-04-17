/**
 * pricingUtils.js
 * ───────────────
 * Pure helpers for date-based pricing.
 *
 * Weekend definition: Friday, Saturday, Sunday check-in nights.
 * The "night" is attributed to the day you CHECK IN (startDate).
 */

/**
 * Returns true if the given date is Fri / Sat / Sun.
 * @param {Date} date
 */
export function isWeekendDay(date) {
  const day = date.getDay(); // 0=Sun, 1=Mon, …, 5=Fri, 6=Sat
  return day === 0 || day === 5 || day === 6;
}

/**
 * Resolve the effective pricing object for a resort.
 * Falls back gracefully if the admin hasn't set per-resort prices yet.
 *
 * @param {object} resort – the product document
 * @returns {{ weekendFullDay, weekendHalfDay, weekdayFullDay, weekdayHalfDay }}
 */
export function getPricing(resort) {
  const p = resort?.pricing || {};
  const base = resort?.price || 0;
  return {
    weekendFullDay: p.weekendFullDay || base || 18000,
    weekendHalfDay: p.weekendHalfDay || Math.round((p.weekendFullDay || base || 18000) * 0.67) || 12000,
    weekdayFullDay: p.weekdayFullDay || base || 15000,
    weekdayHalfDay: p.weekdayHalfDay || Math.round((p.weekdayFullDay || base || 15000) * 0.8) || 12000,
  };
}

/**
 * Get the nightly rate for a specific check-in date.
 * @param {Date}   date     – the check-in date for that night
 * @param {object} pricing  – result of getPricing()
 * @param {string} duration – '12hr' | '24hr'
 */
export function nightRate(date, pricing, duration = "24hr") {
  if (isWeekendDay(date)) {
    return duration === "12hr" ? pricing.weekendHalfDay : pricing.weekendFullDay;
  }
  return duration === "12hr" ? pricing.weekdayHalfDay : pricing.weekdayFullDay;
}

/**
 * Calculate total booking amount.
 *
 * @param {{ startDate, endDate }} dates
 * @param {string}  durationType – '12hr' | '24hr'
 * @param {object}  resort       – product document (has .pricing and/or .price)
 * @returns {number}
 */
export function calculateTotal(dates, durationType, resort) {
  if (!dates?.startDate || !dates?.endDate || !resort) return 0;

  const start = new Date(dates.startDate);
  const end   = new Date(dates.endDate);
  const pricing = getPricing(resort);

  // Same-day booking
  if (start.toDateString() === end.toDateString()) {
    return nightRate(start, pricing, durationType);
  }

  // Multi-day: sum each night (always 24hr rate per night)
  let total = 0;
  const cursor = new Date(start);
  while (cursor < end) {
    total += nightRate(cursor, pricing, "24hr");
    cursor.setDate(cursor.getDate() + 1);
  }
  return total;
}

/**
 * Count the number of nights in a date range.
 * Same-day = 1.
 */
export function getNights(dates) {
  if (!dates?.startDate || !dates?.endDate) return 0;
  const start = new Date(dates.startDate);
  const end   = new Date(dates.endDate);
  if (start.toDateString() === end.toDateString()) return 1;
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}
