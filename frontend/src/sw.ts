import { BackgroundSyncPlugin } from "workbox-background-sync";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

// cache images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
  })
);
registerRoute(imageRoute);

// cache api calls
const fetchnotesRoute = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_API_BASE_URL + "/notes";
  },
  new NetworkFirst({
    cacheName: "api/fetch-notes",
  })
);
registerRoute(fetchnotesRoute);

// cache navigations
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 3,
  })
);
registerRoute(navigationRoute);

//  background sync
const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
  maxRetentionTime: 24 * 60,
});

const noteSubmitRoute = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_API_BASE_URL + "/note/create";
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);
registerRoute(noteSubmitRoute);

const editnoteRoute = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_API_BASE_URL + "/note");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PATCH"
);
registerRoute(editnoteRoute);