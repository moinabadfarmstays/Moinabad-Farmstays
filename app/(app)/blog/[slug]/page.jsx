/**
 * app/(app)/blog/[slug]/page.jsx
 * Individual blog post page with full Article + FAQPage + BreadcrumbList schema
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/app/utils/configue/db";
import blogModel from "@/app/utils/models/blogModel";

const BASE_URL = "https://www.moinabadfarmstays.com";

async function getPost(slug) {
  try {
    await connectToDatabase();
    return await blogModel.findOne({ slug, published: true }).lean();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const posts = await blogModel.find({ published: true }).select("slug").lean();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | Moinabad Farmstays" };

  const title = post.metaTitle || `${post.title} | Moinabad Farmstays`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.tags || [],
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || "Jagan Sangeri"],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const canonicalUrl = `${BASE_URL}/blog/${slug}`;

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || "Jagan Sangeri",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Moinabad Farmstays",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.jpg` },
    },
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    ...(post.coverImage ? { image: post.coverImage } : {}),
    keywords: (post.tags || []).join(", "),
    articleSection: "Travel",
    inLanguage: "en-IN",
    timeRequired: `PT${post.readingTime || 5}M`,
  };

  // FAQPage schema (if post has FAQs)
  const faqSchema =
    post.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      <div className="min-h-screen bg-luxury-cream">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-luxury-charcoal/50">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-luxury-gold-dark">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-luxury-gold-dark">Blog</Link></li>
              <li>/</li>
              <li className="text-luxury-charcoal/80 truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-luxury-gold/30 bg-luxury-gold/10 px-3 py-0.5 text-xs font-bold text-luxury-gold-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title — h1, SEO-critical */}
          <h1 className="font-display text-3xl font-bold text-luxury-black sm:text-4xl leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="mb-8 flex items-center gap-4 text-sm text-luxury-charcoal/55 border-b border-luxury-stone/40 pb-6">
            <span>By {post.author || "Jagan Sangeri"}</span>
            <span>·</span>
            <time dateTime={post.createdAt}>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric", month: "long", day: "numeric",
                  })
                : ""}
            </time>
            <span>·</span>
            <span>{post.readingTime || 5} min read</span>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg prose-luxury max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA — internal link to resorts */}
          <div className="mt-12 rounded-3xl border border-luxury-gold/30 bg-luxury-sand/60 p-8 text-center">
            <h2 className="mb-2 font-display text-xl font-bold text-luxury-black">
              Book a Moinabad Farmstay Today
            </h2>
            <p className="mb-4 text-sm text-luxury-charcoal/70">
              Ready to experience Moinabad? Browse our luxury farmhouses and book directly.
            </p>
            <Link
              href="/resorts"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-luxury-gold to-amber-400 px-6 py-3 text-sm font-bold text-luxury-black hover:scale-[1.03] transition-all"
            >
              View All Resorts →
            </Link>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-sm text-luxury-charcoal/60 hover:text-luxury-gold-dark transition-colors">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const revalidate = 3600; // Revalidate hourly
