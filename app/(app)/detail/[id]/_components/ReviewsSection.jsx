// app/(app)/detail/[id]/_components/ReviewsSection.jsx
"use client";
import { Star } from "lucide-react";

export default function ReviewsSection({
  reviews,
  ratingInput,
  onRatingChange,
  reviewText,
  onReviewTextChange,
  onSubmit,
  submitting,
}) {
  return (
    <div className="mt-8 rounded-3xl border border-luxury-stone/80 bg-white/95 p-5 sm:p-6 shadow-luxury">
      <h2 className="mb-6 font-display text-xl sm:text-2xl font-bold text-luxury-black">
        Reviews &amp; Ratings
      </h2>

      {/* Review Form */}
      <div className="mb-8 rounded-2xl border border-luxury-stone/80 bg-luxury-sand/40 p-4 sm:p-6">
        <h3 className="mb-4 text-base sm:text-lg font-semibold text-luxury-black">Leave a Review</h3>
        <form onSubmit={onSubmit}>
          {/* Star Rating */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-luxury-charcoal">Rating</label>
            <div className="flex gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className={`p-1 transition-colors ${ratingInput >= star ? "text-amber-400" : "text-gray-300 hover:text-amber-200"}`}
                >
                  <Star className="w-7 h-7 sm:w-8 sm:h-8" fill={ratingInput >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-luxury-charcoal">Review Text</label>
            <textarea
              value={reviewText}
              onChange={(e) => onReviewTextChange(e.target.value)}
              placeholder="Write your review about this resort..."
              className="h-24 sm:h-28 w-full resize-none rounded-xl border border-luxury-stone p-3 text-sm focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl bg-luxury-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-luxury-charcoal disabled:bg-luxury-stone disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {reviews && reviews.length > 0 ? (
          [...reviews]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((review, i) => (
              <div key={i} className="border-b border-luxury-stone/40 pb-5 last:border-b-0 last:pb-0">
                {/* Header row — stacks on mobile */}
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div className="font-semibold text-luxury-black text-sm">{review.username}</div>
                  <div className="text-xs text-luxury-charcoal/50">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex text-amber-400 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>
                      {j < review.rating ? "⭐" : <Star className="w-4 h-4 text-gray-300 inline" />}
                    </span>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-luxury-charcoal/90 leading-relaxed">{review.review}</p>
              </div>
            ))
        ) : (
          <p className="py-4 text-center text-sm text-luxury-charcoal/60">
            No reviews yet. Be the first to review this resort!
          </p>
        )}
      </div>
    </div>
  );
}
