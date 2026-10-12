export default async (request, context) => {
  const backendUrl = Deno.env.get("XRAY_BACKEND_URL"); // name, not the URL
  const url = new URL(request.url);
  const targetUrl = backendUrl + url.pathname + url.search;

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: "half",
    redirect: "manual",
  });

  return fetch(proxyRequest);
};
