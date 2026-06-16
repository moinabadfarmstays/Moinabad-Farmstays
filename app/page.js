import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import SiteLayout from "./components/layout/SiteLayout";
import HomeWithHero from "./components/HomeWithHero";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Best Farmhouses in Moinabad | Pool Party & Resort Bookings Near Hyderabad",
  description:
    "Book premium farmhouses in Moinabad for pool parties, corporate events, family outings, birthday celebrations, and weekend stays near Hyderabad.",
  keywords: [
    "Farmhouses in Moinabad", "Farmhouse for Rent in Moinabad", "Pool Party Farmhouse Hyderabad",
    "Luxury Farmhouse Hyderabad", "Corporate Event Farmhouse Hyderabad", "Family Farmhouses in Moinabad",
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Best Farmhouses in Moinabad | Pool Party & Resort Bookings",
    description:
      "Book premium farmhouses in Moinabad for pool parties, corporate events, family outings, birthday celebrations, and weekend stays near Hyderabad.",
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Moinabad Farmstays luxury pool resort" }],
  },
};

// ─── FAQ data — these exact Q&As trigger Google FAQ rich snippets ─────────────
const FAQ_ITEMS = [
  {
    q: "Where is Moinabad Farmstays located?",
    a: "Moinabad Farmstays is located in Moinabad, Rangareddy District, Telangana — approximately 35–45 minutes from Hyderabad city center via the ORR.",
  },
  {
    q: "How do I book a farmhouse at Moinabad Farmstays?",
    a: "You can book directly on our website moinabadfarmstays.com. Select your resort, choose your dates, and submit a booking request. Our manager Jagan will confirm within a few hours via WhatsApp.",
  },
  {
    q: "What is the price range for resorts in Moinabad?",
    a: "Our farmhouses start from ₹5,000 per night for weekday bookings. Weekend and full-day rates vary by property. All prices include amenities like AC, pool access, and lawn.",
  },
  {
    q: "Do the resorts have swimming pools?",
    a: "Yes, several of our Moinabad farmhouses feature private swimming pools. You can filter by amenity on our Resorts page to find pool-inclusive properties.",
  },
  {
    q: "Can I book for corporate team outings or events?",
    a: "Absolutely. We cater to corporate team outings, birthday parties, anniversaries, and family get-togethers. Contact Jagan Sangeri at +91 6304691625 for group packages.",
  },
  {
    q: "What is the check-in and check-out time?",
    a: "Standard check-in is 2:00 PM and check-out is 11:00 AM. For 12-hour day packages, timings may vary. Please confirm with the manager at the time of booking.",
  },
];

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
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.2637",
      longitude: "77.9890",
    },
    hasMap: "https://maps.app.goo.gl/Moinabad",
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

  // ── FAQPage schema ──────────────────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(resortSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteLayout>
        <HomeWithHero />
      </SiteLayout>
    </>
  );
}
