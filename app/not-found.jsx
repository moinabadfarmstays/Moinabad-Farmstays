/**
 * app/not-found.jsx — SEO-friendly 404 page
 * Shown for any URL that doesn't match a route.
 * Includes strong internal links to help Google understand site structure.
 */
import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Moinabad Farmstays",
  description: "The page you're looking for doesn't exist. Browse our luxury farmhouses and resorts in Moinabad near Hyderabad.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-cream px-4 text-center">
      <div className="mb-6 text-7xl font-black text-luxury-gold/30 font-display">404</div>
      <h1 className="mb-3 font-display text-3xl font-bold text-luxury-black">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-luxury-charcoal/65">
        The resort or page you&apos;re looking for doesn&apos;t exist or may have moved. Browse our collection of luxury farmhouses in Moinabad near Hyderabad.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/resorts"
          className="rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black shadow-luxury hover:scale-[1.03] transition-all"
        >
          Browse All Resorts
        </Link>
        <Link
          href="/"
          className="rounded-2xl border border-luxury-stone/70 bg-white px-8 py-3 font-bold text-luxury-charcoal hover:border-luxury-gold/50 transition-all"
        >
          Go Home
        </Link>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-luxury-charcoal/50">
        <Link href="/resorts/with-pool" className="hover:text-luxury-gold-dark transition-colors">Resorts with Pool</Link>
        <Link href="/resorts/for-events" className="hover:text-luxury-gold-dark transition-colors">Event Venues</Link>
        <Link href="/resorts/corporate" className="hover:text-luxury-gold-dark transition-colors">Corporate Outings</Link>
        <Link href="/resorts/family" className="hover:text-luxury-gold-dark transition-colors">Family Resorts</Link>
        <Link href="/blog" className="hover:text-luxury-gold-dark transition-colors">Travel Blog</Link>
      </div>
    </div>
  );
}
