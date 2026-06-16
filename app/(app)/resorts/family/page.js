/**
 * app/(app)/resorts/family/page.js
 * Target: "family resort near Hyderabad", "family farmhouse Moinabad", "family outing near Hyderabad"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  title: "Family Farmhouses in Moinabad | Weekend Getaways",
  description:
    "Plan the perfect family weekend getaway near Hyderabad. Spacious farmhouses in Moinabad with pools, lawns, and safe, kid-friendly amenities.",
  keywords: [
    "family resort near Hyderabad", "family farmhouse Moinabad",
    "family outing near Hyderabad", "family trip Moinabad",
    "farmhouse for families Telangana", "kids friendly resort Hyderabad",
    "weekend getaway family Hyderabad",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/family` },
  openGraph: {
    title: "Family Farmhouses in Moinabad | Weekend Getaways",
    description: "Spacious family farmhouses in Moinabad near Hyderabad with pools and lawns.",
    url: `${BASE_URL}/resorts/family`,
    type: "website",
  },
};

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

const FAMILY_HIGHLIGHTS = [
  { icon: "🏡", text: "Private, exclusive farmhouses" },
  { icon: "🏊", text: "Swimming pools for all ages" },
  { icon: "🌿", text: "Spacious lawns & open spaces" },
  { icon: "🔒", text: "Safe, gated properties" },
  { icon: "🚗", text: "45 min from Hyderabad" },
  { icon: "🍳", text: "Kitchen & BBQ facilities" },
];

export default async function FamilyPage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "Family Resorts", item: `${BASE_URL}/resorts/family` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/resorts" className="hover:text-luxury-gold-dark">Resorts</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 font-medium">Family Resorts</li>
            </ol>
          </nav>

          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Family Getaways</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Family Resorts & Farmhouses<br />
              <span className="text-luxury-gold-dark">near Hyderabad</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              Create memories with your family. Private pools, open lawns, and a peaceful escape from city life — all within 45 minutes of Hyderabad.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Highlights */}
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FAMILY_HIGHLIGHTS.map(({ icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2 rounded-2xl border border-luxury-stone/60 bg-white/95 p-4 text-center">
                <span className="text-2xl">{icon}</span>
                <p className="text-xs font-medium text-luxury-charcoal/80">{text}</p>
              </div>
            ))}
          </div>

          {/* Resorts */}
          <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Family-Friendly Farmhouses</h2>
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
                      ? <div className="h-44 overflow-hidden"><img src={thumb} alt={`${resort.title} — family resort near Hyderabad`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                      : <div className="h-44 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl">👨‍👩‍👧</div>
                    }
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-luxury-black group-hover:text-luxury-gold-dark mb-1">{resort.title}</h3>
                      <p className="text-xs text-luxury-charcoal/60 mb-2">{resort.address}</p>
                      {resort.amen?.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {resort.amen.slice(0, 3).map((a) => (
                            <span key={a} className="rounded-full bg-luxury-sand px-2 py-0.5 text-[10px] font-medium text-luxury-charcoal">{a}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        {avgRating && <span className="text-xs font-semibold text-amber-600">★ {avgRating}</span>}
                        <span className="ml-auto font-bold text-luxury-black text-sm">₹{resort.price?.toLocaleString()}<span className="text-xs font-normal text-luxury-charcoal/55">/night</span></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Link href="/resorts" className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black">View All Resorts</Link>
            </div>
          )}

          {/* FAQ */}
          <div className="mt-14 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Family Outing FAQ</h2>
            {[
              { q: "Are Moinabad farmhouses safe for families with children?", a: "Yes. All our Moinabad farmhouses are private, gated properties, making them safe and secure for families with children. Pools are supervised and enclosed." },
              { q: "What is the best time for a family outing to Moinabad?", a: "October to March is the ideal season for a family trip to Moinabad due to pleasant weather. Weekday bookings are more affordable and less crowded." },
              { q: "Can families with elderly members visit Moinabad farmhouses?", a: "Absolutely. Our farmhouses are accessible, with ground-floor rooms and sitting areas. Please mention any special requirements when booking so we can accommodate everyone." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <h3 className="font-bold text-luxury-black mb-2">{q}</h3>
                <p className="text-sm text-luxury-charcoal/70">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/resorts" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black shadow-luxury hover:scale-[1.03] transition-all">
              Browse All Resorts →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
