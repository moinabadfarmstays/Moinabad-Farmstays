/**
 * app/(app)/resorts/[slug]/loading.jsx
 *
 * App Router route-level loading UI — shown instantly while the Server Component
 * fetches resort data from MongoDB. Eliminates white-screen wait.
 * Next.js automatically wraps this in a Suspense boundary.
 */
import { ResortDetailSkeleton } from "@/app/components/ui/Skeleton";

export default function ResortDetailLoading() {
  return <ResortDetailSkeleton />;
}
