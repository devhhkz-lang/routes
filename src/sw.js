import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

const API_ORIGIN = 'https://your-public-api.com'   // ваш API

// Обновление по кнопке
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

// Pre-cache app shell + удаление устаревших кэшей
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// SPA-навигация офлайн: любой маршрут отдаёт index.html,
// React Router сам нарисует /offline и другие страницы
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

// 1) Cache-first: картинки/шрифты
registerRoute(
  ({ request }) => ['image', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 }),
    ],
  })
)

// 2) Network-first: ПУБЛИЧНЫЕ API-запросы (список + детали)
const markFromCache = {
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    if (!cachedResponse) return cachedResponse
    const headers = new Headers(cachedResponse.headers)
    headers.set('X-From-Cache', 'true')
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers,
    })
  },
}

registerRoute(
  ({ url, request }) =>
    url.origin === API_ORIGIN &&
    request.method === 'GET' &&
    !request.headers.has('Authorization') &&   // приватные данные не кэшируем
    !url.pathname.includes('/auth'),
  new NetworkFirst({
    cacheName: 'api-public-v1',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 3600 }),
      markFromCache,
    ],
  })
)