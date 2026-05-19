/**
 * app/(app)/resorts/[slug]/page.jsx
 *
 * SEO-CRITICAL: Server Component wrapper for resort detail pages.
 *
 * Why this matters:
 *   - The old /detail/[id]/page.jsx used "use client" → Google saw a blank page
 *   - This file runs on the SERVER at request time
 *   - generateMetadata() injects unique title, description, OG, Twitter per resort
 *   - Full JSON-LD: Resort, AggregateRating, Review[], amenityFeature[], Breadcrumb
 *   - ResortDetailClient handles all interactivity (booking, gallery, calendar)
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import ResortDetailClient from "./_client/ResortDetailClient";
import { ResortDetailSkeleton } from "@/app/components/ui/Skeleton";
import mongoose from "mongoose";

const BASE_URL = "https://www.moinabadfarmstays.com";

/**
 * Serialize a Mongoose lean() document into a plain JSON-safe object.
 * Next.js App Router cannot pass ObjectId / Date objects from Server
 * Components to Client Components — they have custom toJSON() methods
 * which the React serializer rejects.
 *
 * JSON round-trip converts:
 *   ObjectId  → string  ("507f1f77bcf86cd799439011")
 *   Date      → string  ("2024-01-15T10:30:00.000Z")
 *   Buffer    → string  (base64)
 */
function serializeDoc(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}


// ─── Server-side data fetcher ─────────────────────────────────────────────────

async function getResort(slug) {
  try {
    await connectToDatabase();

    // Try slug first, then fall back to _id for backward compat
    let product = await productModel
      .findOne({ slug })
      .select("-bookings")
      .lean();

    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      product = await productModel.findById(slug).select("-bookings").lean();
    }

    // Serialize to plain JSON-safe object (ObjectId → string, Date → string)
    return serializeDoc(product);
  } catch {
    return null;
  }
}


