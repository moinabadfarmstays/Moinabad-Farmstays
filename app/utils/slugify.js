/**
 * slugify.js — Production-grade slug generator for Moinabad Farmstays
 * Used by: productModel.js (pre-save), AddProduct admin form, sitemap.js
 */

/**
 * Converts a resort title into a URL-safe, SEO-friendly slug.
 * e.g. "Green Valley Farm & Resort!" → "green-valley-farm-resort"
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .toLowerCase()
    .normalize("NFD")                        // Decompose accented chars
    .replace(/[\u0300-\u036f]/g, "")         // Strip diacritics
    .replace(/[^\w\s-]/g, " ")              // Non-word chars → space
    .trim()
    .replace(/[\s_]+/g, "-")               // Spaces/underscores → hyphen
    .replace(/-+/g, "-")                   // Collapse multiple hyphens
    .replace(/^-|-$/g, "");                // Strip leading/trailing hyphens
}

/**
 * Ensures slug uniqueness by appending a numeric suffix if needed.
 * Used in admin product creation where model uniqueness might conflict.
 * @param {string} baseSlug
 * @param {Function} existsCheck  async (slug) => boolean
 * @returns {Promise<string>}
 */
export async function uniqueSlug(baseSlug, existsCheck) {
  let slug = baseSlug;
  let counter = 1;

  while (await existsCheck(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
