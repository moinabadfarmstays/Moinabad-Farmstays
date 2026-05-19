/**
 * app/resorts/loading.jsx
 * Route-level loading UI for /resorts listing page.
 */
import { ResortGridSkeleton } from "@/app/components/ui/Skeleton";

export default function ResortsLoading() {
  return (
    <div className="min-h-[60vh] bg-luxury-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 rounded-xl animate-pulse bg-luxury-sand" />
          <div className="h-4 w-96 rounded-lg animate-pulse bg-luxury-sand/70" />
        </div>
        <ResortGridSkeleton count={6} />
      </div>
    </div>
  );
}
