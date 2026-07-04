/** Canonical public path for a resort listing (prefers SEO slug). */
export function getResortPath(resort) {
  const id =
    resort?.slug ||
    (typeof resort?._id?.toString === "function"
      ? resort._id.toString()
      : resort?._id);
  return `/resorts/${id}`;
}
