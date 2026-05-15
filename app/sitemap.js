import connectToDatabase from "@/app/utils/configue/db";
import productModel from "@/app/utils/models/productModel";

export default async function sitemap() {
  const baseUrl = "https://www.moinabadfarmstays.com";

  let products = [];
  try {
    await connectToDatabase();
    products = await productModel.find({}).select("_id updatedAt").lean();
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  const resortUrls = products.map((product) => ({
    url: `${baseUrl}/detail/${product._id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/resorts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...resortUrls,
  ];
}
