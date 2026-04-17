/**
 * Formats a date as DD/MM/YYYY (Indian/European style).
 * Accepts a Date object, ISO string, or any value accepted by `new Date()`.
 */
export function formatDate(value) {
  const d = new Date(value);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats as "16 Apr 2026" — readable short form, day-first.
 */
export function formatDateShort(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
