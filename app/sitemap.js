import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

// Static pages with fixed priorities
const STATIC_PAGES = [
  { url: BASE_URL,                              changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE_URL}/resorts`,                 changeFrequency: "daily",   priority: 0.95 },
  // SEO landing pages
  { url: `${BASE_URL}/resorts/with-pool`,       changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/for-events`,      changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/corporate`,       changeFrequency: "weekly",  priority: 0.80 },
  { url: `${BASE_URL}/resorts/family`,          changeFrequency: "weekly",  priority: 0.80 },
  // Blog
  { url: `${BASE_URL}/blog`,                    changeFrequency: "weekly",  priority: 0.75 },
  // Legal
  { url: `${BASE_URL}/terms`,                   changeFrequency: "yearly",  priority: 0.20 },
];

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
      const primaryImage =
        product.profileImages?.[0] || product.images?.[0];

      const entry = {
        url: `${BASE_URL}/resorts/${slugOrId}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.88,
      };

      // Image sitemap extension (Google reads these for image indexing)
      if (primaryImage) {
        entry.images = [primaryImage];
      }

      return entry;
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastModified: new Date() })),
    ...resortUrls,
  ];
}
