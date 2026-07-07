import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { getResortPath } from "@/app/utils/resortUrl";

const CATEGORY_LINKS = [
  { href: "/resorts", label: "All Farmhouses in Moinabad" },
  { href: "/resorts/with-pool", label: "Farmhouses with Private Pool" },
  { href: "/resorts/for-events", label: "Event & Party Venues" },
  { href: "/resorts/birthday", label: "Birthday Party Farmhouses" },
  { href: "/resorts/corporate", label: "Corporate Outing Resorts" },
  { href: "/resorts/family", label: "Family Farm Stays" },
  { href: "/resorts/weekend", label: "Weekend Getaways near Hyderabad" },
  { href: "/blog", label: "Moinabad Travel Guide & Blog" },
];

async function getFeaturedResorts() {
  try {
    await connectToDatabase();
    return await productModel
      .find({ available: true })
      .select("title slug _id address")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(12)
      .lean();
  } catch {
    return [];
  }
}

export default async function HomeSeoSection() {
  const resorts = await getFeaturedResorts();

  return (
    <section
      aria-label="About Moinabad Farmstays"
      className="border-t border-luxury-stone/60 bg-luxury-cream"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-fade-up">
          <span className="luxury-accent-line" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            Moinabad Farmstays — Luxury Farmhouses &amp; Resorts near Hyderabad
          </h2>
        </div>

        <nav aria-label="Farmhouse categories" className="mt-10 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-luxury-gold-dark">
            Browse by occasion
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_LINKS.map(({ href, label }, i) => (
              <li
                key={href}
                className="animate-fade-up"
                style={{ animationDelay: `${120 + i * 50}ms` }}
              >
                <Link
                  href={href}
                  className="inline-block rounded-full border border-luxury-stone/80 bg-white px-4 py-2 text-sm text-luxury-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:border-luxury-gold/50 hover:bg-luxury-sand/50 hover:text-luxury-gold-dark hover:shadow-gold-glow"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {resorts.length > 0 && (
          <div className="mt-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h3 className="font-display text-2xl font-semibold text-luxury-black">
              Featured Farmhouses in Moinabad
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort, i) => (
                <li
                  key={resort._id.toString()}
                  className="animate-fade-up"
                  style={{ animationDelay: `${240 + i * 60}ms` }}
                >
                  <Link
                    href={getResortPath(resort)}
                    className="block rounded-xl border border-luxury-stone/70 bg-white/90 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-luxury-gold/40 hover:bg-luxury-sand/40 hover:shadow-card-hover"
                  >
                    <span className="font-semibold text-luxury-black">{resort.title}</span>
                    {resort.address && (
                      <span className="mt-0.5 block text-luxury-charcoal/60">{resort.address}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
