export default async (request, context) => {
  const backendUrl = Deno.env.get("https://hrz-mnl.nulledbytes.com");
  const url = new URL(request.url);
  const targetUrl = backendUrl + url.pathname + url.search;

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: 'half', // needed for streaming request bodies
    redirect: 'manual'
  });

  const response = await fetch(proxyRequest);
  return response;
};
