import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true },   // Markdown or HTML
    coverImage: { type: String },
    author: { type: String, default: "Jagan Sangeri" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    readingTime: { type: Number, default: 5 },   // minutes
    views: { type: Number, default: 0 },
    // SEO fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    canonicalUrl: { type: String },
    // FAQ for schema markup
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate reading time based on content length
blogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

const blogModel =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default blogModel;
