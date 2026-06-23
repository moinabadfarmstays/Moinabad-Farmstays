import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

// Fixed baseline date — update this when static page content is meaningfully changed.
const STATIC_LAST_MODIFIED = new Date("2026-06-23");

// Static pages with fixed priorities
const STATIC_PAGES = [
  { url: BASE_URL,                              changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE_URL}/resorts`,                 changeFrequency: "daily",   priority: 0.95 },
  // SEO landing pages
  { url: `${BASE_URL}/resorts/with-pool`,       changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/for-events`,      changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/corporate`,       changeFrequency: "weekly",  priority: 0.80 },
  { url: `${BASE_URL}/resorts/family`,          changeFrequency: "weekly",  priority: 0.80 },
  { url: `${BASE_URL}/resorts/birthday`,        changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/weekend`,         changeFrequency: "weekly",  priority: 0.82 },
  { url: `${BASE_URL}/resorts/bachelor`,        changeFrequency: "weekly",  priority: 0.78 },
  // Trust / company pages
  { url: `${BASE_URL}/about`,                   changeFrequency: "monthly", priority: 0.60 },
  { url: `${BASE_URL}/contact`,                 changeFrequency: "monthly", priority: 0.65 },
  // Blog
  { url: `${BASE_URL}/blog`,                    changeFrequency: "weekly",  priority: 0.75 },
  // Legal
  { url: `${BASE_URL}/terms`,                   changeFrequency: "yearly",  priority: 0.20 },
];

// ── Safely extract a plain string URL from whatever shape Cloudinary
//    data takes in MongoDB: could be a bare string, { url }, { secure_url },
//    or { src }. Returns null if nothing usable is found.
function resolveImageUrl(raw) {
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    return raw.url || raw.secure_url || raw.src || null;
  }
  return null;
}

export default async function sitemap() {
  let resortUrls = [];

  try {
    await connectToDatabase();
    const products = await productModel
      .find({})
      .select("slug _id updatedAt title profileImages images")
      .lean();

    resortUrls = products.map((product) => {
      const slugOrId = product.slug || product._id.toString();

      // Resolve the primary image URL — handles string or object from DB
      const rawImage = product.profileImages?.[0] ?? product.images?.[0];
      const imageUrl  = resolveImageUrl(rawImage);

      const entry = {
        url: `${BASE_URL}/resorts/${slugOrId}`,
        lastModified: product.updatedAt || STATIC_LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.88,
      };

      // Only add the image block when we have a real, usable URL string
      if (imageUrl) {
        entry.images = [
          {
            loc:     imageUrl,
            title:   product.title,
            caption: `${product.title} — farmhouse in Moinabad near Hyderabad, Telangana`,
          },
        ];
      }

      return entry;
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastModified: STATIC_LAST_MODIFIED })),
    ...resortUrls,
  ];
}
