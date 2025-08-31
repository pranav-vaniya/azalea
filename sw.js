const CACHE_NAME = "azalea-v1";
const FILES_TO_CACHE = [
	"./",
	"./index.html",
	"./manifest.webmanifest",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
	"./script.js",
	"./styles.css",
	"./fonts/JetBrainsMono-Regular.ttf",
	"./fonts/Poppins-Regular.ttf",
	"./libraries/bootstrap/css/bootstrap-grid.css",
	"./libraries/bootstrap/css/bootstrap-grid.css.map",
	"./libraries/bootstrap/css/bootstrap-grid.min.css",
	"./libraries/bootstrap/css/bootstrap-grid.min.css.map",
	"./libraries/bootstrap/css/bootstrap-grid.rtl.css",
	"./libraries/bootstrap/css/bootstrap-grid.rtl.css.map",
	"./libraries/bootstrap/css/bootstrap-grid.rtl.min.css",
	"./libraries/bootstrap/css/bootstrap-grid.rtl.min.css.map",
	"./libraries/bootstrap/css/bootstrap-reboot.css",
	"./libraries/bootstrap/css/bootstrap-reboot.css.map",
	"./libraries/bootstrap/css/bootstrap-reboot.min.css",
	"./libraries/bootstrap/css/bootstrap-reboot.min.css.map",
	"./libraries/bootstrap/css/bootstrap-reboot.rtl.css",
	"./libraries/bootstrap/css/bootstrap-reboot.rtl.css.map",
	"./libraries/bootstrap/css/bootstrap-reboot.rtl.min.css",
	"./libraries/bootstrap/css/bootstrap-reboot.rtl.min.css.map",
	"./libraries/bootstrap/css/bootstrap-utilities.css",
	"./libraries/bootstrap/css/bootstrap-utilities.css.map",
	"./libraries/bootstrap/css/bootstrap-utilities.min.css",
	"./libraries/bootstrap/css/bootstrap-utilities.min.css.map",
	"./libraries/bootstrap/css/bootstrap-utilities.rtl.css",
	"./libraries/bootstrap/css/bootstrap-utilities.rtl.css.map",
	"./libraries/bootstrap/css/bootstrap-utilities.rtl.min.css",
	"./libraries/bootstrap/css/bootstrap-utilities.rtl.min.css.map",
	"./libraries/bootstrap/css/bootstrap.css",
	"./libraries/bootstrap/css/bootstrap.css.map",
	"./libraries/bootstrap/css/bootstrap.min.css",
	"./libraries/bootstrap/css/bootstrap.min.css.map",
	"./libraries/bootstrap/css/bootstrap.rtl.css",
	"./libraries/bootstrap/css/bootstrap.rtl.css.map",
	"./libraries/bootstrap/css/bootstrap.rtl.min.css",
	"./libraries/bootstrap/css/bootstrap.rtl.min.css.map",
	"./libraries/bootstrap/js/bootstrap.bundle.js",
	"./libraries/bootstrap/js/bootstrap.bundle.js.map",
	"./libraries/bootstrap/js/bootstrap.bundle.min.js",
	"./libraries/bootstrap/js/bootstrap.bundle.min.js.map",
	"./libraries/bootstrap/js/bootstrap.esm.js",
	"./libraries/bootstrap/js/bootstrap.esm.js.map",
	"./libraries/bootstrap/js/bootstrap.esm.min.js",
	"./libraries/bootstrap/js/bootstrap.esm.min.js.map",
	"./libraries/bootstrap/js/bootstrap.js",
	"./libraries/bootstrap/js/bootstrap.js.map",
	"./libraries/bootstrap/js/bootstrap.min.js",
	"./libraries/bootstrap/js/bootstrap.min.js.map",
];

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
