const C = 'budget-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

const put = r => fetch(r).then(res => {
  const copy = res.clone();
  caches.open(C).then(c => c.put(r, copy));
  return res;
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const lib = /gstatic\.com\/firebasejs|cdn\.jsdelivr\.net|cdn\.sheetjs\.com/.test(r.url);
  if (new URL(r.url).origin !== location.origin && !lib) return;
  e.respondWith(lib
    ? caches.match(r).then(m => m || put(r))
    : put(r).catch(() => caches.match(r, { ignoreSearch: true })));
});