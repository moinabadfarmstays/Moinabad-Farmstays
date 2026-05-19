/**
 * app/(app)/blog/loading.jsx
 * Route-level loading for blog index.
 */
import { BlogCardSkeleton } from "@/app/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center space-y-3">
          <div className="h-4 w-32 rounded mx-auto animate-pulse bg-luxury-sand" />
          <div className="h-10 w-72 rounded-xl mx-auto animate-pulse bg-luxury-sand" />
          <div className="h-4 w-96 rounded mx-auto animate-pulse bg-luxury-sand/70" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
