import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import SiteLayout from "./components/layout/SiteLayout";
import HomeWithHero from "./components/HomeWithHero";
import HomeSeoSection from "./components/HomeSeoSection";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Moinabad Farmstays | Best Farmhouses & Resorts Near Hyderabad",
  description:
    "Moinabad Farmstays — book premium farmhouses and resorts in Moinabad, Telangana for pool parties, corporate events, family outings, birthday celebrations, and weekend stays near Hyderabad.",
  keywords: [
    "Moinabad Farmstays", "moinabad farmstays", "Farmhouses in Moinabad",
    "Farmhouse for Rent in Moinabad", "resorts in Moinabad", "farm stay near Hyderabad",
    "Pool Party Farmhouse Hyderabad", "Luxury Farmhouse Hyderabad",
    "Corporate Event Farmhouse Hyderabad", "Family Farmhouses in Moinabad",
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Moinabad Farmstays | Best Farmhouses & Resorts Near Hyderabad",
    description:
      "Book premium farmhouses in Moinabad for pool parties, corporate events, family outings, birthday celebrations, and weekend stays near Hyderabad.",
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Moinabad Farmstays luxury pool resort" }],
  },
};

// ─── Fetch aggregate rating from real review data ─────────────────────────────
async function getSiteAggregateRating() {
  try {
    await connectToDatabase();
    const resorts = await productModel
      .find({ available: true })
      .select("reviews title slug _id")
      .lean();

    let totalRating = 0;
    let totalCount = 0;

    resorts.forEach((resort) => {
      (resort.reviews || []).forEach((r) => {
        totalRating += r.rating || 0;
        totalCount++;
      });
    });

    if (totalCount === 0) return null;

    return {
      rating: (totalRating / totalCount).toFixed(1),
      count: totalCount,
      resortCount: resorts.length,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session && session.user.role === "admin") redirect("/admin");

  const aggRating = await getSiteAggregateRating();

  // ── Resort (main business entity) ──────────────────────────────────────────
  const resortSchema = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "@id": `${BASE_URL}/#resort`,
    name: "Moinabad Farmstays",
    description:
      "Luxury farmhouses and resorts in Moinabad near Hyderabad, Telangana. Book premium farm stays for weekend getaways, family outings, and corporate retreats.",
    url: BASE_URL,
    telephone: "+916304691625",
    email: "moinabadfarmstays@gmail.com",
    priceRange: "₹₹₹",
    image: OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Moinabad",
      addressRegion: "Telangana",
      postalCode: "501401",
      addressCountry: "IN",
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=Moinabad+Farmstays+Moinabad+Telangana",
    openingHours: ["Mo-Fr 09:00-21:00", "Sa-Su 08:00-22:00"],
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
    sameAs: [
      "https://www.instagram.com/moinabadfarmstays",
      "https://www.facebook.com/moinabadfarmstays",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Swimming Pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private Lawn", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Barbecue", value: true },
    ],
    ...(aggRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggRating.rating,
            reviewCount: aggRating.count.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(resortSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteLayout>
        <HomeWithHero />
        <HomeSeoSection />
      </SiteLayout>
    </>
  );
}
