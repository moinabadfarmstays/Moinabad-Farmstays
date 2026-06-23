/**
 * app/(app)/resorts/birthday/page.js
 * Target: "birthday party farmhouse Hyderabad", "pool party birthday venue near Hyderabad",
 *         "birthday farmhouse Moinabad", "private birthday venue Hyderabad with pool"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "Birthday Party Farmhouses Near Hyderabad — Private Pool Venues in Moinabad",
  description:
    "Book private pool farmhouses in Moinabad for birthday parties near Hyderabad. Exclusive venues with pool, lawn, décor & catering. 35–45 min from Hyderabad. WhatsApp to enquire.",
  keywords: [
    "birthday party farmhouse Hyderabad",
    "birthday party venue near Hyderabad",
    "pool party birthday Moinabad",
    "private birthday venue Hyderabad",
    "birthday farmhouse Rangareddy",
    "birthday party with pool Hyderabad",
    "birthday celebration farmhouse Telangana",
    "outdoor birthday venue near Hyderabad",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/birthday` },
  openGraph: {
    title: "Birthday Party Farmhouses Near Hyderabad — Private Pool Venues",
    description:
      "Celebrate your birthday at a private pool farmhouse in Moinabad, just 35–45 minutes from Hyderabad.",
    url: `${BASE_URL}/resorts/birthday`,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Birthday party farmhouse with private pool near Hyderabad",
      },
    ],
  },
};

const FAQ_ITEMS = [
  {
    q: "How much does a birthday party farmhouse near Hyderabad cost?",
    a: "Birthday party farmhouse packages at Moinabad Farmstays start from ₹7,000 for a 12-hour day booking. Weekend rates are higher. The price includes exclusive use of the farmhouse, private pool access, lawn, and parking. Catering and décor are available as add-ons. Contact Jagan at +91 6304691625 for a custom quote based on your group size and date.",
  },
  {
    q: "Can I arrange decorations and a cake at the Moinabad farmhouse?",
    a: "Yes, you are welcome to bring your own decorations or arrange balloon/floral décor through our recommended vendors. Outside cakes and catering are allowed. Please inform Jagan at the time of booking so arrangements can be confirmed in advance.",
  },
  {
    q: "Is the swimming pool available exclusively during birthday parties?",
    a: "Yes. All farmhouses at Moinabad Farmstays are booked exclusively — the property and pool are yours for the entire booking duration. There are no shared guests or public access to the pool. This makes Moinabad farmhouses ideal for private birthday celebrations for groups of 10 to 80 people.",
  },
  {
    q: "How many guests can attend a birthday party at a Moinabad farmhouse?",
    a: "Depending on the property, our Moinabad farmhouses can comfortably host birthday parties for 15 to 80 guests. The lawns and pool areas are spacious enough for group celebrations with outdoor seating. For larger parties above 80 guests, multiple properties can be considered. Call +91 6304691625 for group arrangements.",
  },
  {
    q: "Can I play music and have a DJ at the birthday farmhouse?",
    a: "Yes, music and celebration are permitted at our Moinabad farmhouses. Please confirm permitted hours with Jagan at the time of booking. Outdoor speakers and private DJ setups are accommodated at most properties with advance notice.",
  },
  {
    q: "How far is Moinabad from Hyderabad for a birthday party?",
    a: "Moinabad is located approximately 35–45 minutes from Hyderabad city center via the Outer Ring Road (ORR). From Gachibowli and Hitech City, the drive is around 32–38 km. From Jubilee Hills and Banjara Hills, expect 40–50 minutes. It is one of the closest private farmhouse destinations from Hyderabad.",
  },
];

const HIGHLIGHTS = [
  { icon: "🏊", title: "Private Pool", desc: "Exclusive pool access — no shared guests" },
  { icon: "🌿", title: "Lush Lawn", desc: "Spacious outdoor lawn for games & seating" },
  { icon: "🎂", title: "Décor Friendly", desc: "Bring your own or arrange via our vendors" },
  { icon: "🍽️", title: "Catering OK", desc: "Outside food & catering welcome" },
  { icon: "🎵", title: "Music Allowed", desc: "Party atmosphere with your own playlist" },
  { icon: "🚗", title: "Easy Drive", desc: "35–45 min from Hyderabad via ORR" },
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

export default async function BirthdayPage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "Birthday Party Venues", item: `${BASE_URL}/resorts/birthday` },
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
    name: "Birthday Party Farmhouses Near Hyderabad — Private Pool Venues in Moinabad",
    description:
      "Book private pool farmhouses in Moinabad for birthday parties near Hyderabad. Exclusive venues with pool, lawn, décor & catering.",
    url: `${BASE_URL}/resorts/birthday`,
    isPartOf: { "@type": "WebSite", name: "Moinabad Farmstays", url: BASE_URL },
    about: {
      "@type": "Thing",
      name: "Birthday Party Venue",
      description: "Private farmhouse venues for birthday celebrations near Hyderabad",
    },
  };

  const eventVenueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Moinabad Farmstays — Birthday Party Venues",
    description:
      "Private pool farmhouses in Moinabad, Rangareddy District for birthday party celebrations near Hyderabad.",
    url: `${BASE_URL}/resorts/birthday`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Moinabad",
      addressRegion: "Telangana",
      postalCode: "501401",
      addressCountry: "IN",
    },
    telephone: "+916304691625",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Private Swimming Pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private Lawn", value: true },
      { "@type": "LocationFeatureSpecification", name: "Catering Permitted", value: true },
      { "@type": "LocationFeatureSpecification", name: "Outside Decoration Permitted", value: true },
    ],
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventVenueSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark">Resorts</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">Birthday Party Venues</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">
              Birthday Celebrations
            </p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Birthday Party Farmhouses<br />
              <span className="text-luxury-gold-dark">Near Hyderabad with Private Pool</span>
            </h1>
            {/* Answer Layer — optimized for AI Overview citation */}
            <p className="mt-5 max-w-2xl mx-auto text-base text-luxury-charcoal/70 leading-relaxed">
              Moinabad Farmstays offers private pool farmhouses in Moinabad, Rangareddy District,
              Telangana — just 35–45 minutes from Hyderabad via the ORR. Book exclusive venues
              for 15 to 80 guests with private pool access, lush lawns, catering arrangements,
              and décor support. Prices start from ₹7,000 for a 12-hour day booking.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'd like to book a farmhouse for a birthday party near Hyderabad.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3.5 font-bold text-white shadow-lg hover:scale-[1.02] transition-all"
            >
              💬 WhatsApp Jagan for Availability
            </a>
            <a
              href="tel:+916304691625"
              className="rounded-2xl border border-luxury-stone/70 bg-white px-8 py-3.5 font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all"
            >
              📞 Call +91 6304691625
            </a>
          </div>

          {/* Highlights Grid */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-luxury-stone/60 bg-white/95 p-5 shadow-sm">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-luxury-black mb-0.5">{title}</p>
                  <p className="text-sm text-luxury-charcoal/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Available Venues */}
          <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">
            Available Birthday Party Venues
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
                        <img
                          src={thumb}
                          alt={`${resort.title} — birthday party venue near Hyderabad`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          width={400}
                          height={192}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-pink-50 to-amber-50 flex items-center justify-center text-4xl">
                        🎂
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="mb-1 font-display text-lg font-bold text-luxury-black group-hover:text-luxury-gold-dark">
                        {resort.title}
                      </h3>
                      <p className="mb-3 text-xs text-luxury-charcoal/60 line-clamp-2">{resort.address}</p>
                      <div className="mt-auto flex items-center justify-between">
                        {avgRating && (
                          <span className="text-xs font-semibold text-amber-600">★ {avgRating}</span>
                        )}
                        <span className="ml-auto font-bold text-luxury-black">
                          ₹{resort.price?.toLocaleString()}
                          <span className="text-xs font-normal text-luxury-charcoal/55">/night</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-12 text-center">
              <p className="mb-4 text-luxury-charcoal/70">Contact us directly to check availability for your birthday date.</p>
              <Link href="/resorts" className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black">
                View All Farmhouses
              </Link>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-8 text-center">
              How to Book a Birthday Farmhouse
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Choose Your Venue", desc: "Browse our farmhouses and pick one that suits your group size and budget." },
                { step: "2", title: "WhatsApp Jagan", desc: "Message +91 6304691625 with your preferred date and number of guests." },
                { step: "3", title: "Confirm & Celebrate", desc: "Pay the advance, arrive on your birthday, and enjoy your private farmhouse!" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center rounded-2xl border border-luxury-stone/60 bg-white/95 p-6">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-luxury-gold to-amber-400 font-bold text-luxury-black text-lg">
                    {step}
                  </div>
                  <h3 className="mb-2 font-bold text-luxury-black">{title}</h3>
                  <p className="text-sm text-luxury-charcoal/65">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-14 rounded-3xl border border-luxury-gold/30 bg-gradient-to-br from-luxury-sand to-white p-8 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-luxury-black">
              Ready to Plan Your Birthday Celebration?
            </h2>
            <p className="mb-6 text-luxury-charcoal/70">
              Groups of 15+ get special rates. Contact Jagan for a custom birthday package in Moinabad.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="tel:+916304691625"
                className="rounded-xl border border-luxury-stone/70 bg-white px-6 py-3 text-sm font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all"
              >
                📞 +91 6304691625
              </a>
              <a
                href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'd like to book a farmhouse for a birthday party near Hyderabad. Please share availability and pricing.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] transition-all"
              >
                💬 WhatsApp for Birthday Package
              </a>
            </div>
          </div>

          {/* Internal Links */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-luxury-black mb-5">
              Explore More Farmhouse Options
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/resorts/with-pool", label: "🏊 Private Pool Farmhouses" },
                { href: "/resorts/corporate", label: "🏢 Corporate Outings" },
                { href: "/resorts/family", label: "👨‍👩‍👧 Family Farmhouses" },
                { href: "/resorts", label: "🏡 All Farmhouses" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl border border-luxury-stone/60 bg-white/95 px-4 py-3 text-sm font-medium text-luxury-charcoal hover:border-luxury-gold/50 hover:text-luxury-gold-dark transition-all text-center"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">
              Birthday Party Farmhouse — Frequently Asked Questions
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
