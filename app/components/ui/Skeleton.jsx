/**
 * app/components/ui/Skeleton.jsx
 *
 * Production-grade shimmer skeleton system for Moinabad Farmstays.
 * Uses CSS animation (no JS) for best performance — zero layout shift.
 * All skeletons match exact dimensions of real content to eliminate CLS.
 */

// ── Base shimmer layer ─────────────────────────────────────────────────────────
// Injected once globally via layout; re-used by all skeleton variants via class
const shimmerStyle = {
  background: "linear-gradient(90deg, #f5ede0 0%, #fdf6ec 40%, #f5ede0 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.6s ease-in-out infinite",
};

// ── Resort card skeleton (home + /resorts grid) ───────────────────────────────
export function ResortCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-luxury-stone/60 bg-white shadow-glass">
      {/* Image placeholder — exact h-56 matches real card */}
      <div className="h-56 w-full rounded-t-2xl" style={shimmerStyle} />
      <div className="space-y-3 p-5">
        {/* Title */}
        <div className="h-5 w-2/3 rounded-lg" style={shimmerStyle} />
        {/* Address */}
        <div className="h-4 w-1/2 rounded-lg" style={{ ...shimmerStyle, opacity: 0.7 }} />
        {/* Amenity chips */}
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-14 rounded-full" style={shimmerStyle} />
          <div className="h-6 w-14 rounded-full" style={{ ...shimmerStyle, opacity: 0.7 }} />
          <div className="h-6 w-14 rounded-full" style={{ ...shimmerStyle, opacity: 0.5 }} />
        </div>
        {/* Price + badge row */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-20 rounded-lg" style={shimmerStyle} />
          <div className="h-9 w-28 rounded-2xl" style={shimmerStyle} />
        </div>
      </div>
    </div>
  );
}

// ── Resort grid (3 cols default) ──────────────────────────────────────────────
export function ResortGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ResortCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Resort detail page skeleton ───────────────────────────────────────────────
export function ResortDetailSkeleton() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header card */}
        <div className="mb-8 rounded-2xl border border-luxury-stone/60 bg-white/80 px-6 py-5 shadow-sm">
          <div className="h-3 w-36 rounded mb-3" style={shimmerStyle} />
          <div className="h-9 w-3/4 rounded-xl mb-3" style={shimmerStyle} />
          <div className="h-1 w-12 rounded mb-4" style={shimmerStyle} />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full" style={shimmerStyle} />
            <div className="h-6 w-40 rounded-full" style={{ ...shimmerStyle, opacity: 0.7 }} />
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-96 rounded-2xl" style={shimmerStyle} />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 flex-1 rounded-xl" style={{ ...shimmerStyle, opacity: 0.6 }} />
              ))}
            </div>
          </div>
          {/* Booking sidebar */}
          <div className="space-y-4">
            <div className="h-80 rounded-3xl" style={shimmerStyle} />
            <div className="h-32 rounded-3xl" style={{ ...shimmerStyle, opacity: 0.7 }} />
          </div>
          {/* Description + Amenities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-luxury-stone/60 bg-white/95 p-6">
              <div className="h-6 w-48 rounded mb-4" style={shimmerStyle} />
              <div className="space-y-2">
                <div className="h-4 w-full rounded" style={{ ...shimmerStyle, opacity: 0.7 }} />
                <div className="h-4 w-5/6 rounded" style={{ ...shimmerStyle, opacity: 0.6 }} />
                <div className="h-4 w-4/6 rounded" style={{ ...shimmerStyle, opacity: 0.5 }} />
              </div>
            </div>
            <div className="h-40 rounded-3xl" style={{ ...shimmerStyle, opacity: 0.6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hero search skeleton ───────────────────────────────────────────────────────
export function HeroSearchSkeleton() {
  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-white/20" />
        ))}
      </div>
    </div>
  );
}

// ── Blog post card skeleton ───────────────────────────────────────────────────
export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-luxury-stone/60 bg-white/95">
      <div className="h-48 w-full" style={shimmerStyle} />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full" style={shimmerStyle} />
          <div className="h-5 w-16 rounded-full" style={{ ...shimmerStyle, opacity: 0.6 }} />
        </div>
        <div className="h-6 w-full rounded" style={shimmerStyle} />
        <div className="h-6 w-3/4 rounded" style={{ ...shimmerStyle, opacity: 0.8 }} />
        <div className="h-4 w-full rounded" style={{ ...shimmerStyle, opacity: 0.6 }} />
        <div className="h-4 w-5/6 rounded" style={{ ...shimmerStyle, opacity: 0.5 }} />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-24 rounded" style={{ ...shimmerStyle, opacity: 0.5 }} />
          <div className="h-3 w-16 rounded" style={{ ...shimmerStyle, opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}

// ── Branded full-page spinner ─────────────────────────────────────────────────
// Used for initial page loads and hard navigation
export function PageSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-cream gap-5">
      <div className="relative">
        {/* Outer ring */}
        <div className="h-16 w-16 rounded-full border-2 border-luxury-stone/30" />
        {/* Spinning arc */}
        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-luxury-gold" />
        {/* Gold dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-luxury-gold" />
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-luxury-charcoal/40">
        Moinabad Farmstays
      </p>
    </div>
  );
}
