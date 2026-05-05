import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://tableo.app";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/onboarding`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/stats`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
  ];
}
