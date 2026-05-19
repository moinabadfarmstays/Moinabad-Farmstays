/**
 * app/(app)/resorts/with-pool/page.js
 * Target: "farmhouse with pool Moinabad", "resort with swimming pool near Hyderabad"
 */
import { Suspense } from "react";
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  title: "Farmhouses with Swimming Pool in Moinabad | Moinabad Farmstays",
  description:
    "Book luxury farmhouses with private swimming pools in Moinabad near Hyderabad. Perfect for families, couples, and group getaways. Check availability and book directly.",
  keywords: [
    "farmhouse with pool Moinabad", "resort with swimming pool near Hyderabad",
    "private pool farmhouse Telangana", "pool resort Moinabad",
    "luxury pool resort near Hyderabad", "swimming pool farmhouse Hyderabad",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/with-pool` },
  openGraph: {
    title: "Farmhouses with Swimming Pool in Moinabad",
    description: "Luxury pool farmhouses in Moinabad near Hyderabad. Book directly for best rates.",
    url: `${BASE_URL}/resorts/with-pool`,
    type: "website",
  },
};

async function getPoolResorts() {
  try {
    await connectToDatabase();
    const POOL_KEYWORDS = ["pool", "Pool", "swimming", "Swimming"];
    return await productModel
      .find({
        available: true,
        amen: { $in: POOL_KEYWORDS },
      })
      .select("title slug _id address price profileImages images amen reviews")
      .sort({ isFeatured: -1 })
      .lean();
  } catch {
    return [];
  }
}

export default async function WithPoolPage() {
  const resorts = await getPoolResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "With Pool", item: `${BASE_URL}/resorts/with-pool` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Farmhouses with Swimming Pool in Moinabad",
    description: "Luxury farmhouses with private swimming pools in Moinabad near Hyderabad",
    url: `${BASE_URL}/resorts/with-pool`,
    numberOfItems: resorts.length,
    itemListElement: resorts.map((r, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: r.title,
      url: `${BASE_URL}/resorts/${r.slug || r._id}`,
      image: r.profileImages?.[0] || r.images?.[0],
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark">Resorts</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">With Pool</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Pool Resorts</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Farmhouses with Swimming Pool<br />
              <span className="text-luxury-gold-dark">in Moinabad</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              Dive into luxury. Private swimming pools, spacious lawns, and serene surroundings — just 45 minutes from Hyderabad.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Resort grid or fallback */}
          {resorts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => {
                const avgRating = resort.reviews?.length
                  ? (resort.reviews.reduce((s, r) => s + r.rating, 0) / resort.reviews.length).toFixed(1)
                  : null;
                const thumb = resort.profileImages?.[0] || resort.images?.[0];
                return (
                  <Link
                    key={resort._id}
                    href={`/resorts/${resort.slug || resort._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1"
                  >
                    {thumb ? (
                      <div className="relative h-48 overflow-hidden bg-luxury-sand">
                        <img src={thumb} alt={`${resort.title} — pool farmhouse in Moinabad`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center text-4xl">🏊</div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="mb-1 font-display text-lg font-bold text-luxury-black group-hover:text-luxury-gold-dark">{resort.title}</h2>
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
            <div className="text-center py-16">
              <p className="text-luxury-charcoal/60 mb-6">Pool resorts are being added. Browse all resorts in the meantime.</p>
              <Link href="/resorts" className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black">View All Resorts</Link>
            </div>
          )}

          {/* FAQ section — triggers FAQ rich snippets */}
          <div className="mt-16 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Frequently Asked Questions</h2>
            {[
              { q: "Do all Moinabad farmhouses have private pools?", a: "Not all, but several of our Moinabad farmhouses feature private swimming pools exclusively for your group. These are listed on this page." },
              { q: "Can I book a pool farmhouse for a day outing?", a: "Yes! We offer 12-hour day packages and 24-hour overnight stays at our pool farmhouses near Hyderabad." },
              { q: "How far are the pool resorts from Hyderabad?", a: "Our Moinabad pool farmhouses are 35–45 minutes from Hyderabad via the ORR, making them ideal for same-day outings." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <h3 className="font-bold text-luxury-black mb-2">{q}</h3>
                <p className="text-sm text-luxury-charcoal/70">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
