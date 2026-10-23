(function () {
  try {
    const view = document.defaultView;
    if (!location.href.includes("starve.io")) return;
    function inject() {
      [["loader/polyfill.js", false], ["loader/packages.js", false], ["loader/loader.js", false]]
        .forEach(([src, asModule]) => {
          const s = document.createElement("script");
          s.src = view.chrome.runtime.getURL(src);
          if (asModule) s.type = "module";
          s.async = false;                       // zachowuje kolejność
          (document.head || document.documentElement).appendChild(s);
        });
    }
    view.chrome.storage.local.get("active", (st) => {
      if (st.active === 0) return console.log("%cVoid OFF", "color:red");
      if (st.active === undefined) view.chrome.storage.local.set({ active: 1 });
      console.log("%cVoid ON", "color:lime");
      inject();
    });
  } catch (e) { console.warn("Void injector:", e); }
})();
