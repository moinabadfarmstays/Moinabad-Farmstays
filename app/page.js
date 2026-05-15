import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import SiteLayout from "./components/layout/SiteLayout";
import HomeWithHero from "./components/HomeWithHero";

export const metadata = {
  title: "Moinabad Farmstays | Best Farmhouse near Hyderabad",
  description: "Find the perfect farmhouse near Hyderabad for your weekend getaway in Telangana. Book luxury Moinabad Farm Stays with premium amenities.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    redirect("/admin");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Moinabad Farmstays",
    "description": "Find the perfect luxury farmhouse near Hyderabad for your weekend getaway in Telangana. Discover premium Moinabad Farm Stays.",
    "url": "https://www.moinabadfarmstays.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Moinabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "telephone": "+916304691625",
    "email": "moinabadfarmstays@gmail.com",
    "image": "https://res.cloudinary.com/dstypxe4o/image/upload/q_auto/f_auto/v1776322013/WhatsApp_Image_2026-04-16_at_12.13.51_PM_tystat.jpg",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteLayout>
        <HomeWithHero />
      </SiteLayout>
    </>
  );
}
