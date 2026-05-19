import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const OG_IMAGE = "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg";
const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Moinabad Farmstays | Luxury Resorts & Farmhouses near Hyderabad",
    template: "%s | Moinabad Farmstays",
  },

  description:
    "Book luxury farmhouses and resorts in Moinabad near Hyderabad. Premium farm stays in Telangana for weekend getaways, family outings, and corporate retreats. Direct booking, best prices.",

  keywords: [
    // Primary targets
    "Moinabad resorts",
    "resorts in Moinabad",
    "farmhouse in Moinabad",
    "farm house in Moinabad",
    "Moinabad farm stays",
    // Secondary
    "luxury resorts near Hyderabad",
    "farm stay near Hyderabad",
    "weekend getaway Telangana",
    "farmhouse near Hyderabad",
    "family resort Hyderabad",
    // Long-tail
    "farmhouse with pool Moinabad",
    "day outing near Hyderabad",
    "resort for corporate outing Hyderabad",
    "birthday party venue Moinabad",
    "Moinabad Farmstays",
    "luxury farmhouse Rangareddy",
  ],

  authors: [{ name: "Moinabad Farmstays", url: BASE_URL }],
  creator: "Moinabad Farmstays",
  publisher: "Moinabad Farmstays",
  category: "Travel & Hospitality",

  openGraph: {
    title: "Moinabad Farmstays | Luxury Resorts & Farmhouses near Hyderabad",
    description:
      "Book premium farmhouses and resorts in Moinabad, Telangana. Weekend getaways, family stays, and corporate retreats — 45 minutes from Hyderabad.",
    url: BASE_URL,
    siteName: "Moinabad Farmstays",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Moinabad Farmstays — Luxury Farmhouses near Hyderabad, Telangana",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Moinabad Farmstays | Luxury Farmhouses near Hyderabad",
    description: "Premium farm stays in Moinabad, Telangana. Book your perfect weekend getaway.",
    images: [OG_IMAGE],
    creator: "@moinabadfarmstays",
    site: "@moinabadfarmstays",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "7p4ybX1dhk7JGjOmXniWgJhssAGKW0LPZKgze3bCwck",
  },

  alternates: {
    canonical: BASE_URL,
  },
};

// ── Global JSON-LD: Organization + WebSite (SearchAction) ─────────────────────
// Injected on every page — tells Google who we are as a business entity
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Moinabad Farmstays",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.jpg`,
    width: 512,
    height: 512,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+916304691625",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Moinabad",
    addressRegion: "Telangana",
    postalCode: "501401",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/moinabadfarmstays",
    "https://www.facebook.com/moinabadfarmstays",
    "https://g.page/moinabadfarmstays",
  ],
};

// WebSite schema with SearchAction — enables Google Sitelinks Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Moinabad Farmstays",
  description: "Luxury farmhouses and resorts in Moinabad near Hyderabad",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/resorts?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-IN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Preconnect to Cloudinary CDN for faster image loads */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Global structured data — present on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
