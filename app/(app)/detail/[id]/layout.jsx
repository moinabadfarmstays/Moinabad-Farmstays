import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const product = await productModel.findById(id).lean();

    if (!product) {
      return {
        title: "Resort Not Found | Moinabad Farmstays",
      };
    }

    const title = `${product.title} | Moinabad Farmstays`;
    const description = product.desc?.substring(0, 160) || `Book ${product.title} in Moinabad for your next weekend getaway.`;
    const imageUrl = product.image || product.profileImages?.[0] || "";

    return {
      title,
      description,
      alternates: {
        canonical: `/detail/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `/detail/${id}`,
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Moinabad Farmstays | Resort Details",
    };
  }
}

export default async function DetailLayout({ children, params }) {
  const { id } = await params;
  
  // Inject JSON-LD
  let jsonLd = null;
  try {
    await connectToDatabase();
    const product = await productModel.findById(id).lean();
    if (product) {
      const imageUrl = product.image || product.profileImages?.[0] || "";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": product.title,
        "description": product.desc,
        "url": `https://www.moinabadfarmstays.com/detail/${id}`,
        "image": imageUrl,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": product.address,
          "addressLocality": "Moinabad",
          "addressRegion": "Telangana",
          "addressCountry": "IN"
        },
        "priceRange": product.price ? `₹${product.price}` : "$$",
      };
      
      // If latitude and longitude exist
      if (product.latitude && product.longitude) {
         jsonLd.geo = {
           "@type": "GeoCoordinates",
           "latitude": product.latitude,
           "longitude": product.longitude
         };
      }
      
      // If rating exists
      if (product.reviews && product.reviews.length > 0) {
        const avg = product.reviews.reduce((s, r) => s + (r.rating || 0), 0) / product.reviews.length;
        jsonLd.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": avg.toFixed(1),
          "reviewCount": product.reviews.length
        };
      }
    }
  } catch {
    // Ignore error
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
