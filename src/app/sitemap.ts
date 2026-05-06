import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://madok26.com";
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/program`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/bildiri`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/poster`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/odeme`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/konusmacilar`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/paketler`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/mekan`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hakkinda`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sponsorluk`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/komiteler`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/iletisim`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
