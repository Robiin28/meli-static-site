import { posts } from "../data/blog";
import { services } from "../data/services";

type SitemapItem = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
};

const staticPages = [
  "/",
  "/about/",
  "/contact/",
  "/process/",
  "/services/",
  "/blog/",
  "/privacy/",
  "/terms/",
];

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toUrl = (site: URL, pathname: string) => new URL(pathname, site).toString();

const serializeItem = (item: SitemapItem) => {
  const lines = ["<url>", `  <loc>${xmlEscape(item.loc)}</loc>`];

  if (item.lastmod) lines.push(`  <lastmod>${item.lastmod}</lastmod>`);
  if (item.changefreq) lines.push(`  <changefreq>${item.changefreq}</changefreq>`);
  if (item.priority) lines.push(`  <priority>${item.priority}</priority>`);

  lines.push("</url>");
  return lines.join("\n");
};

export function GET({ site }: { site: URL | undefined }) {
  const baseSite = site ?? new URL("https://meliagencyet.com");

  const pages: SitemapItem[] = [
    ...staticPages.map((pathname) => ({
      loc: toUrl(baseSite, pathname),
      changefreq: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? "1.0" : "0.7",
    })),
    ...posts.map((post) => ({
      loc: toUrl(baseSite, `/blog/${post.slug}/`),
      lastmod: post.dateISO,
      changefreq: "monthly",
      priority: "0.8",
    })),
    ...services.map((service) => ({
      loc: toUrl(baseSite, `/services/${service.slug}/`),
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(serializeItem),
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
