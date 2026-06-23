/**
 * app/(app)/resorts/weekend/page.js
 * Target: "weekend getaway near Hyderabad farmhouse", "weekend stay Moinabad",
 *         "weekend outing Hyderabad", "weekend trip near Hyderabad"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Weekend Getaway Farmhouses Near Hyderabad — Moinabad Stays",
  description:
    "Plan a perfect weekend getaway near Hyderabad at Moinabad Farmstays. Private pool farmhouses in Moinabad, Rangareddy District — 35–45 min from Hyderabad. Book direct, best rates.",
  keywords: [
    "weekend getaway near Hyderabad",
    "weekend farmhouse near Hyderabad",
    "weekend stay Moinabad",
    "weekend outing Hyderabad farmhouse",
    "2 day trip near Hyderabad",
    "short break near Hyderabad",
    "weekend trip Telangana",
    "Moinabad weekend package",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/weekend` },
  openGraph: {
    title: "Weekend Getaway Farmhouses Near Hyderabad — Moinabad",
    description:
      "Escape to a private pool farmhouse in Moinabad for a weekend — just 35–45 minutes from Hyderabad.",
    url: `${BASE_URL}/resorts/weekend`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Weekend getaway farmhouse near Hyderabad" }],
  },
};

const FAQ_ITEMS = [
  {
    q: "What are the best farmhouses near Hyderabad for a weekend getaway?",
    a: "Moinabad Farmstays offers some of the best farmhouses near Hyderabad for a weekend getaway. Located in Moinabad, Rangareddy District — approximately 35–45 minutes from Hyderabad via the ORR — the farmhouses feature private swimming pools, lush lawns, AC rooms, and BBQ setups. Prices start from ₹5,000 per night on weekdays and vary for weekends. Contact Jagan at +91 6304691625 for current weekend availability.",
  },
  {
    q: "How do I plan a 2-day weekend trip from Hyderabad to Moinabad?",
    a: "A 2-day weekend stay at Moinabad Farmstays typically starts with check-in on Saturday at 2 PM. Enjoy the pool, lawn, and outdoor areas on Day 1. Day 2 includes a relaxed morning, breakfast, and check-out by 11 AM. The drive from Hyderabad via ORR takes 35–45 minutes, making it easy to reach by Friday evening or Saturday morning. Book via WhatsApp at +91 6304691625.",
  },
  {
    q: "Are weekend bookings available last minute?",
    a: "Weekend slots at Moinabad Farmstays get booked quickly, especially during peak seasons (October–February and summer holidays). We recommend booking at least 1–2 weeks in advance for weekends. For last-minute bookings, WhatsApp Jagan at +91 6304691625 to check same-day or next-day availability.",
  },
  {
    q: "What is included in a weekend farmhouse stay at Moinabad?",
    a: "A weekend farmhouse stay at Moinabad Farmstays includes exclusive use of the entire property, private swimming pool access, spacious lawn, AC bedrooms, free WiFi, free parking, and BBQ facilities at most properties. Catering can be arranged separately. Check-in is typically at 2 PM on Saturday and check-out at 11 AM on Sunday for a standard 2-day weekend booking.",
  },
  {
    q: "What is the price for a weekend stay at a Moinabad farmhouse?",
    a: "Weekend farmhouse stays at Moinabad Farmstays are priced between ₹8,000 and ₹20,000 for a full weekend (Saturday–Sunday), depending on the property size and amenities. Day packages for a single day are also available. Contact Jagan Sangeri at +91 6304691625 for the latest weekend pricing and package details.",
  },
];

const ITINERARY = [
  { day: "Day 1 — Saturday", items: ["Drive from Hyderabad (35–45 min via ORR)", "Check-in at 2 PM", "Refresh and unpack", "Pool time in the afternoon", "Sunset on the lawn", "BBQ dinner with your group"] },
  { day: "Day 2 — Sunday", items: ["Wake up to fresh countryside air", "Morning pool session", "Relaxed breakfast", "Explore Moinabad surroundings", "Check-out by 11 AM", "Return to Hyderabad refreshed"] },
];

async function getAllResorts() {
  try {
    await connectToDatabase();
    return await productModel
      .find({ available: true })
      .select("title slug _id address price profileImages images amen reviews")
      .sort({ isFeatured: -1 })
      .lean();
  } catch {
    return [];
  }
}

export default async function WeekendPage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "Weekend Getaways", item: `${BASE_URL}/resorts/weekend` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Weekend Getaway Farmhouses Near Hyderabad — Moinabad",
    description:
      "Private pool farmhouses in Moinabad, Rangareddy District for weekend getaways from Hyderabad.",
    url: `${BASE_URL}/resorts/weekend`,
    isPartOf: { "@type": "WebSite", name: "Moinabad Farmstays", url: BASE_URL },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark">Resorts</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">Weekend Getaways</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">
              Weekend Getaways
            </p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Weekend Getaway Farmhouses<br />
              <span className="text-luxury-gold-dark">Near Hyderabad — Moinabad</span>
            </h1>
            {/* Answer Layer — AI Overview optimized */}
            <p className="mt-5 max-w-2xl mx-auto text-base text-luxury-charcoal/70 leading-relaxed">
              Escape the city for a perfect 2-day weekend at a private farmhouse in Moinabad,
              Rangareddy District — just 35–45 minutes from Hyderabad via the ORR.
              Moinabad Farmstays offers private pool farmhouses with lush lawns, AC rooms, and
              BBQ facilities. Weekend packages start from ₹8,000. Book via WhatsApp: +91 6304691625.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* CTA */}
          <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'm looking for a weekend getaway farmhouse near Hyderabad. Please share availability.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3.5 font-bold text-white shadow-lg hover:scale-[1.02] transition-all"
            >
              💬 Check Weekend Availability
            </a>
            <a
              href="tel:+916304691625"
              className="rounded-2xl border border-luxury-stone/70 bg-white px-8 py-3.5 font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all"
            >
              📞 Call +91 6304691625
            </a>
          </div>

          {/* Weekend Itinerary */}
          <div className="mb-14">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6 text-center">
              Your Perfect Weekend Itinerary
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {ITINERARY.map(({ day, items }) => (
                <div key={day} className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-6">
                  <h3 className="font-bold text-luxury-gold-dark mb-4">{day}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-luxury-charcoal/75">
                        <span className="text-luxury-gold">✦</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Resort Grid */}
          <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">
            Weekend Farmhouse Options
          </h2>
          {resorts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => {
                const thumb = resort.profileImages?.[0] || resort.images?.[0];
                const avgRating = resort.reviews?.length
                  ? (resort.reviews.reduce((s, r) => s + r.rating, 0) / resort.reviews.length).toFixed(1)
                  : null;
                return (
                  <Link
                    key={resort._id}
                    href={`/resorts/${resort.slug || resort._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1"
                  >
                    {thumb ? (
                      <div className="h-48 overflow-hidden">
                        <img src={thumb} alt={`${resort.title} — weekend farmhouse near Hyderabad`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width={400} height={192} />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center text-4xl">🌿</div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="mb-1 font-display text-lg font-bold text-luxury-black group-hover:text-luxury-gold-dark">{resort.title}</h3>
                      <p className="mb-3 text-xs text-luxury-charcoal/60">{resort.address}</p>
                      <div className="mt-auto flex items-center justify-between">
                        {avgRating && <span className="text-xs font-semibold text-amber-600">★ {avgRating}</span>}
                        <span className="ml-auto font-bold text-luxury-black">₹{resort.price?.toLocaleString()}<span className="text-xs font-normal text-luxury-charcoal/55">/night</span></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Link href="/resorts" className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black">View All Farmhouses</Link>
            </div>
          )}

          {/* Internal Links */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-luxury-black mb-5">Also Explore</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/resorts/with-pool", label: "🏊 Pool Farmhouses" },
                { href: "/resorts/birthday", label: "🎂 Birthday Venues" },
                { href: "/resorts/corporate", label: "🏢 Corporate Outings" },
                { href: "/resorts/family", label: "👨‍👩‍👧 Family Stays" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="rounded-xl border border-luxury-stone/60 bg-white/95 px-4 py-3 text-sm font-medium text-luxury-charcoal hover:border-luxury-gold/50 hover:text-luxury-gold-dark transition-all text-center">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">
              Weekend Getaway — Frequently Asked Questions
            </h2>
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <h3 className="font-bold text-luxury-black mb-2">{q}</h3>
                <p className="text-sm text-luxury-charcoal/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
