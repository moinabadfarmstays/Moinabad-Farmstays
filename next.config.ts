import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["next-auth", "@auth/core"],

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    // Serve WebP/AVIF for ~30% smaller files → faster LCP
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints matching Tailwind defaults
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift by caching image dimensions
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // ── Redirects: keep old /detail/[id] URLs alive with 301s ────────────────
  // Google will transfer all link equity to the new /resorts/[slug] URLs
  async redirects() {
    return [
      {
        source: "/detail/:id",
        destination: "/resorts/:id",   // :id works as slug fallback (API handles both)
        permanent: true,               // 301 — passes PageRank to new URL
      },
    ];
  },

  // ── Security & caching headers ────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets aggressively on Vercel Edge
        source: "/(.*\\.(?:ico|png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf)$)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // SEO-critical: tell Google the canonical host.
        // Excludes /admin and /api — those should never be indexed.
        source: "/((?!admin|api).*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large, max-snippet:-1",
          },
        ],
      },
      {
        // Block indexing of the admin dashboard and API routes
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;


