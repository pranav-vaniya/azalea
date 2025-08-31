const CACHE_NAME = "azalea-v1";
const FILES_TO_CACHE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./script.js", "./styles.css", "./fonts/JetBrainsMono-Regular.ttf", "./fonts/Poppins-Regular.ttf"];

self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))));
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
