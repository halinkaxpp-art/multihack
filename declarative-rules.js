// Blokuje główny bundle gry (.js?v=), przepuszcza biblioteki i widoki.
const RULES = [
  { id: 1, priority: 3, action: { type: "allow" }, condition: { urlFilter: "token.js",   resourceTypes: ["script"] } },
  { id: 2, priority: 3, action: { type: "allow" }, condition: { urlFilter: "howler.js",  resourceTypes: ["script"] } },
  { id: 3, priority: 3, action: { type: "allow" }, condition: { urlFilter: "jquery.js",  resourceTypes: ["script"] } },
  { id: 4, priority: 3, action: { type: "allow" }, condition: { urlFilter: "/js/views/", resourceTypes: ["script"] } },
  { id: 5, priority: 1, action: { type: "block" }, condition: { urlFilter: ".js?v=",     resourceTypes: ["script"] } }
];
const RULE_IDS = [1, 2, 3, 4, 5];

function apply() {
  chrome.storage.local.get("active", (s) => {
    if (s.active === undefined) chrome.storage.local.set({ active: 1 });
    if (s.active === 0) return chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: RULE_IDS });
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: RULE_IDS, addRules: RULES });
  });
}
chrome.runtime.onInstalled.addListener(apply);
chrome.runtime.onStartup.addListener(apply);
chrome.storage.onChanged.addListener(apply);
apply();
