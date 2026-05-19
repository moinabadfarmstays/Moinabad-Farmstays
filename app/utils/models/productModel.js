import mongoose from "mongoose";
import { slugify } from "@/app/utils/slugify";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // ── SEO slug — auto-generated from title, unique, URL-safe ─────────────
    slug: {
      type: String,
      unique: true,
      sparse: true,   // existing docs without slug won't conflict
      index: true,
      lowercase: true,
      trim: true,
    },

    price: { type: Number, required: true },
    offer: { type: String },

    // ── Per-resort pricing schedule ─────────────────────────────────────────
    pricing: {
      weekendFullDay: { type: Number, default: null }, // Sat/Sun — 24 hrs
      weekendHalfDay: { type: Number, default: null }, // Sat/Sun — 12 hrs
      weekdayFullDay: { type: Number, default: null }, // Mon-Fri — 24 hrs
      weekdayHalfDay: { type: Number, default: null }, // Mon-Fri — 12 hrs
    },

    desc: { type: String },
    address: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    available: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    image: { type: String },
    images: { type: [String], default: [] },
    profileImages: { type: [String], default: [] },
    carouselImages: { type: [String], default: [] },

    amen: {
      type: [String],
      required: true,
      default: ["AC", "Geyser", "WiFi", "TV"],
      set: function (amenities) {
        const defaultValues = ["AC", "Geyser", "WiFi", "TV", "Breakfast"];
        if (typeof amenities === "string") {
          amenities = amenities.split(",").map((item) => item.trim());
        }
        if (!Array.isArray(amenities)) return defaultValues;
        return [...new Set([...defaultValues, ...amenities])];
      },
    },

    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }  // adds createdAt + updatedAt — required by sitemap
);

// ── Auto-generate slug before save ─────────────────────────────────────────────
productSchema.pre("save", async function (next) {
  // Only generate/update slug if title changed or slug is empty
  if (!this.isModified("title") && this.slug) return next();

  const base = slugify(this.title);
  let candidate = base;
  let counter = 1;

  // Ensure uniqueness: keep incrementing suffix until no collision
  while (true) {
    const conflict = await mongoose.models.Product.findOne({
      slug: candidate,
      _id: { $ne: this._id },
    });
    if (!conflict) break;
    candidate = `${base}-${counter++}`;
  }

  this.slug = candidate;
  next();
});

// ── Virtual: canonical URL for use in JSON-LD and sitemaps ─────────────────────
productSchema.virtual("canonicalUrl").get(function () {
  const id = this.slug || this._id.toString();
  return `https://www.moinabadfarmstays.com/resorts/${id}`;
});

// ── Compound indexes for fast query patterns ────────────────────────────────────
// available + isFeatured  → homepage carousel   (most common query)
productSchema.index({ available: 1, isFeatured: -1 });
// available + amen        → landing pages (with-pool, corporate, family)
productSchema.index({ available: 1, amen: 1 });
// Full-text search across title, address, desc (powers the search bar)
productSchema.index(
  { title: "text", desc: "text", address: "text" },
  { weights: { title: 10, address: 5, desc: 1 }, name: "resort_text_search" }
);


const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;


