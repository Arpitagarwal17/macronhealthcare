const CACHE_VERSION = "macron-field-v1-2026-08-19";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const VISUAL_AID_CACHE = "macron-field-visual-aids";
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const APP_SHELL = [
  "/",
  "/product-portfolio",
  "/doctor-presentation",
  "/basket",
  "/logo.png",
  "/site.webmanifest",
  "/error.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      const staticAssets = new Set();

      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) {
            await cache.put(url, response.clone());

            if (response.headers.get("content-type")?.includes("text/html")) {
              const html = await response.text();
              for (const match of html.matchAll(/\/_next\/static\/[^"'<>\s]+/g)) {
                staticAssets.add(match[0].replace(/&amp;/g, "&"));
              }
            }
          }
        } catch {
          // A partial shell is still more useful than aborting installation.
        }
      }

      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await Promise.allSettled(
        [...staticAssets].map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) {
            await runtimeCache.put(url, response);
          }
        }),
      );
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("macron-field-") &&
                key !== VISUAL_AID_CACHE &&
                !key.startsWith(CACHE_VERSION),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await cache.match(new URL(request.url).pathname)) ||
      (await cache.match("/error.html")) ||
      Response.error()
    );
  }
}

async function optimizedImageWithVisualAidFallback(request, url) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);
  const cached = await runtimeCache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await runtimeCache.put(request, response.clone());
    }
    return response;
  } catch {
    const source = url.searchParams.get("url");
    if (source?.startsWith("/visual-aids/")) {
      const visualAidCache = await caches.open(VISUAL_AID_CACHE);
      const visualAid = await visualAidCache.match(source);
      if (visualAid) {
        return visualAid;
      }
    }
    throw new Error("Image is not available offline.");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.pathname.startsWith("/visual-aids/")) {
    event.respondWith(cacheFirst(request, VISUAL_AID_CACHE));
    return;
  }

  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(optimizedImageWithVisualAidFallback(request, url));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/logo.png"
  ) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_VISUAL_AIDS") {
    return;
  }

  const urls = Array.isArray(event.data.urls)
    ? [...new Set(event.data.urls)].filter(
        (url) => typeof url === "string" && url.startsWith("/visual-aids/"),
      )
    : [];
  const reply = event.ports?.[0];

  event.waitUntil(
    caches.open(VISUAL_AID_CACHE).then(async (cache) => {
      let completed = 0;
      const failures = [];

      for (const url of urls) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          await cache.put(url, response);
          completed += 1;
          reply?.postMessage({ type: "progress", completed, total: urls.length });
        } catch (error) {
          failures.push({
            url,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      reply?.postMessage({
        type: "complete",
        completed,
        total: urls.length,
        failures,
      });
    }),
  );
});
