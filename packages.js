// Ładuje biblioteki do parsowania AST (acorn, Terser) i formatowania (js-beautify).
(function () {
  const w = document.defaultView;
  const LIBS = {
    acorn: [
      "https://cdnjs.cloudflare.com/ajax/libs/acorn/8.11.3/acorn.min.js",
      "https://cdn.jsdelivr.net/npm/acorn@8/dist/acorn.min.js"
    ],
    Terser: [
      "https://cdnjs.cloudflare.com/ajax/libs/terser/5.27.0/terser.min.js",
      "https://cdn.jsdelivr.net/npm/terser@5/dist/bundle.min.js"
    ],
    js_beautify: [
      "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js",
      "https://cdn.jsdelivr.net/npm/js-beautify@1.14.0/js/lib/beautify.min.js"
    ]
  };
  function loadOne(name, urls, i = 0) {
    if (w[name]) return Promise.resolve(true);
    if (i >= urls.length) { console.warn("[Void] brak " + name); return Promise.resolve(false); }
    return new Promise((res) => {
      const s = document.createElement("script");
      s.src = urls[i]; s.async = false;
      s.onload = () => res(!!w[name]);
      s.onerror = () => res(loadOne(name, urls, i + 1));
      document.head.appendChild(s);
    });
  }
  w.__voidLibs = Promise.all(Object.keys(LIBS).map(n => loadOne(n, LIBS[n])));
})();
