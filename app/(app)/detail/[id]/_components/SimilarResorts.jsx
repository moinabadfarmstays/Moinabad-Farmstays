// app/(app)/detail/[id]/_components/SimilarResorts.jsx
"use client";
import Image from "next/image";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function averageRating(reviews) {
  if (!reviews?.length) return null;
  const sum = reviews.reduce((a, r) => a + (r.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SimilarResorts({ resorts }) {
  const router = useRouter();
  if (!resorts?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12"
    >
      {/* ── Header ── */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-luxury-gold-dark/80">
            You may also like
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold text-luxury-black sm:text-3xl">
            Similar Resorts Nearby
          </h2>
        </div>
        <button
          type="button"
          onClick={() => router.push("/resorts")}
          className="group hidden items-center gap-1.5 rounded-full border border-luxury-stone bg-white/90 px-4 py-2 text-sm font-medium text-luxury-charcoal shadow-sm transition-all hover:border-luxury-gold/50 hover:bg-luxury-sand sm:inline-flex"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ── Horizontal scroll strip ── */}
      <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
        {resorts.map((resort, i) => {
          const thumb =
            resort.profileImages?.[0] ||
            resort.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945";
          const isBooked =
            resort.available === false ||
            (resort.bookings && resort.bookings.length > 0);
          const avg = averageRating(resort.reviews);

          return (
            <motion.button
              key={resort._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              type="button"
              onClick={() => router.push(`/detail/${resort._id}`)}
              className="group snap-start flex-shrink-0 w-64 sm:w-72 overflow-hidden rounded-2xl border border-luxury-stone/70 bg-white shadow-glass text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-luxury hover:border-luxury-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-luxury-charcoal">
                <Image
                  src={thumb}
                  alt={resort.title}
                  fill
                  sizes="(max-width: 640px) 256px, 288px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent" />

                {/* Availability badge */}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-md backdrop-blur-sm ${
                    isBooked
                      ? "bg-red-600/90 text-white"
                      : "bg-emerald-500/90 text-white"
                  }`}
                >
                  {isBooked ? "Booked" : "Available"}
                </span>

                {/* Rating badge */}
                {avg && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-luxury-black/70 px-2.5 py-1 text-xs font-semibold text-yellow-300 backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {avg}
                  </span>
                )}

                {/* Price overlay bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-base font-bold text-white drop-shadow">
                    ₹{resort.price?.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-white/70">
                      /night
                    </span>
                  </p>
                </div>
              </div>

              {/* Info panel */}
              <div className="px-4 py-4">
                <h3 className="mb-1.5 line-clamp-1 font-display text-base font-semibold text-luxury-black group-hover:text-luxury-gold-dark transition-colors duration-200">
                  {resort.title}
                </h3>

                <div className="mb-3 flex items-center gap-1 text-xs text-luxury-charcoal/60">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-luxury-gold-dark" />
                  <span className="line-clamp-1">{resort.address}</span>
                </div>

                {/* Amenity chips */}
                {resort.amen?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resort.amen.slice(0, 3).map((a, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-luxury-sand px-2 py-0.5 text-[10px] font-medium text-luxury-charcoal"
                      >
                        {a}
                      </span>
                    ))}
                    {resort.amen.length > 3 && (
                      <span className="rounded-full bg-luxury-stone/60 px-2 py-0.5 text-[10px] text-luxury-charcoal/60">
                        +{resort.amen.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile "View all" link */}
      <div className="mt-5 flex justify-center sm:hidden">
        <button
          type="button"
          onClick={() => router.push("/resorts")}
          className="group inline-flex items-center gap-1.5 rounded-full border border-luxury-stone bg-white/90 px-5 py-2.5 text-sm font-medium text-luxury-charcoal shadow-sm transition-all hover:border-luxury-gold/50 hover:bg-luxury-sand"
        >
          View all resorts
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.section>
  );
}
