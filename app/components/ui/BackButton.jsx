"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton — Premium reusable back button.
 *
 * Props:
 *  - href  — if provided, renders a <Link> (navigation back to a fixed route)
 *  - label — button text (default "Go Back")
 *  - className — extra classes
 *
 * If href is NOT provided, it calls router.back().
 */
export default function BackButton({ href, label = "Go Back", className = "" }) {
  const router = useRouter();

  const inner = (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-luxury-gold/20 ring-1 ring-luxury-gold/40 transition-all duration-300 group-hover:bg-luxury-gold group-hover:ring-luxury-gold/80 group-hover:scale-110">
        <ArrowLeft className="h-4 w-4 text-luxury-gold-dark transition-colors duration-300 group-hover:text-luxury-black" />
      </span>
      <span className="font-semibold text-luxury-charcoal transition-colors duration-300 group-hover:text-luxury-black">
        {label}
      </span>
    </span>
  );

  const base = `group inline-flex items-center gap-2 rounded-2xl border border-luxury-stone/60 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-luxury-gold/50 hover:bg-luxury-sand hover:shadow-md active:scale-95 ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={base}>
      {inner}
    </button>
  );
}
