import { Suspense } from "react";
import ResortListing from "../components/ResortListing";
import { ResortCardSkeleton } from "../components/ui/Skeleton";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  title: "All Resorts in Moinabad | Luxury Farmhouses near Hyderabad",
  description:
    "Browse all luxury farmhouses and resorts in Moinabad near Hyderabad. Filter by amenities, availability and price. Book your perfect weekend getaway in Telangana — direct, no middlemen.",
  keywords: [
    "resorts in Moinabad", "farmhouses in Moinabad", "Moinabad resort list",
    "luxury farmhouse Hyderabad", "weekend getaway resorts Telangana",
    "farm stay near Hyderabad", "book farmhouse Moinabad",
  ],
  alternates: { canonical: `${BASE_URL}/resorts` },
  openGraph: {
    title: "All Resorts in Moinabad | Moinabad Farmstays",
    description: "Explore premium farmhouses and resorts in Moinabad. Compare amenities and book directly.",
    url: `${BASE_URL}/resorts`,
    type: "website",
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

async function getResortsForSchema() {
  try {
    await connectToDatabase();
    return await productModel
      .find({ available: true })
      .select("title slug _id address price profileImages images")
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
  } catch {
    return [];
  }
}

export default async function ResortsPage({ searchParams }) {
  const q = searchParams?.q || "";
  const resorts = await getResortsForSchema();

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "All Resorts", item: `${BASE_URL}/resorts` },
    ],
  };

  // ItemList schema — lets Google show resort names in search results
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Moinabad Resorts & Farmhouses",
    description: "Luxury farmhouses and resorts in Moinabad near Hyderabad, Telangana",
    url: `${BASE_URL}/resorts`,
    numberOfItems: resorts.length,
    itemListElement: resorts.map((resort, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: resort.title,
      url: `${BASE_URL}/resorts/${resort.slug || resort._id}`,
      image: resort.profileImages?.[0] || resort.images?.[0],
    })),
  };

  // CollectionPage schema
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Resorts in Moinabad | Moinabad Farmstays",
    description: "Browse all luxury farmhouses and resorts in Moinabad near Hyderabad.",
    url: `${BASE_URL}/resorts`,
    publisher: { "@type": "Organization", name: "Moinabad Farmstays", url: BASE_URL },
    mainEntity: { "@id": `${BASE_URL}/resorts#itemlist` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={<ListingFallback />}>
        <ResortListing initialSearch={q} />
      </Suspense>
    </>
  );
}


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

