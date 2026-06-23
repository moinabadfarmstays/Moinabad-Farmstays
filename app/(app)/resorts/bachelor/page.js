/**
 * app/(app)/resorts/bachelor/page.js
 * Target: "bachelor party venue Hyderabad", "bachelor party farmhouse near Hyderabad",
 *         "bachelorette party farmhouse Hyderabad", "bachelor party resort Moinabad"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Bachelor & Bachelorette Party Farmhouses Near Hyderabad — Moinabad",
  description:
    "Book private farmhouses in Moinabad for bachelor and bachelorette parties near Hyderabad. Exclusive pool venues for groups of 10–50. 35–45 min from Hyderabad. WhatsApp: +91 6304691625.",
  keywords: [
    "bachelor party venue Hyderabad",
    "bachelor party farmhouse near Hyderabad",
    "bachelorette party farmhouse Hyderabad",
    "bachelor party Moinabad",
    "stag party venue near Hyderabad",
    "private party venue Hyderabad group",
    "bachelor party resort Rangareddy",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/bachelor` },
  openGraph: {
    title: "Bachelor Party Farmhouses Near Hyderabad — Private Pool Venues",
    description:
      "Private pool farmhouses in Moinabad for bachelor and bachelorette parties near Hyderabad.",
    url: `${BASE_URL}/resorts/bachelor`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Bachelor party farmhouse near Hyderabad" }],
  },
};

const FAQ_ITEMS = [
  {
    q: "Are bachelor parties allowed at Moinabad farmhouses?",
    a: "Yes, bachelor and bachelorette parties are welcome at Moinabad Farmstays. Our private farmhouses are exclusively booked per group, so there are no other guests on the property. The farmhouses in Moinabad, Rangareddy District offer private pools, spacious lawns, and BBQ setups ideal for celebration parties. Contact Jagan at +91 6304691625 to confirm your preferred date and arrange group pricing.",
  },
  {
    q: "How many people can a Moinabad farmhouse accommodate for a bachelor party?",
    a: "Our Moinabad farmhouses can accommodate bachelor or bachelorette parties for groups of 10 to 50 people, depending on the property. Outdoor lawn and pool areas can host larger groups for day-time celebrations. For groups above 50, multiple properties can be arranged. WhatsApp Jagan at +91 6304691625 to find the right farmhouse for your group size.",
  },
  {
    q: "Can we play music and have drinks at a bachelor party farmhouse?",
    a: "Music is allowed at our Moinabad farmhouses. Please confirm exact permitted hours with Jagan at the time of booking. Regarding beverages, guests are responsible for compliance with applicable laws. The farmhouse premises are private and exclusive to your group for the duration of your booking.",
  },
  {
    q: "What is the cost for a bachelor party farmhouse booking near Hyderabad?",
    a: "Bachelor party farmhouse bookings at Moinabad Farmstays range from ₹8,000 to ₹18,000 for a day booking or ₹12,000 to ₹25,000 for an overnight stay, depending on group size and property. Weekend bookings cost more than weekdays. Contact Jagan at +91 6304691625 for a group quote and current availability.",
  },
];

const FEATURES = [
  { icon: "🏊", title: "Private Pool", desc: "Exclusive pool access — no other guests" },
  { icon: "🌿", title: "Spacious Lawn", desc: "Large outdoor area for group activities" },
  { icon: "🍖", title: "BBQ Setup", desc: "Grill and party under the open sky" },
  { icon: "🚗", title: "35–45 Min Drive", desc: "Easy access from Hyderabad via ORR" },
  { icon: "🎵", title: "Music Allowed", desc: "Party with your favourite playlist" },
  { icon: "🔒", title: "Full Privacy", desc: "Entire property exclusively for your group" },
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

export default async function BachelorPage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "Bachelor Party Venues", item: `${BASE_URL}/resorts/bachelor` },
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
    name: "Bachelor Party Farmhouses Near Hyderabad — Moinabad",
    description: "Private pool farmhouses in Moinabad for bachelor and bachelorette parties near Hyderabad.",
    url: `${BASE_URL}/resorts/bachelor`,
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
              <li className="text-luxury-charcoal/80 font-medium">Bachelor Party Venues</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">
              Bachelor & Bachelorette Parties
            </p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Bachelor Party Farmhouses<br />
              <span className="text-luxury-gold-dark">Near Hyderabad — Private & Exclusive</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-base text-luxury-charcoal/70 leading-relaxed">
              Moinabad Farmstays offers exclusive private farmhouses in Moinabad, Rangareddy District
              for bachelor and bachelorette parties — just 35–45 minutes from Hyderabad via ORR.
              Private pools, spacious lawns, BBQ setups, and full property exclusivity for groups
              of 10 to 50 guests. Contact Jagan at +91 6304691625.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* CTA */}
          <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'd like to book a farmhouse for a bachelor party near Hyderabad. Please share availability and pricing.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3.5 font-bold text-white shadow-lg hover:scale-[1.02] transition-all"
            >
              💬 WhatsApp for Group Booking
            </a>
            <a href="tel:+916304691625" className="rounded-2xl border border-luxury-stone/70 bg-white px-8 py-3.5 font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all">
              📞 Call +91 6304691625
            </a>
          </div>

          {/* Features */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-luxury-stone/60 bg-white/95 p-5 shadow-sm">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-luxury-black mb-0.5">{title}</p>
                  <p className="text-sm text-luxury-charcoal/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Venues */}
          <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Available Party Venues</h2>
          {resorts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => {
                const thumb = resort.profileImages?.[0] || resort.images?.[0];
                return (
                  <Link key={resort._id} href={`/resorts/${resort.slug || resort._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                    {thumb ? (
                      <div className="h-48 overflow-hidden">
                        <img src={thumb} alt={`${resort.title} — bachelor party venue near Hyderabad`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width={400} height={192} />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-4xl">🎉</div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="mb-1 font-display text-lg font-bold text-luxury-black group-hover:text-luxury-gold-dark">{resort.title}</h3>
                      <p className="mb-3 text-xs text-luxury-charcoal/60">{resort.address}</p>
                      <span className="mt-auto font-bold text-luxury-black">₹{resort.price?.toLocaleString()}<span className="text-xs font-normal text-luxury-charcoal/55">/night</span></span>
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

          {/* Cross-links */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-luxury-black mb-5">Also Popular</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/resorts/birthday", label: "🎂 Birthday Parties" },
                { href: "/resorts/with-pool", label: "🏊 Pool Farmhouses" },
                { href: "/resorts/for-events", label: "🎊 All Events" },
                { href: "/resorts", label: "🏡 All Farmhouses" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="rounded-xl border border-luxury-stone/60 bg-white/95 px-4 py-3 text-sm font-medium text-luxury-charcoal hover:border-luxury-gold/50 hover:text-luxury-gold-dark transition-all text-center">{label}</Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Bachelor Party FAQ</h2>
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
