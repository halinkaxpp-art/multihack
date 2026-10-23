const t = document.getElementById("toggle");
chrome.storage.local.get("active", (s) => t.checked = s.active !== 0);
t.addEventListener("change", () => chrome.storage.local.set({ active: t.checked ? 1 : 0 }));
document.getElementById("reload").addEventListener("click", () =>
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => chrome.tabs.reload(tabs[0].id)));
