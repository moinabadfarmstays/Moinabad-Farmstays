import { Suspense } from "react";
import ResortListing from "../components/ResortListing";
import { ResortCardSkeleton } from "../components/ui/Skeleton";

export const metadata = {
  title: "Explore Resorts | Moinabad Farm Stays & Family Resorts",
  description: "Browse our curated list of luxury farmhouses and family resorts near Hyderabad. Find availability, compare amenities, and book your Moinabad weekend getaway.",
  alternates: {
    canonical: "/resorts",
  },
};

function ListingFallback() {
  return (
    <div className="min-h-[60vh] bg-luxury-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-luxury-sand" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResortCardSkeleton />
          <ResortCardSkeleton />
          <ResortCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export default function ResortsPage({ searchParams }) {
  const q = searchParams?.q || "";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.moinabadfarmstays.com"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Resorts",
      "item": "https://www.moinabadfarmstays.com/resorts"
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ListingFallback />}>
        <ResortListing initialSearch={q} />
      </Suspense>
    </>
  );
}
