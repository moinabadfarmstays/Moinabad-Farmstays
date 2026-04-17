import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: String },

  // ── Per-resort pricing schedule ──────────────────────────────────────────
  pricing: {
    weekendFullDay: { type: Number, default: null }, // Fri/Sat/Sun — 24 hrs
    weekendHalfDay: { type: Number, default: null }, // Fri/Sat/Sun — 12 hrs
    weekdayFullDay: { type: Number, default: null }, // Mon-Thu — 24 hrs
    weekdayHalfDay: { type: Number, default: null }, // Mon-Thu — 12 hrs
  },

  desc: { type: String },
  address: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  available: { type: Boolean, default: true },
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
        amenities = amenities.split(",").map(item => item.trim());
      }


      if (!Array.isArray(amenities)) {
        return defaultValues;
      }
      return [...new Set([...defaultValues, ...amenities])];
    },
  },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      review: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});
  
const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;


