// Cloudflare Pages Functions middleware for SPA routing
export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Skip middleware for static assets (files with extensions)
  if (url.pathname.includes('.')) {
    return context.next();
  }

  // For all other routes, serve index.html (SPA routing)
  try {
    // Try to fetch the requested path first
    const response = await context.next();

    // If it's a 404, serve index.html instead
    if (response.status === 404) {
      const indexResponse = await context.env.ASSETS.fetch(
        new Request(url.origin + '/index.html', context.request)
      );

      return new Response(indexResponse.body, {
        status: 200,
        statusText: 'OK',
        headers: indexResponse.headers
      });
    }

    return response;
  } catch (error) {
    // Fallback to index.html on any error
    const indexResponse = await context.env.ASSETS.fetch(
      new Request(url.origin + '/index.html', context.request)
    );

    return new Response(indexResponse.body, {
      status: 200,
      statusText: 'OK',
      headers: indexResponse.headers
    });
  }
}
