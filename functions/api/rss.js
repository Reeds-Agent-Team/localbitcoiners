const RSS_URL = "https://feeds.fountain.fm/uv4pyDVtNAiiCCx5emOU";

export async function onRequest(context) {
  const origin = context.request.headers.get("Origin") || "";

  const allowedOrigins = [
    "https://localbitcoiners.com",
    "http://localhost",
    "http://127.0.0.1",
  ];
  const corsOrigin = allowedOrigins.find((o) => origin.startsWith(o))
    ? origin
    : "https://localbitcoiners.com";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const resp = await fetch(RSS_URL, {
      headers: { "User-Agent": "LocalBitcoiners-RSS/1.0" },
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (!resp.ok) {
      return new Response("RSS feed returned an error", {
        status: 502,
        headers: corsHeaders,
      });
    }

    const xml = await resp.text();

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    return new Response("Failed to fetch RSS feed", {
      status: 502,
      headers: corsHeaders,
    });
  }
}
