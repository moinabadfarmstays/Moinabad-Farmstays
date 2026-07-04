import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";
import { HOME_FAQ_ITEMS } from "@/app/utils/homeFaq";
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
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-luxury-black sm:text-4xl">
            Moinabad Farmstays — Luxury Farmhouses &amp; Resorts near Hyderabad
          </h2>
          <p className="mt-4 text-base leading-relaxed text-luxury-charcoal/80">
            Welcome to <strong>Moinabad Farmstays</strong>, your trusted platform for booking
            premium farmhouses and resorts in Moinabad, Telangana. Whether you are planning a
            pool party, corporate outing, family weekend getaway, or birthday celebration, our
            curated collection of private farm stays is just 45 minutes from Hyderabad.
          </p>
        </div>

        <nav aria-label="Farmhouse categories" className="mt-10">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-luxury-gold-dark">
            Browse by occasion
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block rounded-full border border-luxury-stone/80 bg-white px-4 py-2 text-sm text-luxury-charcoal transition-colors hover:border-luxury-gold/50 hover:text-luxury-gold-dark"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {resorts.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-semibold text-luxury-black">
              Featured Farmhouses in Moinabad
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => (
                <li key={resort._id.toString()}>
                  <Link
                    href={getResortPath(resort)}
                    className="block rounded-xl border border-luxury-stone/70 bg-white/90 px-4 py-3 text-sm transition-colors hover:border-luxury-gold/40 hover:bg-luxury-sand/40"
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

        <div className="mt-14">
          <h3 className="font-display text-2xl font-semibold text-luxury-black">
            Frequently Asked Questions
          </h3>
          <dl className="mt-6 space-y-6">
            {HOME_FAQ_ITEMS.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-luxury-black">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-luxury-charcoal/80">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
