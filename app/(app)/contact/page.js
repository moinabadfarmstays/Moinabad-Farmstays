import Link from "next/link";
import SiteLayout from "@/app/components/layout/SiteLayout";

const BASE_URL = "https://www.moinabadfarmstays.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";
const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Moinabad,+Telangana+501401&output=embed";
const MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Moinabad+Farmstays+Moinabad+Telangana";

export const metadata = {
  title: "Contact Us | Moinabad Farmstays — Book Your Farmhouse near Hyderabad",
  description:
    "Get in touch with Moinabad Farmstays for bookings, group rates, and farmhouse availability in Moinabad, Telangana. Call, WhatsApp, or email — 45 minutes from Hyderabad.",
  keywords: [
    "contact Moinabad Farmstays", "book farmhouse Moinabad",
    "Moinabad Farmstays phone number", "Moinabad Farmstays address",
    "farm stay booking Hyderabad", "resort near Moinabad contact",
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact Us | Moinabad Farmstays",
    description:
      "Reach Moinabad Farmstays for bookings and enquiries — farmhouses near Hyderabad, Telangana.",
    url: `${BASE_URL}/contact`,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Contact Moinabad Farmstays" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Moinabad Farmstays",
    description: "Reach us for bookings and enquiries — farmhouses near Hyderabad.",
    images: [OG_IMAGE],
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE_URL}/contact` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/contact#localbusiness`,
    name: "Moinabad Farmstays",
    description:
      "Luxury farmhouses and resorts in Moinabad near Hyderabad, Telangana. Book directly for weekend getaways, family outings, and corporate retreats.",
    url: `${BASE_URL}/contact`,
    telephone: "+916304691625",
    email: "moinabadfarmstays@gmail.com",
    image: OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Moinabad",
      addressRegion: "Telangana",
      postalCode: "501401",
      addressCountry: "IN",
    },
    hasMap: MAPS_LINK,
    openingHours: ["Mo-Su 09:00-21:00"],
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
              <li className="text-luxury-charcoal/80 font-medium">Contact</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Get In Touch</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Contact Moinabad Farmstays
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              Questions about availability, pricing, or group bookings? Reach out directly — we typically respond within a few hours.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* NAP + CTAs */}
            <div className="luxury-surface rounded-3xl border border-luxury-stone/60 bg-white/95 p-8">
              <h2 className="mb-5 font-display text-xl font-bold text-luxury-black">Reach Us Directly</h2>

              <address className="space-y-4 not-italic text-luxury-charcoal/85">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-luxury-gold/15 text-sm font-black text-luxury-gold-dark ring-1 ring-luxury-gold/30">J</span>
                  <div>
                    <p className="font-semibold text-luxury-black">Jagan Sangeri</p>
                    <p className="text-xs text-luxury-charcoal/55">Resort Manager</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/50">Phone</p>
                  <a href="tel:+916304691625" className="text-lg font-semibold text-luxury-black hover:text-luxury-gold-dark transition-colors">
                    +91 6304691625
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/50">Email</p>
                  <a href="mailto:moinabadfarmstays@gmail.com" className="text-lg font-semibold text-luxury-black hover:text-luxury-gold-dark transition-colors break-all">
                    moinabadfarmstays@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/50">Address</p>
                  <p className="text-luxury-charcoal/85">
                    Moinabad, Rangareddy District<br />
                    Telangana — 501401, India
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/50">Hours</p>
                  <p className="text-luxury-charcoal/85">Daily, 9:00 AM – 9:00 PM IST</p>
                </div>
              </address>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'd like to enquire about booking a farmhouse at Moinabad Farmstays.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-center text-sm font-bold text-white hover:scale-[1.02] transition-all"
                >
                  💬 WhatsApp Us
                </a>
                <a
                  href="tel:+916304691625"
                  className="flex-1 rounded-xl border border-luxury-stone/70 bg-white px-6 py-3 text-center text-sm font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all"
                >
                  📞 Call Now
                </a>
              </div>
            </div>

            {/* Map embed */}
            <div className="luxury-surface overflow-hidden rounded-3xl border border-luxury-stone/60 bg-white/95">
              <iframe
                title="Moinabad Farmstays location map"
                src={MAPS_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ minHeight: "360px", border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-luxury-gold-dark hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Internal links */}
          <div className="mt-14 text-center">
            <p className="mb-4 text-luxury-charcoal/70">Prefer to browse first?</p>
            <Link href="/resorts" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black shadow-luxury hover:scale-[1.03] transition-all">
              Browse All Resorts →
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
