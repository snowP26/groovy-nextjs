import { MetadataRoute } from "next";
import { getProducts } from "../lib/shopify";

const BASE_URL = "https://www.groovyph.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts(100);

  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/collection/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/collection`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productRoutes,
  ];
}
