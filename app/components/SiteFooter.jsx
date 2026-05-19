import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-luxury-stone/80 bg-luxury-black text-luxury-sand">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-gold/20 ring-1 ring-luxury-gold/40">
                <Sparkles className="h-5 w-5 text-luxury-gold-light" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                Moinabad Farmstays
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-luxury-stone">
              Luxury farmhouses &amp; resorts in Moinabad, 45 minutes from Hyderabad.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/moinabadfarmstays" target="_blank" rel="noopener noreferrer" className="text-luxury-stone hover:text-luxury-gold-light transition-colors text-sm">Instagram</a>
              <span className="text-luxury-stone/40">·</span>
              <a href="https://www.facebook.com/moinabadfarmstays" target="_blank" rel="noopener noreferrer" className="text-luxury-stone hover:text-luxury-gold-light transition-colors text-sm">Facebook</a>
            </div>
          </div>

          {/* Explore — internal links to all pages (SEO internal linking) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Home</Link></li>
              <li><Link href="/resorts" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">All Resorts</Link></li>
              <li><Link href="/resorts/with-pool" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Resorts with Pool</Link></li>
              <li><Link href="/resorts/for-events" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Event Venues</Link></li>
              <li><Link href="/resorts/corporate" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Corporate Outings</Link></li>
              <li><Link href="/resorts/family" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Family Resorts</Link></li>
              <li><Link href="/blog" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">Travel Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Contact</h3>
            <address className="mt-4 space-y-2 text-sm text-luxury-sand/90 not-italic">
              <p className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold/20 text-[10px] font-black text-luxury-gold ring-1 ring-luxury-gold/30">J</span>
                <span className="font-semibold text-luxury-gold-light">Jagan Sangeri</span>
              </p>
              <p className="text-luxury-stone text-[11px] -mt-1 pl-7">Resort Manager · Moinabad</p>
              <p><a href="tel:+916304691625" className="hover:text-luxury-gold-light transition-colors">+91 6304691625</a></p>
              <p><a href="mailto:moinabadfarmstays@gmail.com" className="hover:text-luxury-gold-light transition-colors">moinabadfarmstays@gmail.com</a></p>
              <p className="text-luxury-stone text-xs pt-1">Moinabad, Rangareddy Dist.<br />Telangana — 501401</p>
            </address>
          </div>

          {/* Hours + Quick Book */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">Hours</h3>
            <p className="mt-4 text-sm text-luxury-sand/90">
              Concierge: 24/7<br />
              Reservations: 9am – 9pm IST
            </p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold mb-3">Quick Book</p>
              <a
                href="https://wa.me/916304691625?text=Hi, I'd like to book a farmhouse at Moinabad Farmstays."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-xs font-bold text-white hover:scale-[1.03] transition-all"
              >
                💬 WhatsApp to Book
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-xs text-luxury-stone text-center sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Moinabad Farmstays. All rights reserved.</p>
          <p className="text-luxury-stone/60">
            Managed by{" "}
            <a href="tel:+916304691625" className="font-semibold text-luxury-gold/80 hover:text-luxury-gold-light transition-colors">Jagan Sangeri</a>
          </p>
          <Link href="/terms" className="hover:text-luxury-gold-light transition-colors">Terms &amp; Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
