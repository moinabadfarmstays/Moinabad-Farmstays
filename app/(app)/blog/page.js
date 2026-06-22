/**
 * app/(app)/blog/page.js — Blog index page
 * Target keywords: "Moinabad resort guide", "farmhouse near Hyderabad tips", "weekend getaway Hyderabad blog"
 */
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import blogModel from "@/app/utils/models/blogModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

export const metadata = {
  title: "Blog | Farmhouse & Resort Travel Guide — Moinabad near Hyderabad",
  description:
    "Discover travel tips, resort guides, and weekend getaway ideas for Moinabad and Hyderabad. Expert advice on farm stays, day outings, and luxury farmhouse bookings in Telangana.",
  keywords: [
    "Moinabad resort guide", "farmhouse near Hyderabad tips",
    "weekend getaway Hyderabad blog", "farm stay Telangana",
    "day outing Hyderabad ideas", "Moinabad travel guide",
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Blog | Moinabad Farmstays Travel Guide",
    description: "Farmhouse travel tips and resort guides for Moinabad near Hyderabad.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

async function getPosts() {
  try {
    await connectToDatabase();
    return await blogModel
      .find({ published: true })
      .select("title slug excerpt coverImage tags readingTime createdAt")
      .sort({ createdAt: -1 })
      .lean();
  } catch {
    return [];
  }
}

// Placeholder posts shown before any real posts are created via admin
const PLACEHOLDER_POSTS = [
  {
    slug: "farmhouses-in-moinabad-complete-guide",
    title: "10 Best Farmhouses in Moinabad for a Perfect Weekend (2026)",
    excerpt: "Discover the top-rated farmhouses in Moinabad near Hyderabad — with pools, lawns, and premium amenities for families, couples, and corporate groups.",
    tags: ["Moinabad", "Farmhouse", "Weekend Getaway"],
    readingTime: 8,
  },
  {
    slug: "farm-stay-near-hyderabad-guide",
    title: "Farm Stay Near Hyderabad: The Complete 2026 Guide",
    excerpt: "Everything you need to know about booking a farm stay near Hyderabad — best areas, pricing, what to expect, and how to get the best deals.",
    tags: ["Hyderabad", "Farm Stay", "Guide"],
    readingTime: 10,
  },
  {
    slug: "day-outing-near-hyderabad-farms",
    title: "Day Outing from Hyderabad: Top 5 Farm Stays Under 50km",
    excerpt: "Planning a one-day outing near Hyderabad? These farm stays are under 50km away and perfect for families, couples, and groups.",
    tags: ["Day Outing", "Hyderabad", "Farm Stay"],
    readingTime: 6,
  },
  {
    slug: "birthday-party-venue-moinabad-pool",
    title: "Birthday Party Venues in Moinabad with Private Pool",
    excerpt: "Make your birthday celebration unforgettable with these private pool farmhouses in Moinabad — ideal for intimate parties and group celebrations.",
    tags: ["Birthday Party", "Moinabad", "Pool"],
    readingTime: 5,
  },
  {
    slug: "corporate-outing-farmhouse-hyderabad",
    title: "Corporate Team Outing Farmhouses Near Hyderabad",
    excerpt: "Planning a corporate team outing near Hyderabad? These Moinabad farmhouses offer the perfect blend of recreation and relaxation for teams of all sizes.",
    tags: ["Corporate Outing", "Hyderabad", "Team Building"],
    readingTime: 7,
  },
  {
    slug: "couples-resort-near-hyderabad-romantic",
    title: "Romantic Resorts Near Hyderabad for Couples",
    excerpt: "Escape the city and reconnect with these handpicked romantic farmhouses and resorts near Hyderabad, perfect for anniversaries and special occasions.",
    tags: ["Couples", "Romantic", "Hyderabad"],
    readingTime: 6,
  },
];

// Blog post card
function PostCard({ post, isPlaceholder = false }) {
  const href = isPlaceholder ? "/resorts" : `/blog/${post.slug}`;
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <article className="group flex flex-col rounded-2xl border border-luxury-stone/70 bg-white/95 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
      {/* Cover image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-luxury-sand via-luxury-gold/10 to-luxury-cream flex items-center justify-center">
        <span className="text-4xl">🌿</span>
        {isPlaceholder && (
          <span className="absolute right-3 top-3 rounded-full bg-luxury-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-luxury-gold-light">
            Coming Soon
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-luxury-gold/10 border border-luxury-gold/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-luxury-gold-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="mb-2 font-display text-lg font-bold text-luxury-black leading-snug group-hover:text-luxury-gold-dark transition-colors">
          {isPlaceholder ? (
            <span>{post.title}</span>
          ) : (
            <Link href={href}>{post.title}</Link>
          )}
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-luxury-charcoal/70 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-luxury-charcoal/45">
          {date && <span>{date}</span>}
          <span>{post.readingTime} min read</span>
        </div>

        {isPlaceholder && (
          <Link
            href={href}
            className="mt-4 text-sm font-semibold text-luxury-gold-dark hover:underline"
          >
            Browse resorts in the meantime →
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const displayPosts = posts.length > 0 ? posts : PLACEHOLDER_POSTS;
  const isPlaceholder = posts.length === 0;

  // Blog list schema — only include real posts; placeholder slugs don't
  // exist as routes yet and would 404, so we must not claim them in schema.
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/blog`,
    name: "Moinabad Farmstays Travel Blog",
    description: "Travel guides and tips for farmhouses and resorts near Hyderabad",
    url: `${BASE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Moinabad Farmstays",
      url: BASE_URL,
    },
    ...(isPlaceholder
      ? {}
      : {
          blogPost: displayPosts.slice(0, 5).map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            url: `${BASE_URL}/blog/${post.slug}`,
            datePublished: post.createdAt || new Date().toISOString(),
            author: { "@type": "Person", name: post.author || "Jagan Sangeri" },
          })),
        }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-dark">
              Moinabad Farmstays
            </p>
            <h1 className="font-display text-4xl font-bold text-luxury-black sm:text-5xl">
              Travel Guide & Tips
            </h1>
            <p className="mt-4 text-lg text-luxury-charcoal/70 max-w-2xl mx-auto">
              Farmhouse guides, weekend getaway ideas, and resort tips for Moinabad and Hyderabad.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-luxury-gold to-amber-400" />
          </div>

          {/* Coming soon notice if placeholder */}
          {isPlaceholder && (
            <div className="mb-8 rounded-2xl border border-luxury-gold/30 bg-luxury-sand/60 p-4 text-center text-sm text-luxury-charcoal/70">
              📖 Blog posts coming soon! Browse our{" "}
              <Link href="/resorts" className="font-semibold text-luxury-gold-dark hover:underline">
                resorts
              </Link>{" "}
              in the meantime.
            </div>
          )}

          {/* Post grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                isPlaceholder={isPlaceholder}
              />
            ))}
          </div>

          {/* Internal linking CTA */}
          <div className="mt-16 rounded-3xl border border-luxury-gold/30 bg-gradient-to-br from-luxury-sand via-white to-luxury-cream p-8 text-center shadow-sm">
            <h2 className="mb-2 font-display text-2xl font-bold text-luxury-black">
              Ready to Book Your Moinabad Farmstay?
            </h2>
            <p className="mb-6 text-luxury-charcoal/70">
              Browse our curated collection of luxury farmhouses and resorts in Moinabad.
            </p>
            <Link
              href="/resorts"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-luxury-gold to-amber-400 px-8 py-3 font-bold text-luxury-black shadow-luxury hover:scale-[1.03] transition-all"
            >
              Explore All Resorts →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
