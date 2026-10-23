// Void V6 - service worker.
const RULES = [
  { id: 1, priority: 3, action: { type: "allow" }, condition: { urlFilter: "token.js",  resourceTypes: ["script"] } },
  { id: 2, priority: 3, action: { type: "allow" }, condition: { urlFilter: "howler.js", resourceTypes: ["script"] } },
  { id: 3, priority: 3, action: { type: "allow" }, condition: { urlFilter: "jquery.js", resourceTypes: ["script"] } },
  { id: 5, priority: 3, action: { type: "allow" }, condition: { urlFilter: "/js/views/", resourceTypes: ["script"] } },
  { id: 4, priority: 1, action: { type: "block" }, condition: { urlFilter: ".js?v=", resourceTypes: ["script"] } }
];
const RULE_IDS = [1, 2, 3, 4, 5];
chrome.storage.local.set({ active: 1 });
chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: RULE_IDS, addRules: RULES });
