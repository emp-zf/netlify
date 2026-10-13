export default async (request: Request): Promise<Response> => {
  const backendUrl = Deno.env.get("XRAY_BACKEND_URL");
  if (!backendUrl) {
    return new Response("XRAY_BACKEND_URL is not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const base = backendUrl.replace(/\/+$/, "");
  const targetUrl = base + url.pathname + url.search;

  let upstream: Response;
  try {
    upstream = await fetch(
      new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        duplex: "half",
        redirect: "manual",
      }),
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return new Response(`Upstream error: ${detail}`, { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "no-store");      // never cache xhttp streams
  headers.set("CDN-Cache-Control", "no-store");  // at the Netlify edge
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
};
