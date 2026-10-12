// netlify/edge-functions/proxy.js

export const config = {
  path: "/*", // This tells Netlify to run this function for all paths
};

export default async (request, context) => {
  const backendUrl = Deno.env.get("XRAY_BACKEND_URL");
  if (!backendUrl) {
    return new Response("Backend URL not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const base = backendUrl.replace(/\/$/, ""); // Remove trailing slash to avoid double slashes
  const targetUrl = base + url.pathname + url.search;

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: "half",
    redirect: "manual",
  });

  return fetch(proxyRequest);
};
