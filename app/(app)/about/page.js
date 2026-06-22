import Link from "next/link";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";

export const metadata = {
  title: "About Us | Moinabad Farmstays — Luxury Farmhouses near Hyderabad",
  description:
    "Learn about Moinabad Farmstays, managed by Easy Minds Services Pvt. Ltd. Discover our story, our farmhouses in Moinabad, Telangana, and our commitment to memorable stays near Hyderabad.",
  keywords: [
    "about Moinabad Farmstays", "Easy Minds Services Pvt Ltd",
    "farmhouse management Moinabad", "Jagan Sangeri Moinabad Farmstays",
    "best farm stay in Telangana", "farm stay near Hyderabad",
  ],
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About Us | Moinabad Farmstays",
    description:
      "Managed by Easy Minds Services Pvt. Ltd. — discover the story behind Moinabad Farmstays and our luxury farmhouses near Hyderabad.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Moinabad Farmstays — about our farmhouses near Hyderabad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Moinabad Farmstays",
    description: "The story behind our luxury farmhouses in Moinabad, near Hyderabad.",
    images: [OG_IMAGE],
  },
};

const VALUES = [
  { icon: "🏡", title: "Private Farmhouses", desc: "Every property we manage is a private, exclusive farmhouse — never a shared or multi-party venue." },
  { icon: "🤝", title: "Personal Management", desc: "Each booking is personally coordinated by our team, from your first enquiry to check-out." },
  { icon: "📍", title: "Local Roots", desc: "Based in Moinabad, Rangareddy District, we know the area, the roads, and the right way to make your visit easy." },
  { icon: "✅", title: "Transparent Pricing", desc: "No hidden charges. What you see at booking is what you pay, with clear amenity listings for every farmhouse." },
];

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${BASE_URL}/about` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/about#localbusiness`,
    name: "Moinabad Farmstays",
    description:
      "Moinabad Farmstays manages a curated collection of luxury farmhouses in Moinabad, Telangana, near Hyderabad — for weekend getaways, family outings, and corporate retreats.",
    url: `${BASE_URL}/about`,
    telephone: "+916304691625",
    email: "moinabadfarmstays@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Moinabad",
      addressRegion: "Telangana",
      postalCode: "501401",
      addressCountry: "IN",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Easy Minds Services Pvt. Ltd.",
    },
    employee: {
      "@type": "Person",
      name: "Jagan Sangeri",
      jobTitle: "Resort Manager",
    },
    sameAs: [
      "https://www.instagram.com/moinabadfarmstays",
      "https://www.facebook.com/moinabadfarmstays",
    ],
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">About</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Our Story</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              About Moinabad Farmstays
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              A curated collection of luxury farmhouses in Moinabad, Telangana — built for weekend getaways, family time, and corporate offsites, 45 minutes from Hyderabad.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Story */}
          <div className="luxury-surface mb-12 rounded-3xl border border-luxury-stone/60 bg-white/95 p-8 sm:p-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-luxury-black">Who We Are</h2>
            <p className="mb-4 text-luxury-charcoal/85 leading-relaxed">
              Moinabad Farmstays is managed by <strong>Easy Minds Services Pvt. Ltd.</strong>, a Telangana-based hospitality management company. We bring together a handpicked group of private farmhouses in and around Moinabad, in Rangareddy District, and manage every aspect of the guest experience — from your first booking enquiry to the day you check out.
            </p>
            <p className="mb-4 text-luxury-charcoal/85 leading-relaxed">
              We started with a simple idea: Hyderabad residents needed a genuine escape from the city that didn&apos;t require a long drive or an expensive resort booking. Moinabad, just 35–45 minutes from Hyderabad via the Outer Ring Road, turned out to be the perfect answer — close enough for a same-day visit, far enough to feel like a different world.
            </p>
            <p className="text-luxury-charcoal/85 leading-relaxed">
              Today, our farmhouses host weekend getaways, family outings, birthday parties, corporate team retreats, and everything in between. Each property is privately owned, gated, and exclusively yours for the duration of your stay — no shared spaces, no other groups.
            </p>
          </div>

          {/* Manager */}
          <div className="luxury-surface mb-12 rounded-3xl border border-luxury-gold/30 bg-luxury-sand/60 p-8 sm:p-10">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-luxury-gold/20 text-2xl font-black text-luxury-gold-dark ring-1 ring-luxury-gold/40">
                J
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-luxury-black">Jagan Sangeri</h2>
                <p className="mb-3 text-sm font-medium text-luxury-gold-dark">Resort Manager, Moinabad Farmstays</p>
                <p className="text-luxury-charcoal/80 leading-relaxed">
                  Jagan personally oversees bookings, guest coordination, and on-ground arrangements for every farmhouse in our collection. If you call or WhatsApp us, Jagan is who you&apos;ll be speaking with — for everything from confirming dates to arranging catering for a corporate group.
                </p>
              </div>
            </div>
          </div>

          {/* Values grid */}
          <h2 className="mb-6 font-display text-2xl font-bold text-luxury-black">What We Stand For</h2>
          <div className="mb-14 grid gap-4 sm:grid-cols-2">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-luxury-black mb-0.5">{title}</p>
                  <p className="text-sm text-luxury-charcoal/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Internal links / CTA */}
          <div className="rounded-3xl border border-luxury-gold/30 bg-gradient-to-br from-luxury-sand to-white p-8 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-luxury-black">Ready to Plan Your Stay?</h2>
            <p className="mb-6 text-luxury-charcoal/70">
              Browse our farmhouses or reach out directly — we&apos;re happy to help you plan.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/resorts" className="rounded-xl bg-gradient-to-r from-luxury-gold to-amber-400 px-6 py-3 text-sm font-bold text-luxury-black hover:scale-[1.02] transition-all">
                Browse Resorts
              </Link>
              <Link href="/contact" className="rounded-xl border border-luxury-stone/70 bg-white px-6 py-3 text-sm font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
