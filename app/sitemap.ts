import { MetadataRoute } from "next";

const BASE_URL = "https://www.groovyph.com";

const productSlugs = [
  "embroidered-longsleeves",
  "graphic-tee",
  "embroidered-tee",
  "plaid-polo",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = productSlugs.map((slug) => ({
    url: `${BASE_URL}/collection/${slug}`,
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
