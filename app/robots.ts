import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://tableo.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/#features", "/#pricing", "/stats"],
        disallow: ["/dashboard", "/analytics", "/orders", "/crm", "/menu", "/qr", "/tables", "/settings", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
