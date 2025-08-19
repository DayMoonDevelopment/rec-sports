const REQUIRED_HEADERS = [
  "accept",
  "content-type",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
];

export function validateRequiredHeaders(request: Request) {
  const hasRequiredHeaders = REQUIRED_HEADERS.every((header) =>
    request.headers.has(header)
  );

  if (!hasRequiredHeaders) {
    throw new Response("Invalid request", { status: 400 });
  }
}

export function validateAndGetCorsHeaders(request: Request) {
  const origin = request.headers.get("origin");

  /**
   * Allow requests from domains:
   * - localhost
   * - recsports.app
   */
  const allowedDomainPatterns = [
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/([\w-]+\.)*recsports\.app$/,
  ];

  const isAllowedOrigin =
    origin && allowedDomainPatterns.some((pattern) => pattern.test(origin));

  if (!isAllowedOrigin) {
    throw new Response("Forbidden", { status: 403 });
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function handlePreflightRequest(origin: string) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400", // 24 hours
    },
  });
}
