/**
 * app/(app)/resorts/corporate/page.js
 * Target: "corporate outing farmhouse Hyderabad", "team outing resort near Hyderabad"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  title: "Corporate Event Farmhouses in Hyderabad & Moinabad",
  description:
    "Book premium farmhouses and resorts for corporate team outings and events near Hyderabad. Private venues in Moinabad with lawns, pools, and catering.",
  keywords: [
    "corporate outing farmhouse Hyderabad", "team outing resort near Hyderabad",
    "corporate team outing Moinabad", "office outing resort Hyderabad",
    "team building venue Telangana", "corporate offsite farmhouse Hyderabad",
  ],
  alternates: { canonical: `${BASE_URL}/resorts/corporate` },
  openGraph: {
    title: "Corporate Event Farmhouses in Hyderabad & Moinabad",
    description: "Private farmhouses in Moinabad for corporate offsites and team outings.",
    url: `${BASE_URL}/resorts/corporate`,
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

const BENEFITS = [
  { icon: "🏡", title: "Private Venue", desc: "Exclusive farmhouse for your team — no shared spaces" },
  { icon: "🏊", title: "Recreation", desc: "Pools, lawns and outdoor activities for team bonding" },
  { icon: "🚗", title: "Easy Access", desc: "45 min from Hyderabad via ORR — no long travel" },
  { icon: "🍽️", title: "Catering", desc: "Arrange group meals and BBQ for your team" },
  { icon: "📶", title: "WiFi Available", desc: "Stay connected with high-speed internet" },
  { icon: "💰", title: "Group Pricing", desc: "Custom rates for large corporate groups" },
];

export default async function CorporatePage() {
  const resorts = await getAllResorts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Resorts", item: `${BASE_URL}/resorts` },
      { "@type": "ListItem", position: 3, name: "Corporate Outings", item: `${BASE_URL}/resorts/corporate` },
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
              <li className="text-luxury-charcoal/80 font-medium">Corporate Outings</li>
            </ol>
          </nav>

          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">Corporate & Teams</p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Corporate Team Outing<br />
              <span className="text-luxury-gold-dark">Farmhouses near Hyderabad</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-luxury-charcoal/70">
              Productive offsite. Private farmhouse. 45 minutes from Hyderabad. Perfect for team building, strategy sessions, and celebrations.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Benefits grid */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-luxury-stone/60 bg-white/95 p-5">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-luxury-black mb-0.5">{title}</p>
                  <p className="text-sm text-luxury-charcoal/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resorts */}
          <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Available Venues</h2>
          {resorts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => {
                const thumb = resort.profileImages?.[0] || resort.images?.[0];
                return (
                  <Link key={resort._id} href={`/resorts/${resort.slug || resort._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white/95 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                    {thumb
                      ? <div className="h-44 overflow-hidden"><img src={thumb} alt={`${resort.title} — corporate outing venue Moinabad`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                      : <div className="h-44 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center text-4xl">🏢</div>
                    }
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-luxury-black group-hover:text-luxury-gold-dark mb-1">{resort.title}</h3>
                      <p className="text-xs text-luxury-charcoal/60 mb-3">{resort.address}</p>
                      <p className="font-bold text-luxury-black text-sm">₹{resort.price?.toLocaleString()}<span className="text-xs font-normal text-luxury-charcoal/55">/night</span></p>
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

          {/* Contact */}
          <div className="mt-14 rounded-3xl border border-luxury-gold/30 bg-luxury-sand/60 p-8 text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-luxury-black">Get a Corporate Quote</h2>
            <p className="mb-6 text-luxury-charcoal/70">Groups of 15+ get special pricing. Contact Jagan for a custom proposal.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="tel:+916304691625" className="rounded-xl border border-luxury-stone/70 bg-white px-6 py-3 text-sm font-bold hover:border-luxury-gold/50 transition-all">📞 +91 6304691625</a>
              <a href={`https://wa.me/916304691625?text=${encodeURIComponent("Hi Jagan, I'd like to book a farmhouse for a corporate team outing near Hyderabad.")}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] transition-all">💬 WhatsApp</a>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 space-y-4">
            <h2 className="font-display text-2xl font-bold text-luxury-black mb-6">Corporate Outing FAQ</h2>
            {[
              { q: "How many people can these farmhouses accommodate for corporate outings?", a: "Our Moinabad farmhouses can accommodate teams of 10 to 100+ people. Larger groups may book multiple properties. Contact us for group arrangements." },
              { q: "Are Moinabad farmhouses good for corporate team building?", a: "Yes! The private lawns, pools, and serene environment of Moinabad farmhouses make them ideal for team building activities, strategy sessions, and corporate celebrations." },
              { q: "What is the distance from Hyderabad tech parks to Moinabad?", a: "Moinabad is approximately 35–50 minutes from Hitech City, Gachibowli, and Kondapur via the ORR. It's one of the closest nature retreats for Hyderabad IT teams." },
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
