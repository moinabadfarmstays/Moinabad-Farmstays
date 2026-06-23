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
// Answers are deliberately 3–5 sentences with entity-rich language to maximise
// the chance of being cited verbatim in Google AI Overviews and Perplexity.
const FAQ_ITEMS = [
  {
    q: "Where is Moinabad Farmstays located?",
    a: "Moinabad Farmstays is located in Moinabad, Rangareddy District, Telangana — approximately 35–45 minutes from Hyderabad city center via the Outer Ring Road (ORR). The farmhouses are situated in a quiet, green countryside setting away from city noise. From Gachibowli and Hitech City, the drive is around 32–38 km. From Jubilee Hills and Banjara Hills, expect 40–50 minutes. Moinabad is one of the closest private nature retreat destinations from Hyderabad.",
  },
  {
    q: "How do I book a farmhouse at Moinabad Farmstays?",
    a: "You can book a farmhouse directly on our website moinabadfarmstays.com — browse the available resorts, choose your preferred property, and submit a booking request. Alternatively, WhatsApp or call Jagan Sangeri at +91 6304691625 for the fastest confirmation. Booking requests are typically confirmed within a few hours. An advance payment is required to secure the booking. Direct booking ensures the best rates with no intermediary fees.",
  },
  {
    q: "What is the price range for farmhouses in Moinabad?",
    a: "Farmhouses at Moinabad Farmstays are priced from ₹5,000 per night for weekday bookings and from ₹8,000 for weekend bookings, depending on the property size and amenities. 12-hour day packages start from ₹4,000 and are ideal for day outings, birthday parties, and corporate events. All prices include amenities such as AC, private swimming pool access, lawn, parking, and WiFi. Catering can be arranged as an additional add-on. Contact Jagan at +91 6304691625 for current pricing on specific properties.",
  },
  {
    q: "Do the farmhouses in Moinabad have private swimming pools?",
    a: "Yes, several farmhouses at Moinabad Farmstays feature private swimming pools that are exclusively available to guests during their stay — there is no shared access with other guests. The pools are cleaned and maintained before each booking. Pool access is included in the standard booking price with no additional charges. Moinabad's warm climate makes the pool a highlight for both day visits and overnight stays. Browse our Private Pool Farmhouses page at moinabadfarmstays.com/resorts/with-pool to see pool-equipped properties.",
  },
  {
    q: "Can I book a Moinabad farmhouse for corporate team outings or events?",
    a: "Yes, Moinabad Farmstays regularly hosts corporate team outings, strategy offsites, team-building events, and company celebrations. Our farmhouses in Moinabad, Rangareddy District can accommodate teams of 10 to 100+ people in a private, distraction-free environment 35–45 minutes from Hyderabad. Corporate packages include private use of the farmhouse, pool, lawn, and arrangements for catering, activities, and BBQ. Custom group pricing is available for teams of 15 or more. Contact Jagan Sangeri at +91 6304691625 or visit moinabadfarmstays.com/resorts/corporate for details.",
  },
  {
    q: "What is the check-in and check-out time at Moinabad Farmstays?",
    a: "Standard check-in time at Moinabad Farmstays is 2:00 PM and check-out is 11:00 AM. For overnight stays, this provides approximately 21 hours of exclusive property access. For 12-hour day packages, check-in can be arranged from 9 AM to 10 AM with check-out by 9 PM to 10 PM — exact timings vary by property. Early check-in and late check-out may be available based on prior bookings. Please confirm timings with Jagan at the time of booking.",
  },
  {
    q: "How far is Moinabad from Hyderabad?",
    a: "Moinabad is located approximately 32–42 km from Hyderabad city center, making it a 35–45 minute drive via the Outer Ring Road (ORR). From Gachibowli and Hitech City, Moinabad is about 32–35 km. From the Hyderabad airport (Shamshabad), the drive is approximately 45–55 minutes. Moinabad falls within Rangareddy District, Telangana — one of the closest countryside destinations from Hyderabad for day outings and overnight farm stays.",
  },
  {
    q: "What amenities are included at Moinabad farmhouses?",
    a: "Moinabad Farmstays farmhouses include private swimming pools, spacious lawns, air-conditioned bedrooms, free high-speed WiFi, ample free parking, BBQ/bonfire facilities, and outdoor seating areas. Some properties include a fully equipped kitchen. All properties are booked exclusively — there are no shared spaces with other guests. Catering for events, group meals, and birthday parties can be arranged separately with advance notice. Contact Jagan at +91 6304691625 for a full amenity list for a specific property.",
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
