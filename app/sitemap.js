import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import blogModel from "@/app/utils/models/blogModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

// Update this whenever static page content meaningfully changes.
const STATIC_LAST_MODIFIED = new Date("2026-07-04");

export const revalidate = 3600;

const STATIC_PAGES = [
  { url: BASE_URL,                         changeFrequency: "daily",   priority: 1.0  },
  { url: `${BASE_URL}/resorts`,            changeFrequency: "daily",   priority: 0.95 },
  { url: `${BASE_URL}/resorts/with-pool`,  changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/for-events`, changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/birthday`,   changeFrequency: "weekly",  priority: 0.85 },
  { url: `${BASE_URL}/resorts/weekend`,    changeFrequency: "weekly",  priority: 0.82 },
  { url: `${BASE_URL}/resorts/corporate`,  changeFrequency: "weekly",  priority: 0.80 },
  { url: `${BASE_URL}/resorts/family`,     changeFrequency: "weekly",  priority: 0.80 },
  { url: `${BASE_URL}/resorts/bachelor`,   changeFrequency: "weekly",  priority: 0.78 },
  { url: `${BASE_URL}/contact`,            changeFrequency: "monthly", priority: 0.65 },
  { url: `${BASE_URL}/about`,              changeFrequency: "monthly", priority: 0.60 },
  { url: `${BASE_URL}/blog`,               changeFrequency: "weekly",  priority: 0.75 },
];

function resolveImageUrl(raw) {
  if (!raw) return null;
  if (typeof raw === "string") {
    return raw.startsWith("http") ? raw : null;
  }
  if (typeof raw === "object" && raw !== null) {
    const candidate = raw.url ?? raw.secure_url ?? raw.src ?? raw.href ?? null;
    return typeof candidate === "string" && candidate.startsWith("http")
      ? candidate
      : null;
  }
  return null;
}

function extractImageUrls(product) {
  return [
    product.image,
    ...(product.profileImages || []),
    ...(product.images || []),
  ]
    .map(resolveImageUrl)
    .filter(Boolean)
    .slice(0, 5);
}

export default async function sitemap() {
  let resortUrls = [];
  let blogUrls = [];

  try {
    await connectToDatabase();

    const [products, blogs] = await Promise.all([
      productModel
        .find({ available: true })
        .select("slug _id updatedAt title profileImages images image")
        .lean(),
      blogModel
        .find({ published: true })
        .select("slug updatedAt")
        .lean(),
    ]);

    resortUrls = products.map((product) => {
      const slugOrId = product.slug || product._id.toString();
      const imageUrls = extractImageUrls(product);

      const entry = {
        url: `${BASE_URL}/resorts/${slugOrId}`,
        lastModified: product.updatedAt || STATIC_LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.88,
      };

      if (imageUrls.length > 0) {
        entry.images = imageUrls;
      }

      return entry;
    });

    blogUrls = blogs.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastModified: STATIC_LAST_MODIFIED })),
    ...resortUrls,
    ...blogUrls,
  ];
}
