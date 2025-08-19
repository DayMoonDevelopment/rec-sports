const lastMod = new Date().toISOString();

export function loader() {
  const baseUrl = "https://www.recsports.app";
  const pages = [
    "/",
    "/volleyball",
    "/basketball",
    "/soccer",
    "/softball",
    "/football",
    "/pickleball",
    "/tennis",
    "/baseball",
    "/kickball",
    "/ultimate-frisbee",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(
            (page) => `
        <url>
            <loc>${baseUrl}${page}</loc>
            <lastmod>${lastMod}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        `
          )
          .join("")}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
}
