const cacheName = "content-client-cache-v1"
const cachedFiles = [
    "/pt.language.js",
    "/en.language.js",
    "/app.css",
    "/app.js",
    "/",
    "/index.html",
    "/app.webmanifest",
    "/vendor.js"
];


function to(promise, errorExt) {
    return promise
        .then((data) => [undefined, data])
        .catch((err) => {

            if (errorExt) {
                Object.assign(err, errorExt);
            }

            return [err, undefined];
        });
}

// Installation 
self.addEventListener('install', (event) => {
    event.waitUntil(async function () {
        const cache = await caches.open(cacheName);
        await cache.addAll(cachedFiles);
    }());
});


/*
Once a new ServiceWorker has installed & a previous version isn't being used, \
the new one activates, and you get an activate event. 
Because the old version is out of the way, it's a good time to handle schema migrations 
in IndexedDB and also delete unused caches.
*/
self.addEventListener('activate', (event) => {
    event.waitUntil(async function () {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.filter((name) => name !== cacheName).map(cacheToDelete => caches.delete(cacheToDelete))
        );
    }());
});

// If there's a cached version available, use it, but fetch an update for next time.
self.addEventListener('fetch', (event) => {

    event.respondWith(async function () {
        // console.log("serviceWorker::","url", event.request.url);
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse)
            return cachedResponse;
        else
            return fetch(event.request);

       // return cachedResponse || networkResponsePromise;

        //   event.waitUntil(async function() {
        //     const networkResponse = await networkResponsePromise;
        //     await cache.put(event.request, networkResponse.clone());
        //   }());

        // Returned the cached response if we have one, otherwise return the network response.

    }());
});