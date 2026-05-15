import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.moinabadfarmstays.com"),
  title: {
    default: "Moinabad Farmstays | Luxury Farmhouse near Hyderabad",
    template: "%s | Moinabad Farmstays",
  },
  description: "Experience the best Moinabad Farm Stays. Book luxury farmhouses near Hyderabad for weekend getaways, family resorts, and serene retreats in Telangana.",
  keywords: ["Moinabad Farm Stays", "farmhouse near Hyderabad", "weekend getaway Telangana", "luxury farmhouse", "resort in Moinabad", "family resort Hyderabad"],
  openGraph: {
    title: "Moinabad Farmstays | Luxury Farmhouse near Hyderabad",
    description: "Book luxury farmhouses near Hyderabad for weekend getaways and serene retreats in Telangana.",
    url: "/",
    siteName: "Moinabad Farmstays",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg",
        width: 1200,
        height: 630,
        alt: "Moinabad Farmstays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moinabad Farmstays",
    description: "Book luxury farmhouses near Hyderabad for weekend getaways.",
    images: ["https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg"],
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
    canonical: "/",
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
