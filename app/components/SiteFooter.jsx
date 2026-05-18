import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-luxury-stone/80 bg-luxury-black text-luxury-sand">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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
              Curated luxury stays with seamless booking and attentive service.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resorts" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Resorts
                </Link>
              </li>
              <li>
                <Link href="/user/bookings" className="text-luxury-sand/90 hover:text-luxury-gold-light transition-colors">
                  Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Contact
            </h3>
            <address className="mt-4 space-y-2 text-sm text-luxury-sand/90 not-italic">
              {/* Manager */}
              <p className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold/20 text-[10px] font-black text-luxury-gold ring-1 ring-luxury-gold/30">J</span>
                <span className="font-semibold text-luxury-gold-light">Jagan Sangeri</span>
              </p>
              <p className="text-luxury-stone text-[11px] -mt-1 pl-7">Resort Manager</p>
              <p>
                <a href="tel:+916304691625" className="hover:text-luxury-gold-light transition-colors">
                  +91 6304691625
                </a>
              </p>
              <p>
                <a href="mailto:moinabadfarmstays@gmail.com" className="hover:text-luxury-gold-light transition-colors">
                  moinabadfarmstays@gmail.com
                </a>
              </p>
            </address>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-luxury-gold">
              Hours
            </h3>
            <p className="mt-4 text-sm text-luxury-sand/90">
              Concierge: 24/7
              <br />
              Reservations: 9am – 9pm IST
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-xs text-luxury-stone text-center sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Moinabad Farmstays. All rights reserved.</p>
          <p className="text-luxury-stone/60">
            Managed by{" "}
            <a href="tel:+916304691625" className="font-semibold text-luxury-gold/80 hover:text-luxury-gold-light transition-colors">
              Jagan Sangeri
            </a>
          </p>
          <Link href="/terms" className="hover:text-luxury-gold-light transition-colors">
            Terms &amp; Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
