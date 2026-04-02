export default async (request: Request) => {
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
  return fetch(modifiedRequest);
};

export const config = { path: "/*" };