// ─── generateStaticParams (ISR) ──────────────────────────────────────────────
// Pre-renders resort pages at build time for fastest TTFB

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const resorts = await productModel.find({}).select("slug _id").lean();
    return resorts.map((r) => ({ slug: r.slug || r._id.toString() }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
// This runs server-side — Google reads every tag in the rendered HTML

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resort = await getResort(slug);

  if (!resort) {
    return {
      title: "Resort Not Found | Moinabad Farmstays",
      robots: { index: false, follow: false },
    };
  }

  // Primary image (first profile image, fallback to first image, fallback to OG)
  const primaryImage =
    resort.profileImages?.[0] ||
    resort.carouselImages?.[0] ||
    resort.images?.[0] ||
    resort.image ||
    `${BASE_URL}/og-default.jpg`;

  // Compute avg rating for description
  const avgRating =
    resort.reviews?.length > 0
      ? (resort.reviews.reduce((s, r) => s + r.rating, 0) / resort.reviews.length).toFixed(1)
      : null;

  // Build keyword-rich title: "Resort Name — Luxury Farmhouse in Moinabad | Moinabad Farmstays"
  const title = `${resort.title} — Farmhouse in Moinabad | Moinabad Farmstays`;

  // Build compelling description with location + amenity signals
  const topAmenities = (resort.amen || []).slice(0, 3).join(", ");
  const ratingStr = avgRating ? ` Rated ${avgRating}★.` : "";
  const rawDesc = resort.desc
    ? resort.desc.replace(/\s+/g, " ").trim().slice(0, 100)
    : "";

  const description =
    `Book ${resort.title} in Moinabad near Hyderabad.${rawDesc ? " " + rawDesc + "." : ""}` +
    ` Amenities: ${topAmenities}.${ratingStr} Direct booking available.`
      .slice(0, 160);

  // Location string for OG
  const location = resort.address?.split(",").slice(0, 2).join(", ") || "Moinabad, Telangana";

  const canonicalSlug = resort.slug || resort._id.toString();

  return {
    title,
    description,
    keywords: [
      resort.title,
      "Moinabad resorts",
      "farmhouse in Moinabad",
      "resort near Hyderabad",
      "luxury farm stay Telangana",
      "weekend getaway Hyderabad",
      location,
      ...(resort.amen || []).slice(0, 5),
    ],
    alternates: {
      canonical: `/resorts/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/resorts/${canonicalSlug}`,
      siteName: "Moinabad Farmstays",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: `${resort.title} — Luxury Farmhouse in Moinabad near Hyderabad`,
        },
        // Secondary image for platforms that show multiple
        ...(resort.profileImages?.[1]
          ? [{ url: resort.profileImages[1], width: 1200, height: 630, alt: resort.title }]
          : []),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ─── JSON-LD Builder ─────────────────────────────────────────────────────────

function buildResortJsonLd(resort) {
  const slug = resort.slug || resort._id.toString();
  const canonicalUrl = `${BASE_URL}/resorts/${slug}`;
  const primaryImage =
    resort.profileImages?.[0] ||
    resort.images?.[0] ||
    resort.image;

  // Aggregate rating
  const reviewCount = resort.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? (resort.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  // Map amenities to schema amenityFeature
  const amenityMap = {
    "AC": "Air Conditioning",
    "WiFi": "Free WiFi",
    "Pool": "Swimming Pool",
    "Geyser": "Hot Water",
    "TV": "Television",
    "Breakfast": "Breakfast Included",
    "Parking": "Free Parking",
    "BBQ": "Barbecue Facilities",
    "Lawn": "Private Lawn",
    "Garden": "Garden",
  };

  const amenityFeatures = (resort.amen || []).map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: amenityMap[a] || a,
    value: true,
  }));

  // Individual review objects (max 5 for schema)
  const reviewSchemas = (resort.reviews || []).slice(0, 5).map((r) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Person",
      name: r.username || "Guest",
    },
    reviewBody: r.review || "",
    datePublished: r.createdAt
      ? new Date(r.createdAt).toISOString().split("T")[0]
      : undefined,
  }));

  const resortSchema = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "@id": canonicalUrl,
    name: resort.title,
    description: resort.desc?.slice(0, 500) || `${resort.title} — luxury farmhouse in Moinabad near Hyderabad.`,
    url: canonicalUrl,
    telephone: "+916304691625",
    email: "moinabadfarmstays@gmail.com",
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: resort.address || "Moinabad",
      addressLocality: "Moinabad",
      addressRegion: "Telangana",
      postalCode: "501401",
      addressCountry: "IN",
    },
    ...(resort.latitude && resort.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: resort.latitude,
            longitude: resort.longitude,
          },
          hasMap: `https://www.google.com/maps?q=${resort.latitude},${resort.longitude}`,
        }
      : {}),
    image: primaryImage
      ? [primaryImage, ...(resort.profileImages?.slice(1, 4) || [])]
      : undefined,
    amenityFeature: amenityFeatures,
    ...(avgRating && reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
          review: reviewSchemas,
        }
      : {}),
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "Moinabad Farmstays",
      url: BASE_URL,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
    ],
    offers: {
      "@type": "Offer",
      price: resort.price?.toString() || "0",
      priceCurrency: "INR",
      availability: resort.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resorts",
        item: `${BASE_URL}/resorts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: resort.title,
        item: canonicalUrl,
      },
    ],
  };

  return { resortSchema, breadcrumbSchema };
}

// ─── Page Component (Server) ──────────────────────────────────────────────────

export default async function ResortDetailPage({ params }) {
  const { slug } = await params;
  const resort = await getResort(slug);

  if (!resort) notFound();

  const { resortSchema, breadcrumbSchema } = buildResortJsonLd(resort);

  // Redirect if accessed via old _id and slug exists
  // (next.config.ts handles 301 for /detail/[id] globally)

  return (
    <>
      {/* Structured Data — read by Google at render time */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(resortSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Client Component handles all interactivity */}
      <Suspense fallback={<ResortDetailSkeleton />}>
        <ResortDetailClient
          initialResort={resort}
          slug={slug}
        />
      </Suspense>
    </>
  );
}

// ISR: revalidate every 5 minutes so edits from admin panel reflect quickly
export const revalidate = 300;
