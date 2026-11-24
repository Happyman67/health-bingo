const CACHE = "health-bingo-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) await cache.put(url, response);
          } catch {
            // A missing icon should not block the rest of the shell.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const home = await caches.match("/");
          if (home) return home;
        }
        return new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }),
  );
});
