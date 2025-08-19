export function loader() {
  return new Response(
    `User-agent: *
Allow: /

# Block access to admin routes
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*.xml$

# Sitemap
Sitemap: https://www.recsports.app/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
