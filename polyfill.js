(function () {
  try {
    const w = document.defaultView;
    const canParse = (w.URL && w.URL.canParse) || (w.webkitURL && w.webkitURL.canParse);
    if (canParse && !w.JSON.canParse) {
      Object.defineProperty(w.JSON, "canParse", {
        value: function (a, b) { return canParse.call(w.URL || w.webkitURL, a, b); },
        writable: false, configurable: false, enumerable: false
      });
    }
    Reflect.deleteProperty(w.JSON, "isRawJSON");
    w.inner = w;
  } catch (e) {}
})();
