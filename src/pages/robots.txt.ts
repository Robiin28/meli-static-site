export function GET({ site }: { site: URL | undefined }) {
  const baseSite = site ?? new URL("https://meliagencyet.com");
  const sitemapUrl = new URL("/sitemap.xml", baseSite).toString();

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapUrl}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
