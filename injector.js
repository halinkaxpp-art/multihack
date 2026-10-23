(function () {
  try {
    if (!document.defaultView.location.href.includes("starve.io")) return;
    const view = document.defaultView;
    function inject() {
      [
        ["loader/polyfill.js", "module"],
        ["loader/packages.js", "classic"],
        ["loader/loader.js", "module"]
      ].forEach(function (item) {
        const s = document.createElement("script");
        s.src = view.chrome.runtime.getURL(item[0]);
        if (item[1] === "module") s.type = "module";
        s.async = false;
        (document.head || document.documentElement).appendChild(s);
      });
    }
    view.chrome.storage.local.get("active", function (storage) {
      if (storage.active === 0) { console.log("%cVoid Disabled", "color: red;"); return; }
      if (storage.active === undefined) view.chrome.storage.local.set({ active: 1 });
      console.log("%cVoid Enabled", "color: lime;");
      inject();
    });
  } catch (e) { console.warn("Void injector:", e); }
})();
