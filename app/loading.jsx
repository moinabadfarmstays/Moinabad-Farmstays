/**
 * app/loading.jsx  — Root-level loading UI
 * Shown for any route that doesn't have its own loading.jsx.
 * Also handles initial page load transitions.
 */
import { PageSpinner } from "@/app/components/ui/Skeleton";

export default function RootLoading() {
  return <PageSpinner />;
}
