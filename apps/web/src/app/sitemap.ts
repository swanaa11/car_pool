import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/search`, lastModified: now },
    { url: `${base}/how-it-works`, lastModified: now },
    { url: `${base}/safety`, lastModified: now },
    { url: `${base}/privacy`, lastModified: now },
    { url: `${base}/terms`, lastModified: now },
    { url: `${base}/faq`, lastModified: now },
  ];
}
