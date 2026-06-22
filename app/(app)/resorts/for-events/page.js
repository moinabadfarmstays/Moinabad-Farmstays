/**
 * app/(app)/resorts/for-events/page.js
 * Target: "event venue Moinabad", "birthday party farmhouse Hyderabad", "party venue near Hyderabad"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Event Venues & Party Farmhouses in Moinabad | Moinabad Farmstays",
  description:
    "Book farmhouses and resort venues in Moinabad for birthday parties, anniversaries, get-togethers and events. Private lawns, pools near Hyderabad.",
  keywords: [
    "event venue Moinabad", "birthday party farmhouse Hyderabad",
    "party venue near Hyderabad", "farmhouse for birthday party Moinabad",
    "anniversary venue Moinabad", "get-together farmhouse Hyderabad",
    "private party venue Telangana",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/for-events` },
  openGraph: {
    title: "Event Venues & Party Farmhouses in Moinabad",
    description: "Birthday parties, anniversaries, get-togethers — book a private farmhouse in Moinabad.",
    url: `${BASE_URL}/resorts/for-events`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Event and party venue farmhouse in Moinabad" }],
  },
};

const FAQ_ITEMS = [
  { q: "Can I book a Moinabad farmhouse for a birthday party?", a: "Yes! All our Moinabad farmhouses can be booked for birthday parties. Private lawns, pools, and outdoor spaces are available. Contact us for decoration and catering arrangements." },
  { q: "What is the minimum booking duration for events?", a: "We offer 12-hour day packages (ideal for parties) and 24-hour overnight stays. For large events, multi-day bookings are available." },
  { q: "Do you allow outside catering at the farmhouses?", a: "Yes, outside catering and decoration are allowed at our Moinabad farmhouses. Please inform the manager in advance when booking." },
];

async function getAllResorts() {
  try {
    await connectToDatabase();
    return await productModel
      .find({ available: true })
      .select("title slug _id address price profileImages images amen reviews")
      .sort({ isFeatured: -1 })
      .lean();
  } catch { return []; }
}

const OCCASIONS = [
  { icon: "🎂", label: "Birthday Parties" },
  { icon: "💍", label: "Anniversaries" },
  { icon: "👨‍👩‍👧", label: "Family Get-togethers" },
  { icon: "🎓", label: "Farewell Parties" },
  { icon: "💃", label: "Bachelorette Parties" },
  { icon: "🌿", label: "Reunion Events" },
];

export default async function ForEventsPage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "For Events", item: `${BASE_URL}/resorts/for-events` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Event & Party Farmhouses in Moinabad",
    url: `${BASE_URL}/resorts/for-events`,
    numberOfItems: resorts.length,
    itemListElement: resorts.map((r, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: r.title,
      url: `${BASE_URL}/resorts/${r.slug || r._id}`,
    })),
  };

  // FAQPage for rich snippets
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
    name: "Event Venues & Party Farmhouses in Moinabad | Moinabad Farmstays",
    description: "Book farmhouses and resort venues in Moinabad for birthday parties, anniversaries, get-togethers and events.",
    url: `${BASE_URL}/resorts/for-events`,
    isPartOf: { "@type": "WebSite", name: "Moinabad Farmstays", url: BASE_URL },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark">Resorts</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">For Events</li>
            </ol>
          </nav>

          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Event Venues</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Party & Event Farmhouses<br />
              <span className="text-luxury-gold-dark">in Moinabad near Hyderabad</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              Private lawns, pools, and premium amenities for your special occasions — just 45 minutes from Hyderabad.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Occasion tags */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {OCCASIONS.map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/95 px-4 py-2 text-sm font-medium text-luxury-charcoal shadow-sm">
                <span>{icon}</span> {label}
              </span>
            ))}
          </div>

          {/* Resort grid */}
          {resorts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => {
                const thumb = resort.profileImages?.[0] || resort.images?.[0];
                const avgRating = resort.reviews?.length
                  ? (resort.reviews.reduce((s, r) => s + r.rating, 0) / resort.reviews.length).toFixed(1)
                  : null;
                return (
                  <Link key={resort._id} href={`/resorts/${resort.slug || resort._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                    {thumb
                      ? <div className="h-48 overflow-hidden"><img src={thumb} alt={`${resort.title} — event venue in Moinabad`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /></div>
                      : <div className="h-48 bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center text-4xl">🎉</div>
                    }
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="mb-1 font-display text-lg font-bold text-luxury-black group-hover:text-luxury-gold-dark">{resort.title}</h2>
                      <p className="mb-3 text-xs text-luxury-charcoal/60 line-clamp-2">{resort.address}</p>
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
            <div className="text-center py-16">
              <Link href="/resorts" className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black">View All Resorts</Link>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 rounded-3xl border border-luxury-gold/30 bg-gradient-to-br from-luxury-sand to-white p-8 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-luxury-black">Planning a Large Event?</h2>
            <p className="mb-6 text-luxury-charcoal/70">Contact Jagan directly for group discounts and custom event packages.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="tel:+916304691625" className="rounded-xl border border-luxury-stone/70 bg-white px-6 py-3 text-sm font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all">📞 +91 6304691625</a>
              <a href="https://wa.me/916304691625?text=Hi Jagan, I'd like to book a farmhouse for an event in Moinabad." target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] transition-all">💬 WhatsApp</a>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-12 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Event FAQ</h2>
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <h3 className="font-bold text-luxury-black mb-2">{q}</h3>
                <p className="text-sm text-luxury-charcoal/70">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
