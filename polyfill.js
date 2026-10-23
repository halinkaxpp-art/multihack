(function () {
  try {
    const w = document.defaultView;
    const canParse = (w.URL && w.URL.canParse) || (w.webkitURL && w.webkitURL.canParse);
    if (canParse && w.JSON && !w.JSON.canParse) {
      Object.defineProperty(w.JSON, "canParse", {
        value: (a, b) => canParse.call(w.URL || w.webkitURL, a, b),
        writable: false, configurable: false, enumerable: false
      });
    }
    if (w.JSON && "isRawJSON" in w.JSON) Reflect.deleteProperty(w.JSON, "isRawJSON");
    w.inner = w;                       // gra sprawdza window.inner
  } catch (e) {}
})();
