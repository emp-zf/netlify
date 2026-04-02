export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const targetUrl = new URL(url.pathname + url.search, 'https://globe5g.nulledbytes.qpon');
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      'Host': 'globe5g.nulledbytes.qpon',
    },
    body: request.body,
  });
  let response = await fetch(modifiedRequest);
  let html = await response.text();
  if (response.headers.get('content-type')?.includes('text/html')) {
    html = html.replace(/(src|href)=["']\/(.*?)["']/g, `$1="https://globe5g.nulledbytes.qpon/$2"`);
  }
  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = { path: "/*" };
