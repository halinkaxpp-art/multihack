/* ============================================================================
   Void V7 Reborn — loader.js  (v7.2, pełny plik)
   Wstrzykiwany do strony przez injector.js. Wymaga: Terser, acorn (packages.js),
   js_beautify (CDN), polyfill (JSON.canParse, window.inner).
   ============================================================================ */
(async function () {
"use strict";

/* ------------------------------- narzędzia ------------------------------- */
const log  = (m, c) => console.log("%c[Void] " + m, "color:" + (c || "cyan") + ";font-weight:bold");
const warn = (m, ...a) => console.warn("[Void] " + m, ...a);
const $    = (id) => document.getElementById(id);
const xor  = (s) => Array.from(s).map(c => String.fromCharCode(c.charCodeAt(0) ^ 1410065407)).join("");
const F    = function () {};

/* FIX 0 — globalne logowanie błędów (nic już nie ginie cicho) */
window.addEventListener("error", e => log("BLAD: " + e.message + " @ " + e.filename + ":" + e.lineno));
window.addEventListener("unhandledrejection", e => log("BLAD PROMISE: " + ((e.reason && (e.reason.stack || e.reason)) || e.reason)));

/* --------------------------- encje / itemy (dane gry) --------------------------- */
const E = {
  PLAYERS:0, FIRE:1, WORKBENCH:2, SEED:3, WALL:4, SPIKE:5, BIG_FIRE:6, STONE_WALL:7, GOLD_WALL:8,
  DIAMOND_WALL:9, WOOD_DOOR:10, CHEST:11, STONE_SPIKE:12, GOLD_SPIKE:13, DIAMOND_SPIKE:14, STONE_DOOR:15,
  GOLD_DOOR:16, DIAMOND_DOOR:17, FURNACE:18, AMETHYST_WALL:19, AMETHYST_SPIKE:20, AMETHYST_DOOR:21,
  RESURRECTION:22, EMERALD_MACHINE:23, EXTRACTOR_MACHINE_STONE:24, EXTRACTOR_MACHINE_GOLD:25,
  EXTRACTOR_MACHINE_DIAMOND:26, EXTRACTOR_MACHINE_AMETHYST:27, EXTRACTOR_MACHINE_REIDITE:28,
  EXTRACTOR_MACHINE_EMERALD:29, EXTRACTOR_MACHINE_COPPER:30, EXTRACTOR_MACHINE_IRON:31,
  EXTRACTOR_MACHINE_TOPAZ:32, EXTRACTOR_MACHINE_SAPPHIRE:33, EXTRACTOR_MACHINE_JADE:34,
  EXTRACTOR_MACHINE_RUBY:35, EXTRACTOR_MACHINE_COAL:36, EXTRACTOR_MACHINE_AQUAMARINE:37, TOTEM:38,
  WHEAT_SEED:40, WINDMILL:41, BREAD_OVEN:43, WELL:44, PUMPKIN_SEED:46, ROOF:47, GARLIC_SEED:48,
  THORNBUSH_SEED:49, BED:50, TOMATO_SEED:52, CARROT_SEED:53, WOOD_DOOR_SPIKE:54, STONE_DOOR_SPIKE:55,
  GOLD_DOOR_SPIKE:56, DIAMOND_DOOR_SPIKE:57, AMETHYST_DOOR_SPIKE:58, REIDITE_WALL:59, REIDITE_DOOR:60,
  REIDITE_SPIKE:61, REIDITE_DOOR_SPIKE:62, WATERMELON_SEED:63, ALOE_VERA_SEED:64, WOLF:67, SPIDER:68,
  FOX:69, BEAR:70, DRAGON:71, PIRANHA:72, KRAKEN:73, CRAB:74, FLAME:75, LAVA_DRAGON:76, BOAR:77,
  CRAB_BOSS:78, BABY_DRAGON:79, BABY_LAVA:80, HAWK:81, VULTURE:82, SAND_WORM:83, BABY_MAMMOTH:84,
  MAMMOTH:85, PARROT:86, OCELOT:87, CROCODILE:88, GOLDEN_CHICKEN:89, GOLDEN_HEN:90, RABBIT:92,
  TREASURE_CHEST:93, DEAD_BOX:94, THORNBUSH_MOB:97, CRATE:98, GIFT:99, PENGUIN:100, ALOE_VERA_MOB:101
};
const ITEM = {}; let __ii = 0;
("SWORD PICK FUR PICK_GOLD PICK_DIAMOND SWORD_GOLD SWORD_DIAMOND HAND PICK_WOOD PIRATE_SWORD EARMUFFS COAT " +
 "WOOD_SPEAR SPEAR GOLD_SPEAR DIAMOND_SPEAR DRAGON_SPEAR LAVA_SPEAR CRAB_SPEAR EMERALD_SPEAR COPPER_SPEAR " +
 "IRON_SPEAR TOPAZ_SPEAR SAPPHIRE_SPEAR JADE_SPEAR RUBY_SPEAR COAL_SPEAR AQUAMARINE_SPEAR REIDITE_SWORD " +
 "DIAMOND_PROTECTION AMETHYST_PROTECTION REIDITE_PROTECTION EXPLORER_HAT PIRATE_HAT STONE_HELMET GOLD_HELMET " +
 "DIAMOND_HELMET EMERALD_HELMET COPPER_HELMET IRON_HELMET TOPAZ_HELMET SAPPHIRE_HELMET JADE_HELMET RUBY_HELMET " +
 "COAL_HELMET AQUAMARINE_HELMET BOOK BAG SWORD_AMETHYST PICK_AMETHYST PICK_REIDITE PICK_EMERALD PICK_COPPER " +
 "PICK_IRON PICK_TOPAZ PICK_SAPPHIRE PICK_JADE PICK_RUBY PICK_COAL PICK_AQUAMARINE AMETHYST_SPEAR REIDITE_SPEAR " +
 "HAMMER HAMMER_GOLD HAMMER_DIAMOND HAMMER_AMETHYST HAMMER_REIDITE CAP_SCARF CHRISTMAS_HAT ELF_HAT AMETHYST_HELMET " +
 "REIDITE_HELMET SUPER_HAMMER HAMMER_EMERALD HAMMER_COPPER HAMMER_IRON HAMMER_TOPAZ HAMMER_SAPPHIRE HAMMER_JADE " +
 "HAMMER_RUBY HAMMER_COAL HAMMER_AQUAMARINE LAVA_SWORD SWORD_EMERALD SWORD_COPPER SWORD_IRON SWORD_TOPAZ " +
 "SWORD_SAPPHIRE SWORD_JADE SWORD_RUBY SWORD_COAL SWORD_AQUAMARINE WOOD_BOW STONE_BOW GOLD_BOW DIAMOND_BOW " +
 "AMETHYST_BOW REIDITE_BOW DRAGON_BOW EMERALD_BOW COPPER_BOW IRON_BOW TOPAZ_BOW SAPPHIRE_BOW JADE_BOW RUBY_BOW " +
 "COAL_BOW AQUAMARINE_BOW WOOD_SHIELD STONE_SHIELD GOLD_SHIELD DIAMOND_SHIELD AMETHYST_SHIELD REIDITE_SHIELD " +
 "EMERALD_SHIELD COPPER_SHIELD IRON_SHIELD TOPAZ_SHIELD SAPPHIRE_SHIELD JADE_SHIELD RUBY_SHIELD COAL_SHIELD " +
 "AQUAMARINE_SHIELD CROWN_GREEN CROWN_ORANGE CROWN_BLUE TURBAN1 TURBAN2 PILOT_HELMET HOOD PEASANT WINTER_HOOD " +
 "WINTER_PEASANT FIREFLY WOOD_ARROW STONE_ARROW GOLD_ARROW DIAMOND_ARROW AMETHYST_ARROW REIDITE_ARROW " +
 "DRAGON_ARROW EMERALD_ARROW COPPER_ARROW IRON_ARROW TOPAZ_ARROW SAPPHIRE_ARROW JADE_ARROW RUBY_ARROW COAL_ARROW " +
 "AQUAMARINE_ARROW STONE WOOD PLANT GOLD DIAMOND FIRE WORKBENCH SEED MEAT COOKED_MEAT BIG_FIRE FURNACE PAPER " +
 "AMETHYST AMETHYST_WALL AMETHYST_SPIKE AMETHYST_DOOR BRIDGE SAND BOTTLE_FULL randomshit1 randomshit2 " +
 "BOTTLE_EMPTY KRAKEN_SKIN WATERING_CAN FLOUR WHEAT_SEED COOKIE WILD_WHEAT WINDMILL CAKE FOODFISH FOODFISH_COOKED " +
 "SCALES GROUND PLOT ICE BREAD BREAD_OVEN SANDWICH FUR_WINTER BLUE_CORD LOCK DRAGON_HEART LAVA_HEART RESURRECTION " +
 "EMERALD_MACHINE WALL STONE_WALL GOLD_WALL DIAMOND_WALL REIDITE_WALL WOOD_DOOR STONE_DOOR GOLD_DOOR DIAMOND_DOOR " +
 "REIDITE_DOOR SPIKE STONE_SPIKE GOLD_SPIKE DIAMOND_SPIKE AMETHYST_SPIKE REIDITE_SPIKE WOOD_DOOR_SPIKE " +
 "STONE_DOOR_SPIKE GOLD_DOOR_SPIKE DIAMOND_DOOR_SPIKE AMETHYST_DOOR_SPIKE REIDITE_DOOR_SPIKE TOTEM " +
 "PUMPKIN_SEED GARLIC_SEED THORNBUSH_SEED TOMATO_SEED CARROT_SEED WATERMELON_SEED ALOE_VERA_SEED ROOF BED WELL " +
 "FUR_WINTER WATERING_CAN_FULL PITCHFORK PITCHFORK2 SADDLE DIVING_MASK SUPER_DIVING_SUIT NIMBUS WITCH LOCKPICK " +
 "REIDITE GOLD_STONE CROWN_BLUE_ITEM")
  .split(" ").forEach(n => { if (n) ITEM[n] = __ii++; });

/* ============================== 1. bundle gry ============================== */
let GAME_URL = null;
for (const s of document.querySelectorAll("script[src]")) {
  const src = s.src;
  if (!src) continue;
  if (/views\/|token\.js|howler\.js|jquery\.js/.test(src)) continue;
  if (/\.js\?v=/.test(src)) { GAME_URL = src; break; }
}
if (!GAME_URL) { log("BRAK skryptu gry!", "red"); return; }
log("bundle gry: " + GAME_URL);

const GAME_SRC = await new Promise((res, rej) => {
  const x = new XMLHttpRequest();
  x.open("GET", GAME_URL, true);
  x.onreadystatechange = () => {
    if (x.readyState === 4) (x.status === 200 || x.status === 0) ? res(x.responseText) : rej(new Error("HTTP " + x.status));
  };
  x.send();
});
log("pobrano " + Math.round(GAME_SRC.length / 1024) + " KB");

/* ============================== 2. props (AST) ============================== */
const VERSION = (GAME_URL.match(/v=(\d+)/) || [])[1] || "0";

const idb = () => new Promise((res, rej) => {
  const r = indexedDB.open("crackSunrise", 1);
  r.onupgradeneeded = (ev) => { const db = ev.target.result; if (!db.objectStoreNames.contains("data")) db.createObjectStore("data"); };
  r.onsuccess = (ev) => res((ev.target || r).result);
  r.onerror = () => rej(r.error);
});
const idbGet = async (k) => { const db = await idb(); return new Promise(res => { const q = db.transaction("data","readonly").objectStore("data").get(k); q.onsuccess = (ev) => res((ev.target || q).result); }); };
const idbPut = async (k, v) => { const db = await idb(); return new Promise(res => { const q = db.transaction("data","readwrite").objectStore("data").put(v, k); q.onsuccess = () => res(); }); };

function detectProps(ast) {
  const out = ["", "", "", "", ""];
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.type === "SequenceExpression") {
      let cur = null, other = null;
      for (const e of n.expressions) {
        if (e.type === "AssignmentExpression" && e.right && e.right.value === "url('img/cursor1.png'), pointer") cur = e;
        else if (e.type === "AssignmentExpression" && e.left && e.left.property) other = e;
      }
      if (cur && other && !out[0]) out[0] = other.left.property.name;
    }
    if (n.type === "AssignmentExpression" && n.left && n.left.type === "MemberExpression" &&
        n.left.object.type === "ThisExpression" && n.right && n.right.type === "ArrayExpression" &&
        n.right.elements.length === 9 && n.right.elements.every(e => e && e.type === "ArrayExpression")) {
      if (!out[1]) out[1] = n.left.property.name;
    }
    if (n.type === "AssignmentExpression" && n.left && n.left.type === "MemberExpression" &&
        n.left.object.type === "ThisExpression" && n.right && n.right.type === "UnaryExpression" &&
        n.right.operator === "~" && n.right.argument && n.right.argument.value === 1e6) {
      if (!out[3]) out[3] = n.left.property.name;
    }
    if (n.type === "AssignmentExpression" && n.left && n.left.type === "MemberExpression" &&
        n.right && n.right.type === "ObjectExpression" && !out[2]) {
      const props = n.right.properties.map(p => p.key && (p.key.name || p.key.value));
      if (props.includes("server") || props.includes("port")) { /* noop */ }
      if (props.includes("commandInput")) out[2] = n.left.property.name;
      if (props.includes("serverAddressBlock")) out[4] = n.left.property.name;
    }
    for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") walk(v); }
  })(ast);
  return out;
}

/* FIX 1 — walidacja cache + wymuszenie świeżej detekcji (nowy prefiks klucza) */
const PROPS_KEY = "propsV2_" + VERSION;
async function getProps() {
  let cached = null;
  try { cached = await idbGet(PROPS_KEY); } catch (e) { log("cache read err: " + e); }
  const vals = cached ? Object.values(cached) : [];
  const ok = cached && vals.length >= 4 && vals.filter(Boolean).length >= 4;
  if (ok && !window.__VOID_REDETECT) { log("props z cache v2 (" + VERSION + "): " + JSON.stringify(cached)); return cached; }
  log("wykrywam propsy... " + (cached ? "(cache nieprawidlowy/force)" : "(brak cache)"));
  let props = null;
  try {
    const min = await window.Terser.minify(GAME_SRC, { compress: { passes: 1 }, mangle: false });
    props = detectProps(window.acorn.parse(min.code, { ecmaVersion: 2022 }));
  } catch (e) { log("BLAD detekcji propsow: " + ((e && e.stack) || e)); props = cached; }
  if (props) { log("props wykryte: " + JSON.stringify(props)); const bad = props.map((v,i)=>v?null:i).filter(v=>v!==null); if (bad.length) log("!!! PUSTE PROPSY idx: " + bad.join(","), "orange"); }
  try { await idbPut(PROPS_KEY, props); } catch (e) {}
  return props;
}
const PROPS = await getProps();
if (!PROPS || !PROPS.filter(Boolean).length) { log("nie udalo sie wykryc propsow", "red"); return; }

/* ============================== 3. hook prototypu ============================== */
window.__VOID_CAP = window.__VOID_CAP || [];
const captured = window.__VOID_CAP;
(function hookPrototype() {
  const slot = "\u200b";
  for (const p of PROPS) {
    if (!p) continue;
    try {
      Object.defineProperty(Object.prototype, p, {
        configurable: true,
        get() { return this[slot + p]; },
        set(v) { this[slot + p] = v; if (v && typeof v === "object" && !captured.includes(this)) captured.push(this); }
      });
    } catch (e) {}
  }
  const _keys = Object.keys;
  Object.keys = (o) => (o === null || o === undefined) ? [] : _keys(o);
  Object.keys.toString = () => "function keys() { [native code] }";
})();

/* ============================== 4. store + mapowanie ============================== */
const CL = {}, GD = {}, UI = {}, WD = {}, UD = {}, MS = {};
Object.defineProperties(window, { v2600:{get:()=>CL}, v2601:{get:()=>GD}, v2602:{get:()=>UI}, v2603:{get:()=>WD}, v2604:{get:()=>UD}, v2605:{get:()=>MS} });

let CLIENT=null, WORLD=null, USER=null, GAME=null, OPTS=null;
let installed = false, wsReady = false, mapW = 0, mapH = 0, pingSent = 0, pingText = 0, lastGaugeT = Date.now();

const assigned = [], assignLog = [];
const strings = s => { const o = []; let m; const r = /["']([^"']*)["']/g; while ((m = r.exec(s))) o.push(m[1]); return o; };
const unesc = s => s.replace(/\\(\d{1,3})/g, (m,d) => String.fromCharCode(parseInt(d,8)))
                   .replace(/\\x([0-9A-Fa-f]{2})/g, (m,h) => String.fromCharCode(parseInt(h,16)));
const countCalls = s => (s.replace(/function\s*\(\s*\)\s*{/g, "").match(/[^\s()]+\s*\(\s*\)/g) || []).length;
const shape = (a,b) => (a && typeof a === "object" && b && typeof b === "object") &&
  Object.keys(b).every(k => (k in a) && (b[k] === "any" ? true : typeof a[k] === typeof b[k]));
const lenOf = o => Array.isArray(o) ? o.length : Object.keys(o).length;
const counts = s => ({ s:(s.match(/;/g)||[]).length, l:(s.match(/\//g)||[]).length, e:(s.match(/=/g)||[]).length });
const sim = (a,b) => { const x = counts(a), y = counts(b); const n = (x.s===y.s)+(x.l===y.l)+(x.e===y.e); const p = n/3*100; return p === 100 ? 100 : p >= 66 ? 66 : 33; };
const lines = s => { try { return window.js_beautify(s).split("\n").length; } catch (e) { return s.split("\n").length; } };
const def = (dst, name, src, key) => Object.defineProperty(dst, name, { configurable:true, get(){ return src[key]; }, set(v){ src[key] = v; } });

function assign(prefix, src, dst, name, type, spec, fnLen, callCnt, lineCnt, mustInc, refSrc, pick) {
  if (dst[name] !== undefined) { assigned.push(prefix + name); return; }
  let hit = 0;
  const keys = Object.keys(src);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i], val = src[key];
    if (assigned.includes(prefix + key)) continue;
    if (typeof type === "function" && typeof val === "function") {
      if (lineCnt && lineCnt !== "any" && lines(val.toString()) !== lineCnt) continue;
      let strs = strings(unesc(val.toString()));
      if (strs.join("").length > 300 || !strs.length) strs = [];
      const kw = (Array.isArray(spec) ? spec : []).some(k => strs.some(s => s.includes(k))) || (strs.length && spec[0] === "any");
      const inc = mustInc === "any" || !mustInc || mustInc === "none" || val.toString().includes(mustInc);
      const fnOk = fnLen === "any" || fnLen === undefined || val.length === fnLen;
      const callOk = callCnt === "any" || callCnt === undefined || countCalls(val.toString()) === callCnt;
      const simOk = !refSrc || sim(refSrc, val.toString()) >= 100;
      if (kw && inc && fnOk && callOk && simOk) {
        if (pick) { hit++; if (hit !== pick) continue; }
        def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
      }
    } else if (Array.isArray(type) && Array.isArray(val)) {
      if (lenOf(val) === spec || spec === "any") { if (pick) { hit++; if (hit !== pick) continue; }
        def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return; }
    } else if (type && typeof type === "object" && !Array.isArray(type) && val && typeof val === "object" && !Array.isArray(val)) {
      if (shape(val, type) && (lenOf(val) === spec || spec === "any")) { if (pick) { hit++; if (hit !== pick) continue; }
        def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return; }
    } else if (typeof type === "boolean" && typeof val === "boolean" && val === type) {
      if (pick) { hit++; if (hit !== pick) continue; }
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    } else if (typeof type === "number" && typeof val === "number" && val === type && val === spec) {
      if (pick) { hit++; if (hit !== pick) continue; }
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    }
  }
}
function assignIdx(prefix, src, dst, name, index) {
  if (dst[name] !== undefined) return;
  let i = 0;
  for (const key in src) {
    if (i === index) { def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, index]); return; }
    i++;
  }
}
const idx = (prefix, name) => { for (const [k, v] of assignLog) if (k === prefix + name) return v; return null; };

/* FIX 3 — wybór obiektów gry z logami */
function pickObjects() {
  if (!CLIENT) CLIENT = captured.find(o => o && (o.connect || o.message || o.ping || o.timeout));
  if (!WORLD)  WORLD  = captured.find(o => o && (o.w || o.transition) && (o.units || o.fast_units));
  if (!GAME)   GAME   = captured.find(o => o && (o.waiting || o.buttons || o.unlock));
  if (!USER)   USER   = captured.find(o => o && (o.alert || o.beta || o.control));
  if (!OPTS)   OPTS   = captured.find(o => o && o.options);
  return !!(CLIENT && WORLD && GAME && USER && OPTS);
}

function mapAll() {
  /* CLIENT */
  assignIdx("client", CLIENT, CL, "websocket", 0);
  assign("client", CLIENT, CL, "WRZ", F, [], 0, 3, "any", "waiting");
  assign("client", CLIENT, CL, "WSA", F, [], 1, 0, 3, "none");
  assign("client", CLIENT, CL, "WSB", F, [], 1, 0, 3, "none");
  assign("client", CLIENT, CL, "WSC", F, [], 1, 0, 3, "none");
  assign("client", CLIENT, CL, "WSD", F, [], 1, 0, 4, "none");
  assign("client", CLIENT, CL, "WSE", F, [], 1, 0, 4, "none");
  assign("client", CLIENT, CL, "WSF", F, ["|"], 1, 0, 18, "none");
  assign("client", CLIENT, CL, "WSG", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSH", F, [], 0, 0, 3, "EMPTY");
  assign("client", CLIENT, CL, "WSI", F, [], 1, 0, 4, "stringify");
  assign("client", CLIENT, CL, "WSJ", F, [], 7, 0, 9, "none");
  assign("client", CLIENT, CL, "WSK", F, [], 1, 0, 5, "none");
  assign("client", CLIENT, CL, "WSL", F, [], 1, 0, 4, "mode");
  assign("client", CLIENT, CL, "WSM", F, [], 1, 0, 4, "Uint16Array");
  assign("client", CLIENT, CL, "WSN", F, [], 1, 0, 4, "Uint16Array");
  assign("client", CLIENT, CL, "WSO", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSP", F, [], 2, 0, 3, "stringify");
  assignIdx("client", CLIENT, CL, "WSR", (idx("client","WSP") || 0) + 1);
  assign("client", CLIENT, CL, "WSS", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSQ", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WST", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSU", F, [], 2, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSV", F, [], 2, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSW", F, [], 3, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSX", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSY", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WSZ", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQA", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQB", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQC", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQD", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQE", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "units", F, [], 3, 1, "any", "none");
  assign("client", CLIENT, CL, "WQG", F, [" ...","... "], 1, 2, "any", "none");
  assignIdx("client", CLIENT, CL, "WQH", (idx("client","WQG") || 0) - 1);
  assign("client", CLIENT, CL, "WQI", F, [], 1, 1, 8, "none");
  assign("client", CLIENT, CL, "WQJ", F, [], 0, 0, 8, "none");
  assign("client", CLIENT, CL, "WQK", F, [], 1, 2, 13, "none");
  assign("client", CLIENT, CL, "WQL", F, [], 2, 1, 5, "none");
  assign("client", CLIENT, CL, "WQM", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQN", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQO", F, [], 2, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQP", F, [], 0, 0, 7, "stringify");
  assignIdx("client", CLIENT, CL, "WQR", (idx("client","WQP") || 0) + 1);
  assign("client", CLIENT, CL, "WQS", F, [], 1, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQQ", F, [], 2, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQT", F, [], 0, 0, 3, "stringify");
  assign("client", CLIENT, CL, "WQU", F, [], 1, 0, 4, "stringify");
  assign("client", CLIENT, CL, "WQV", F, [], 1, 0, 4, "stringify");
  assign("client", CLIENT, CL, "WQW", F, [], 1, 0, 3, "stringify");
  assignIdx("client", CLIENT, CL, "WQX", (idx("client","WQW") || 0) + 2);
  assign("client", CLIENT, CL, "WQY", F, [], 0, 2, 7, "none");
  assign("client", CLIENT, CL, "WQZ", F, ["adsRefresh"], 2, 3, 17, "none");
  assignIdx("client", CLIENT, CL, "WTA", (idx("client","WQZ") || 0) + 1);
  assignIdx("client", CLIENT, CL, "WTB", (idx("client","WTA") || 0) + 3);
  assign("client", CLIENT, CL, "WTC", F, [], 0, 1, 4, "none");
  assign("client", CLIENT, CL, "WTD", F, [], 1, 1, 8, "++");

  /* GAME */
  assign("game", GAME, GD, "WTE", F, [], 0, 29, "any", "options.button");
  assign("game", GAME, GD, "WSJ", { translate:{x:0,y:0}, y:0 }, 4);
  assign("game", GAME, GD, "WTF", [], 359);
  assign("game", GAME, GD, "WTG", F, ["team_box","shop_starterkit","home_craft","recipe_craft","option_in_game","sure_delete","cancel_sure_delete","chronoquest"], 1, 6);
  assign("game", GAME, GD, "drawGame", F, [], 0, 1, "any", "none");
  assign("game", GAME, GD, "WTI", { translate:{x:0,y:0}, focus:F }, 4);
  assign("game", GAME, GD, "WTJ", { open:false, select:F, items:[] }, 10);

  /* UI */
  assign("ui", OPTS, UI, "WTK", F, [], 0, 2, 14, "check_ads");
  assign("ui", OPTS, UI, "WTL", F, ["token?id="], 2, 4, "any", "none");
  assign("ui", OPTS, UI, "WTM", { id:"any", style:"any", input:"any", active:0, position:0, view:0, translate:{x:0,y:0} }, 7);

  /* WORLD */
  assign("world", WORLD, WD, "WTN", [], "any");
  assign("world", WORLD, WD, "units", [], "any");
  assign("world", WORLD, WD, "fast_units", [], "any");
  assign("world", WORLD, WD, "WTP", F, ["any"], 1, 11, "any", "none");
  assignIdx("world", WORLD, WD, "WTR", (idx("world","WTP") || 0) + 3);
  assignIdx("world", WORLD, WD, "WTS", (idx("world","WTR") || 0) + 1);

  /* USER */
  assign("user", USER, UD, "WSO", {}, 3);
  assign("user", USER, UD, "WTQ", {}, 3);
  assign("user", USER, UD, "WTT", {}, 5);
  assign("user", USER, UD, "WTU", {}, 7);
  assign("user", USER, UD, "WTV", {}, 6);
  assign("user", USER, UD, "WTW", {}, 2);
  assign("user", USER, UD, "WTX", {}, 4);
  assign("user", USER, UD, "WQK", {}, 5);
  assignIdx("userGhost", USER.WQK, USER.WQK, "WTY", 1);
  assign("user", USER, UD, "WTZ", {}, 9);
  assign("user", USER, UD, "WUA", { rotate:"any", enabled:"any" }, 2);
  assign("user", USER, UD, "WUB", [], 0);
  assign("user", USER, UD, "WUC", {}, 5);
  assign("user", USER, UD, "WUD", {}, 5);
  assign("user", USER, UD, "WUE", {}, 2);
  assign("user", USER, UD, "WUF", {}, 22);
  assignIdx("userCam", USER.WUF, USER.WUF, "WUG", 12);
  assignIdx("userCam", USER.WUF, USER.WUF, "WUH", 13);
  assignIdx("userCam", USER.WUF, USER.WUF, "WUI", 14);
  assignIdx("userCam", USER.WUF, USER.WUF, "WUJ", 15);
  assignIdx("userCam", USER.WUF, USER.WUF, "WUK", 16);
  assign("user", USER, UD, "WUL", {}, 6);
  assignIdx("userControl", USER.WUL, USER.WUL, "WUG", 5);
  assign("user", USER, UD, "WSJ", {}, 19);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUM", 0);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUN", 1);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUO", 2);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUP", 3);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUR", 4);
  assignIdx("userGauges", USER.WSJ, USER.WSJ, "WUS", 5);
  assign("user", USER, UD, "WUQ", { translate:{x:0,y:0}, sort:F }, 7);
  assign("ldb", USER.WUQ, USER.WUQ, "WUT", [], 0);
  assign("user", USER, UD, "WUU", {}, 11);
  assignIdx("userInv", USER.WUU, USER.WUU, "WUV", 3);
  assignIdx("userInv", USER.WUU, USER.WUU, "WUW", 4);
  assignIdx("userInv", USER.WUU, USER.WUU, "WUX", 8);
  assign("user", USER, UD, "WUY", { enabled:false, translate:{x:0,y:0} }, 5);
  assign("user", USER, UD, "WUZ", {}, 18);
  assignIdx("userCraft", USER.WUZ, USER.WUZ, "WVA", 3);
  assignIdx("userCraft", USER.WUZ, USER.WUZ, "WVB", 4);
  assignIdx("userCraft", USER.WUZ, USER.WUZ, "WUP", 10);
  assign("user", USER, UD, "WVC", { add:F }, 5, "any", "any", "none");
  assignIdx("userDesert", USER.WVC, USER.WVC, "WVD", 1);
  assign("user", USER, UD, "WVE", { add:F }, 5, "any", "any", "none");
  assignIdx("userWinter", USER.WVE, USER.WVE, "WVD", 1);
  assign("user", USER, UD, "WVF", 0, 0, "any", "any", "any", "any", "any", 4);
  assign("user", USER, UD, "WVG", false, false, "any", "any", "any", "any", "any", 2);

  /* klucz o wartosci -1 -> iid */
  try { for (const k in USER) { if (USER[k] === -1) { MS.iid = k; break; } } } catch (e) {}
  log("mapowanie propsow gotowe (" + assigned.length + " pol)");
}

/* ============================== 5. hooki sieci ============================== */
let wsOrig = null, sendFn = null, onopenFn = null;
const spamStore = {};
const pkt = { camera: null, build: null };

function hookWebSocket() {
  if (!CL.websocket || wsOrig === CL.websocket) return;
  if (wsOrig) { try { wsOrig.close(); } catch (e) {} }
  wsOrig = CL.websocket;
  onopenFn = wsOrig.onopen ? wsOrig.onopen.bind(wsOrig) : null;
  sendFn = wsOrig.send.bind(wsOrig);
  wsOrig.send = function (data) {
    try {
      if (wsOrig.readyState !== 1) return;
      if (typeof data === "string") {
        const a = JSON.parse(data);
        if (pkt.camera == null && a.length === 3) pkt.camera = a[0];
        if (pkt.build == null && a.length === 4) { pkt.build = a[0]; return sendFn(data); }
        if (a[0] === pkt.build) {
          if (a[1] === E.TOTEM) { const p = me(); if (p) { S.totemOnMap.x = p.x / (mapW * 100); S.totemOnMap.y = p.y / (mapH * 100); } }
          return sendFn(data);
        }
        if (a[0] === pkt.camera) return sendFn(a);
      }
    } catch (e) {}
    return sendFn(data);
  };
  wsOrig.onopen = function () { wsReady = true; for (const k in spamStore) { spamStore[k] = S[k] && S[k].active; if (S[k]) S[k].active = false; } onopenFn && onopenFn(); };
  wsOrig.onclose = function () { wsReady = false; for (const k in spamStore) if (S[k]) S[k].active = spamStore[k]; try { CL.WSG && CL.WSG(); } catch (e) {} };
  CL.websocket = wsOrig;
  log("websocket zahookowany");
}
function hookTimeout() {
  const orig = window.setTimeout;
  window.setTimeout = function (fn, ms, ...a) { if (ms === 33 && !S.Hidden.active) ms = 0; return orig(fn, ms, ...a); };
  window.setTimeout.toString = () => "setTimeout() { [native code] }";
}
function hookSpawn() {
  if (typeof CL.WTB !== "function" || CL.__spawnHooked) return;
  const orig = CL.WTB;
  CL.WTB = function (a) { try { mapW = a[20]; mapH = a[21]; WD.max_units = a[7]; WD.uid = a[9] * WD.max_units; WD.time = a[5]; S.timePlayed.start = Date.now(); } catch (e) {} return orig.apply(this, arguments); };
  CL.__spawnHooked = true;
}
function hookGauges() {
  if (typeof CL.WSJ !== "function" || CL.__gaugeHooked) return;
  const orig = CL.WSJ;
  CL.WSJ = function () { lastGaugeT = Date.now(); return orig.apply(this, arguments); };
  CL.__gaugeHooked = true;
}
function hookTime() {
  if (typeof CL.WSK !== "function" || CL.__timeHooked) return;
  const orig = CL.WSK;
  CL.WSK = function (d) { WD.time = d; return orig.apply(this, arguments); };
  CL.__timeHooked = true;
}
function hookPing() {
  if (typeof CL.WSG !== "function" || CL.__pingHooked) return;
  const os = CL.WSG, oh = CL.WSH;
  CL.WSG = function () { pingSent = Date.now(); return os.apply(this, arguments); };
  CL.WSH = function () { if (pingSent) pingText = Date.now() - pingSent; return oh.apply(this, arguments); };
  CL.__pingHooked = true;
}
function hookDrawGame() {
  const orig = GD.drawGame;
  if (typeof orig !== "function" || GD.__drawHooked) return;
  GD.drawGame = function () { const r = orig.apply(this, arguments); try { drawOverlay(); } catch (e) {} return r; };
  GD.__drawHooked = true;
}
let ctx = null, canvasEl = null;
function hookCanvas() {
  canvasEl = $("game_canvas");
  ctx = canvasEl && canvasEl.getContext("2d");
  if (ctx && !ctx.__voidAlpha) {
    const o = ctx.drawImage;
    ctx.drawImage = function (...a) { if (S.Xray.active && wsReady) ctx.globalAlpha = S.Xray.opacity; return o.apply(this, a); };
    ctx.__voidAlpha = true;
  }
}
function hookKeys() {
  document.addEventListener("keydown", e => {
    if (e.code === S.Hidden.bind) { S.Hidden.active = !S.Hidden.active; applyMenuOpacity(); const g = $(xor("voidGui")); if (g) g.style.display = S.Hidden.active ? "none" : "flex"; return; }
    for (const k in S) { const f = S[k]; if (f && f.bind === e.code && "active" in f) { f.active = !f.active; save(); } }
    if (e.code === S.Spectator.bind) S.spectator = !S.spectator;
    if (e.code === S.DropSword.bind) { const p = me(); if (p && weaponKind(p.right)) CL.WQS(p.right); }
  });
}

/* ============================== 6. ustawienia ============================== */
function cookie(n) { const d = decodeURIComponent(document.cookie).split("; "); for (const c of d) if (c.indexOf(n + "=") === 0) return c.substring(n.length + 1); return ""; }
function setCookie(n, v, days = 7) { const d = new Date(); d.setTime(d.getTime() + days * 864e5); document.cookie = n + "=" + encodeURIComponent(v) + "; expires=" + d.toUTCString() + "; path=/"; }

const S = {
  darkMode: 0, putToChest: 10, pingDisplay: 1, fpsDisplay: 1, gaugeTimer: 1, gaugePercentages: 1,
  boxInfo: 1, fireInfo: 1, timePlayed: { active: 1, start: 0 }, daysAlive: 1,
  chestInfo: { texture: "Bright", active: 1 }, playerTimers: "Enemys", smoothRoofs: 1, joinsLeaves: 1,
  menuOpacity: .5, buildingInfo: 1, playersOnTop: 1, treasureChestOnTop: 1,
  skinChanger: { active: 0, skin: 0 }, bagChanger: { active: 0, bag: 0 }, bookChanger: { active: 0, book: 0 },
  accChanger: { active: 0, acc: 0 }, totemOnMap: { active: 1, x: 0, y: 0 }, deathOnMap: { active: 1, x: 0, y: 0 },
  drawLeaderboardAllies: 1, ZmaAutoCrown: 1, playerTracers: 1, ColoredSpikes: { texture: "Light", active: 1 },
  vehicleOpacity: .5, listEnabledHacks: { mode: "Bottom Left" }, movementPredictor: 1, blizzardAndSandstorm: 1,
  Debugger: { mode: "None" }, equipAfterPlace: { active: 1 }, Spectator: { bind: "KeyV", speed: 25, active: 0 },
  DropSword: { bind: "Backquote" }, Roof: { active: 1, opacity: .5 }, Hidden: { active: 0, bind: "KeyH" },
  showLeaderBoardLevels: 1, increasedZoom: 0, canvasBrightness: 1, spectator: false,
  market: { wood: 0, stone: 0, gold: 0, diamond: 0, amethyst: 0, reidite: 0 },
  localToken: { Token: cookie("starve_token"), TokenID: cookie("starve_token_id") },
  Aimbot: { active: 0, mode: "Only Attack", angle: 0, rangeVisual: 0, BowRange: 300, bind: "NONE" },
  Xray: { active: 1, opacity: .5, bind: "KeyZ" },
  AutoSpike: { active: 0, mode: "Normal", bind: "KeyF", speed: 4 },
  AutoWall: { active: 0, mode: "Normal", bind: "Space" },
  AutoFire: { active: 0, bind: "NONE" },
  AutoBuild: { active: 0, mode: "Bridges", bind: "NONE" },
  AutoSteal: { active: 0, bind: "NONE" },
  AutoExtTake: { active: 0, bind: "NONE" }, AutoExtPut: { active: 0, bind: "NONE" },
  AutoBreadTake: { active: 0, bind: "NONE" }, AutoBreadPut: { active: 0, bind: "NONE" },
  AutoCraft: { active: 0, bind: "KeyE" }, AutoRecycle: { active: 0, bind: "NONE" },
  SmartCraft: { active: 0, option: "Gold Spikes", amount: 10, bind: "NONE" },
  AutoCrown: { active: 0, bind: "NONE" }, AutoTotem: { active: 0, bind: "KeyT" },
  AutoEmerald: { active: 0, angle: 0, bind: "NONE" }, AutoFarm: { active: 0, angle: 0, SX: 0, SY: 0, TLX: 0, TLY: 0, BRX: 0, BRY: 0, bind: "NONE" },
  AutoTame: { active: 0, angle: 0, bind: "NONE" }, AutoUnlock: { active: 0, bind: "NONE" },
  AutoFurnace: { active: 0, bind: "NONE" }, AutoSeed: { active: 0, bind: "NONE" },
  AutoIce: { active: 0, bind: "NONE" }, AutoBook: { active: 0, bind: "NONE" },
  AutoRespawn: { active: 0, bind: "NONE" }, AutoLand: { active: 0, bind: "NONE" },
  AutoDiving: { active: 0, bind: "NONE" }, AutoHat: { active: 0, bind: "NONE" },
  PathFinder: { active: 0, End: { x: 0, y: 0 }, lastKit: false, bind: "NONE" },
  ZmaAutoBottle: { enabled: 0, health: 50, bind: "NONE" }, ZmaRedGold: { active: 0, bind: "NONE" },
  Tracers: { Boars:0, GoldenChicken:0, GoldenHen:0, Hawks:0, Rabbits:0, Spiders:0, Wolfs:0, Ocelots:0,
    Crocodiles:0, Parrots:0, BabyLavaDragons:0, FireMobs:0, LavaDragons:0, Krakens:0, Piranhas:0,
    Sandworms:0, Crabs:0, KingCrabs:0, Vultures:0, BabyDragons:0, BabyMammoths:0, Bears:0, Dragons:0,
    Foxes:0, Mammoths:0, Penguins:0 }
};
function setPath(path, val) { const p = path.split("."); const last = p.pop(); const o = p.reduce((a, k) => a && a[k], S); if (o && last in o) o[last] = val; }
function save() { try { const out = {}; const walk = (o, pre) => { for (const k in o) { const v = o[k]; const p = pre ? pre + "." + k : k; if (v && typeof v === "object" && !Array.isArray(v)) walk(v, p); else out[p] = v; } }; walk(S, ""); localStorage.setItem("settings_all", JSON.stringify(out)); } catch (e) {} }

/* ============================== 7. GUI ============================== */
const cb  = (label, obj, prop, after) => ({ type:"checkbox", label, obj, prop, after });
const rng = (label, obj, prop, min, max, step, after) => ({ type:"range", label, obj, prop, min, max, step, after });
const sel = (label, obj, prop, options, after) => ({ type:"select", label, obj, prop, options, after });
const bind = (label, obj) => ({ type:"bind", label, obj });
const btn = (label, action) => ({ type:"button", label, action });
const txt = (label, obj, prop) => ({ type:"text", label, obj, prop });
const sub = (label, items) => ({ type:"subfolder", label, subfolder: items });
const randStr = (n) => Array.from({ length: n }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");

const guiConfig = {
  title: "Void V7 Reborn",
  align: "right", toggleGuiKey: "NONE", toggleGuiButton: true, draggable: true,
  fontSize: 18, opacity: .85, width: 880, height: 630,
  folders: {
    Visuals: [
      cb("Dark Mode", S, "darkMode", afterTexture),
      cb("Fps", S, "fpsDisplay"), cb("Ping", S, "pingDisplay"), cb("Days Alive", S, "daysAlive"),
      cb("Time Played", S.timePlayed, "active"), cb("Timer", S, "gaugeTimer"),
      cb("LeaderBoard Levels", S, "showLeaderBoardLevels"), cb("Percentages", S, "gaugePercentages"),
      cb("Joins & Leaves", S, "joinsLeaves"), cb("Totem On Map", S.totemOnMap, "active"),
      cb("Death On Map", S.deathOnMap, "active"), cb("LeaderBoard Allies", S, "drawLeaderboardAllies"),
      cb("Player Tracers", S, "playerTracers"), cb("Players On Top", S, "playersOnTop"),
      cb("Treasure Chest On Top", S, "treasureChestOnTop"), cb("Box Info", S, "boxInfo"),
      cb("Fire Info", S, "fireInfo"), cb("Building Info", S, "buildingInfo"),
      cb("Move Prediction", S, "movementPredictor"), cb("Bliz And Storm", S, "blizzardAndSandstorm"),
      sel("Show Hacks", S.listEnabledHacks, "mode", ["Bottom Left", "Top Left", "Off"]),
      sel("Debugger", S.Debugger, "mode", ["None", "No Roofs/Bridges", "Player IDS", "All"]),
      sel("Player Timers", S, "playerTimers", ["All", "Enemys", "None"]),
      sub("Chests", [ cb("Chest Info", S.chestInfo, "active"),
        sel("Chest Textures", S.chestInfo, "texture", ["Bright", "Light", "Dark"], afterTexture) ]),
      sub("Spikes", [ cb("Colored Spikes", S.ColoredSpikes, "active"),
        sel("Spike Textures", S.ColoredSpikes, "texture", ["Light", "Dark"], () => reloadTextures()) ]),
      sub("Roofs", [ cb("Smooth Roofs", S, "smoothRoofs"), cb("Opaque Roofs", S.Roof, "active"),
        rng("Roofs Opacity", S.Roof, "opacity", .1, 1, .1) ]),
      sub("Opacitys", [ rng("Vehicles Opacity", S, "vehicleOpacity", .1, 1, .1),
        rng("Menus Opacity", S, "menuOpacity", .1, 1, .1, applyMenuOpacity) ]),
      rng("Brightness", S, "canvasBrightness", .5, 1.5, .1, applyBrightness)
    ],
    Tracers: tracersFolder(),
    Misc: [
      cb("Auto Respawn", S.AutoRespawn, "active"), cb("Auto Book", S.AutoBook, "active"),
      cb("Equip After Place", S.equipAfterPlace, "active"), cb("Auto Ice", S.AutoIce, "active"),
      cb("Auto Steal", S.AutoSteal, "active"), cb("Auto Land", S.AutoLand, "active"),
      cb("Auto Tame", S.AutoTame, "active"), cb("Auto Furnace", S.AutoFurnace, "active"),
      cb("Auto Hat", S.AutoHat, "active"), cb("Auto Diving", S.AutoDiving, "active"),
      cb("Auto Unlock", S.AutoUnlock, "active"), cb("Auto Totem", S.AutoTotem, "active"),
      cb("Auto Seed", S.AutoSeed, "active"), cb("Auto Crown", S.AutoCrown, "active"),
      cb("Extractor Take", S.AutoExtTake, "active"), cb("Extractor Put", S.AutoExtPut, "active"),
      cb("Bread Take", S.AutoBreadTake, "active"), cb("Bread Put", S.AutoBreadPut, "active"),
      sub("Aimbot Settings", [ cb("Aimbot", S.Aimbot, "active"), cb("Show Range", S.Aimbot, "rangeVisual"),
        sel("Attack Mode", S.Aimbot, "mode", ["Only Attack","Attack & Chase","Rabbit Chase"]),
        rng("Bow Range", S.Aimbot, "BowRange", 100, 500, 10) ]),
      sub("Auto Build Settings", [ cb("Auto Build", S.AutoBuild, "active"), sel("Mode", S.AutoBuild, "mode", ["Bridges","Roofs","Plots"]) ]),
      sub("Spectator Settings", [ cb("Spectator", S.Spectator, "active"), rng("Speed", S.Spectator, "speed", 10, 100, 5) ]),
      rng("Put To Chest", S, "putToChest", 10, 8000, 1)
    ],
    Crafting: [
      sub("Auto Craft Settings", [ cb("Auto Craft", S.AutoCraft, "active"), bind("AutoCraft Key:", S.AutoCraft) ]),
      sub("Auto Recycle Settings", [ cb("Auto Recycle", S.AutoRecycle, "active"), bind("AutoRecycle Key:", S.AutoRecycle) ]),
      sub("Smart Craft Settings", [ cb("Smart Craft", S.SmartCraft, "active"), bind("SmartCraft Key:", S.SmartCraft),
        sel("Craft Mode", S.SmartCraft, "option", ["Reidite Spikes","Amethyst Spikes","Diamond Spikes","Gold Spikes","Stone Spikes","Wood Spikes","Reidite Walls","Amethyst Walls","Diamond Walls","Gold Walls","Stone Walls","Wood Walls"]),
        rng("Amount", S.SmartCraft, "amount", 1, 100, 1) ]),
      sub("Skin Changer", [
        cb("Skin Changer", S.skinChanger, "active"), rng("Skin", S.skinChanger, "skin", 0, 40, 1),
        cb("Bag Changer", S.bagChanger, "active"), rng("Bag", S.bagChanger, "bag", 0, 40, 1),
        cb("Acc Changer", S.accChanger, "active"), rng("Acc", S.accChanger, "acc", 0, 40, 1),
        cb("Book Changer", S.bookChanger, "active"), rng("Book", S.bookChanger, "book", 0, 40, 1) ]),
      sub("Market", [
        rng("Berries Amount", S.market, "wood", 0, 999, 1), btn("Convert Berries", () => convert("wood", 83, ITEM.PLANT)),
        rng("Pumpkin Amount", S.market, "stone", 0, 999, 1), btn("Convert Pumpkin", () => convert("stone", 62, ITEM.PLANT)),
        rng("Bread Amount", S.market, "gold", 0, 999, 1), btn("Convert Bread", () => convert("gold", 41, ITEM.PLANT)),
        rng("Carrot Amount", S.market, "diamond", 0, 999, 1), btn("Convert Carrot", () => convert("diamond", 252, ITEM.PLANT)),
        rng("Tomato Amount", S.market, "amethyst", 0, 999, 1), btn("Convert Tomato", () => convert("amethyst", 248, ITEM.PLANT)),
        rng("Thornbush Amount", S.market, "reidite", 0, 999, 1), btn("Convert Thornbush", () => convert("reidite", 240, ITEM.PLANT))
      ])
    ]
  }
};
function tracersFolder() {
  const g = (n, props) => sub(n, props.map(p => cb(p, S.Tracers, p)));
  return [ g("Forest", ["Boars","GoldenChicken","GoldenHen","Hawks","Rabbits","Spiders","Wolfs"]),
           g("Jungle", ["Ocelots","Crocodiles","Parrots"]),
           g("Lava", ["BabyLavaDragons","FireMobs","LavaDragons"]),
           g("Ocean", ["Krakens","Piranhas"]),
           g("Sand", ["Sandworms","Crabs","KingCrabs","Vultures"]),
           g("Winter", ["BabyDragons","BabyMammoths","Bears","Dragons","Foxes","Mammoths","Penguins"]) ];
}

class Gui {
  constructor(cfg) { this.cfg = cfg; this.container = null; this.folderBtns = []; this.content = null; }
  build() {
    if (this.container) return;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "https://fonts.googleapis.com/css2?family=Baloo+Paaji&display=swap";
    document.head.appendChild(link);
    this._build();
    setTimeout(() => { if (this.container) this._refresh(); }, 900);
  }
  _build() {
    if (this.container) return;
    const c = document.createElement("div");
    this.container = c; c.id = xor("voidGui");
    Object.assign(c.style, { position:"fixed", width:this.cfg.width+"px", height:this.cfg.height+"px",
      background:"rgb(20,20,20)", border:"8px solid rgb(20,20,20)", borderRadius:"8px", zIndex:9999,
      boxShadow:"0 6px 12px rgba(0,0,0,.4)", display:"flex", flexDirection:"column", boxSizing:"border-box",
      fontFamily:"Baloo Paaji, sans-serif", fontSize:this.cfg.fontSize+"px", color:"#fff", opacity:this.cfg.opacity,
      right:"0", top:"0", overflow:"hidden" });
    const title = document.createElement("div");
    title.textContent = this.cfg.title;
    Object.assign(title.style, { textAlign:"center", padding:"6px", fontWeight:"bold", fontSize:(this.cfg.fontSize+6)+"px", background:"#2a2a2a", cursor:"move" });
    c.appendChild(title);
    const body = document.createElement("div");
    Object.assign(body.style, { display:"flex", flex:1, overflow:"hidden" });
    c.appendChild(body);
    const side = document.createElement("div"); side.id = xor("sidebar");
    Object.assign(side.style, { width:"150px", background:"#1a1a1a", display:"flex", flexDirection:"column", gap:"4px", padding:"6px", overflowY:"auto" });
    body.appendChild(side);
    const content = document.createElement("div"); content.id = xor("content");
    Object.assign(content.style, { flex:1, padding:"10px", overflowY:"auto" });
    body.appendChild(content);
    this.content = content;
    Object.keys(this.cfg.folders).forEach(name => {
      const b = document.createElement("button");
      b.textContent = name;
      Object.assign(b.style, { background:"#333", color:"#fff", border:"none", padding:"6px", borderRadius:"4px", cursor:"pointer", fontSize:(this.cfg.fontSize)+"px" });
      b.addEventListener("click", () => { this._folder(name); [...side.children].forEach(x => x.style.background = "#333"); b.style.background = "#555"; b.blur(); });
      side.appendChild(b);
    });
    const first = Object.keys(this.cfg.folders)[0];
    if (first) this._folder(first);
    if (this.cfg.draggable) this._drag(c, title);
    document.body.appendChild(c);
    window.__VOID_GUI = c;
  }
  _drag(el, handle) {
    let sx, sy, ox, oy, on = false;
    handle.addEventListener("mousedown", e => { on = true; sx = e.clientX; sy = e.clientY; const r = el.getBoundingClientRect(); ox = r.left; oy = r.top; el.style.right = "auto"; el.style.left = ox + "px"; el.style.top = oy + "px"; });
    document.addEventListener("mousemove", e => { if (!on) return; el.style.left = (ox + e.clientX - sx) + "px"; el.style.top = (oy + e.clientY - sy) + "px"; });
    document.addEventListener("mouseup", () => on = false);
  }
  _folder(name) {
    const items = this.cfg.folders[name] || [];
    this.content.innerHTML = "";
    const render = (list) => {
      for (const it of list) {
        if (it.type === "subfolder") {
          const h = document.createElement("div"); h.textContent = "▸ " + it.label;
          Object.assign(h.style, { fontWeight:"bold", margin:"8px 0 4px", color:"#9fd" });
          this.content.appendChild(h);
          const wrap = document.createElement("div"); wrap.style.paddingLeft = "14px";
          this.content.appendChild(wrap);
          const prev = this.content; this.content = wrap; render(it.subfolder); this.content = prev;
        } else this._item(it);
      }
    };
    render(items);
  }
  _item(item) {
    const row = document.createElement("div");
    Object.assign(row.style, { display:"flex", alignItems:"center", gap:"8px", margin:"3px 0" });
    const obj = item.obj, prop = item.prop;
    const setv = () => { if (item.after) try { item.after(); } catch (e) {} save(); };
    if (item.type === "checkbox") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const b = document.createElement("input"); b.type = "checkbox"; b.checked = !!obj[prop];
      b.onchange = () => { obj[prop] = b.checked ? 1 : 0; setv(); };
      row.appendChild(l); row.appendChild(b);
    } else if (item.type === "range") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const v = document.createElement("span"); v.textContent = obj[prop];
      const b = document.createElement("input"); b.type = "range"; b.min = item.min; b.max = item.max; b.step = item.step; b.value = obj[prop];
      b.style.flex = "1"; b.oninput = () => { obj[prop] = parseFloat(b.value); v.textContent = b.value; if (item.after) try { item.after(); } catch (e) {} };
      b.onchange = setv;
      row.appendChild(l); row.appendChild(b); row.appendChild(v);
    } else if (item.type === "select") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const s = document.createElement("select");
      Object.assign(s.style, { background:"#333", color:"#fff", border:"0", padding:"2px", borderRadius:"4px" });
      for (const o of item.options) { const op = document.createElement("option"); op.value = o; op.textContent = o; if (obj[prop] === o) op.selected = true; s.appendChild(op); }
      s.onchange = () => { obj[prop] = s.value; setv(); };
      row.appendChild(l); row.appendChild(s);
    } else if (item.type === "bind") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const b = document.createElement("button"); b.textContent = item.obj.bind || "NONE";
      Object.assign(b.style, { background:"#444", color:"#fff", border:"0", borderRadius:"4px", padding:"2px 12px", cursor:"pointer" });
      b.onclick = () => { b.textContent = "..."; const h = e => { item.obj.bind = e.code; b.textContent = e.code; document.removeEventListener("keydown", h); save(); b.blur(); }; document.addEventListener("keydown", h); };
      row.appendChild(l); row.appendChild(b);
    } else if (item.type === "button") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const b = document.createElement("button"); b.textContent = "Run";
      Object.assign(b.style, { background:"#444", color:"#fff", border:"0", borderRadius:"4px", padding:"2px 14px", cursor:"pointer" });
      b.onclick = () => { item.action && item.action(); b.blur(); };
      row.appendChild(l); row.appendChild(b);
    } else if (item.type === "text") {
      const l = document.createElement("label"); l.textContent = item.label; l.style.flex = "1";
      const b = document.createElement("input"); b.type = "text"; b.value = obj[prop] || "";
      Object.assign(b.style, { background:"#333", color:"#fff", border:"0", padding:"2px", borderRadius:"4px" });
      b.onchange = () => { obj[prop] = b.value; setv(); };
      row.appendChild(l); row.appendChild(b);
    }
    this.content.appendChild(row);
  }
  _refresh() { try { this._folder(Object.keys(this.cfg.folders)[0]); } catch (e) {} }
}
let gui = null;
function applyBrightness() { const c = $("game_canvas"); if (c) c.style.filter = "brightness(" + S.canvasBrightness + ")"; }
function applyMenuOpacity() {
  ["shop_market","option_in_game","sure_delete","cancel_sure_delete","shop_starterkit","recipe_craft","home_craft","chronotownequest","chronoquest","sign_window","team_box"]
    .forEach(id => { const e = $(id); if (e) e.style.opacity = S.Hidden.active ? 1 : S.menuOpacity; });
}
function afterTexture() { if (S.darkMode) { S.ColoredSpikes.texture = "Dark"; S.chestInfo.texture = "Dark"; } else { S.ColoredSpikes.texture = "Light"; S.chestInfo.texture = "Light"; } reloadTextures(); }
const TEX = {
  Light: { WOOD_SPIKE_ALLY:"69",STONE_SPIKE_ALLY:"65",GOLD_SPIKE_ALLY:"54",DIAMOND_SPIKE_ALLY:"38",AMETHYST_SPIKE_ALLY:"3",REIDITE_SPIKE_ALLY:"58",
           WOOD_SPIKE_ENEMY:"72",STONE_SPIKE_ENEMY:"68",GOLD_SPIKE_ENEMY:"57",DIAMOND_SPIKE_ENEMY:"41",AMETHYST_SPIKE_ENEMY:"6",REIDITE_SPIKE_ENEMY:"61" },
  Dark:  { WOOD_SPIKE_ALLY:"34",STONE_SPIKE_ALLY:"30",GOLD_SPIKE_ALLY:"22",DIAMOND_SPIKE_ALLY:"17",AMETHYST_SPIKE_ALLY:"13",REIDITE_SPIKE_ALLY:"26",
           WOOD_SPIKE_ENEMY:"37",STONE_SPIKE_ENEMY:"33",GOLD_SPIKE_ENEMY:"25",DIAMOND_SPIKE_ENEMY:"21",AMETHYST_SPIKE_ENEMY:"16",REIDITE_SPIKE_ENEMY:"29" }
};
const TEX_BASE = "https://raw.githubusercontent.com/shwtdev/Void_V6/refs/heads/main/";
const spikeTex = {};
function reloadTextures() { const set = TEX[S.ColoredSpikes.texture] || TEX.Light; for (const k in set) { if (!spikeTex[k]) spikeTex[k] = new Image(); spikeTex[k].src = TEX_BASE + set[k] + ".png"; } }
function rebuildRoofs() {}

/* ============================== 8. rysowanie / helpery ============================== */
function me() { return WD.fast_units ? WD.fast_units[WD.uid] : null; }
function dist(a, b) { return (a && b) ? Math.hypot(a.x - b.x, a.y - b.y) : null; }
function angleTo(t, f) { return Math.atan2(t.y - f.y, t.x - f.x); }
function isAlly(pid) { if (pid === USER.id) return true; try { return (UD.WUB || []).includes(pid); } catch (e) { return false; } }
function inv(id) { try { return UD.WUU.WUV[id] || 0; } catch (e) { return 0; } }
function equip(id) { if (CL.WQR) CL.WQR(id); }
function firstInv(list) { for (const id of list) if (inv(id)) return id; return -1; }
function wsSend(a) { try { if (wsOrig && wsOrig.readyState === 1 && pkt.build != null) wsOrig.send(JSON.stringify(a)); } catch (e) {} }
function convert(res, need, item) { const have = S.market[res], n = Math.floor(have / need); for (let i = 0; i < n; i++) CL.WQN({ val: need, id: item }); S.market[res] = have % need; }
function backToLobby() { try { if (wsOrig) wsOrig.close(); CL.WSG && CL.WSG(); } catch (e) {} }
function fmtTime(s) { return s >= 3600 ? (s/3600).toFixed(2)+"h" : s >= 60 ? (s/60).toFixed(2)+"m" : s+"s"; }
function refreshSkin(which) { const p = me(); if (!p) return; const key = { skin:"skin", bag:"bag", acc:"acc", book:"book" }[which]; const cfg = S[which + "Changer"]; if (key && WD[key] !== undefined && cfg.active) p[WD[key]] = cfg[which]; }
const WEAPON_RANGE = [133, 203, 110, 120, 143];
function weaponKind(it) {
  if (it == null) return 0;
  if ([ITEM.SWORD,ITEM.SWORD_GOLD,ITEM.SWORD_DIAMOND,ITEM.REIDITE_SWORD,ITEM.SWORD_AMETHYST,ITEM.SWORD_WOOD,ITEM.LAVA_SWORD].includes(it)) return 1;
  if ([ITEM.WOOD_SPEAR,ITEM.SPEAR,ITEM.GOLD_SPEAR,ITEM.DIAMOND_SPEAR,ITEM.AMETHYST_SPEAR,ITEM.REIDITE_SPEAR].includes(it)) return 2;
  if (it === ITEM.SUPER_HAMMER) return 4;
  if ([ITEM.WOOD_BOW,ITEM.STONE_BOW,ITEM.GOLD_BOW,ITEM.DIAMOND_BOW,ITEM.AMETHYST_BOW,ITEM.REIDITE_BOW].includes(it)) return 6;
  return 0;
}
function nearestPlayer(range, excludeFly) {
  const p = me(); if (!p) return null;
  let best = null, bd = range || 550;
  for (const u of (WD.units[E.PLAYERS] || [])) {
    const pid = u[WD.pid];
    if (pid === USER.id || u[WD.ghost]) continue;
    if (excludeFly && p[WD.fly] !== u[WD.fly]) continue;
    const d = dist(p, u); if (d !== null && d < bd) { best = u; bd = d; }
  }
  return best;
}
function moveTowards(p, tgt, tol) { const dx = p.x - tgt.x, dy = p.y - tgt.y; let m = 0; if (Math.abs(dx) > tol) m += dx > 0 ? 1 : 2; if (Math.abs(dy) > tol) m += dy > 0 ? 8 : 4; CL.WQW(m); }

let fpsText = "0 FPS", lastFpsT = Date.now(), lastFrameT = Date.now();
function drawOverlay() {
  if (!ctx || !wsReady) return;
  const p = me(); if (!p) return;
  const cam = { x: (UD.WUF && UD.WUF.x) || 0, y: (UD.WUF && UD.WUF.y) || 0 };
  const players = (WD.units && WD.units[E.PLAYERS]) || [];
  for (const u of players) {
    const pid = u[WD.pid];
    if (S.playerTracers && pid !== USER.id) { ctx.save(); ctx.strokeStyle = isAlly(pid) ? "#66ff00" : "#ff2e2e"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(cam.x + p.x, cam.y + p.y); ctx.lineTo(cam.x + u.x, cam.y + u.y); ctx.stroke(); ctx.restore(); }
    if (S.movementPredictor && u.r && (u.x !== u.r.x || u.y !== u.r.y)) { ctx.save(); ctx.strokeStyle = "#ff2e2e"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(cam.x + u.x, cam.y + u.y); ctx.lineTo(cam.x + u.r.x, cam.y + u.r.y); ctx.stroke(); ctx.restore(); }
  }
  const tr = [["Krakens",E.KRAKEN,"#000"],["Sandworms",E.SAND_WORM,"#000"],["BabyDragons",E.BABY_DRAGON,"#949494"],
    ["BabyLavaDragons",E.BABY_LAVA,"#ff6600"],["Bears",E.BEAR,"#8b5a2b"],["Mammoths",E.MAMMOTH,"#a0522d"],
    ["BabyMammoths",E.BABY_MAMMOTH,"#c68642"],["Vultures",E.VULTURE,"#333"],["Crabs",E.CRAB,"#d2691e"],
    ["KingCrabs",E.CRAB_BOSS,"#b22222"],["Piranhas",E.PIRANHA,"#006400"],["Dragons",E.DRAGON,"#7b68ee"],
    ["LavaDragons",E.LAVA_DRAGON,"#ff4500"],["Parrots",E.PARROT,"#00ff7f"],["Ocelots",E.OCELOT,"#ffd700"],
    ["Crocodiles",E.CROCODILE,"#228b22"],["GoldenChickens",E.GOLDEN_CHICKEN,"#ffd700"],["GoldenHens",E.GOLDEN_HEN,"#daa520"],
    ["Boars",E.BOAR,"#8b4513"],["Rabbits",E.RABBIT,"#deb887"],["Spiders",E.SPIDER,"#483d8b"],["Wolfs",E.WOLF,"#696969"],
    ["Foxes",E.FOX,"#d2691e"],["Hawks",E.HAWK,"#8b0000"],["Penguins",E.PENGUIN,"#000080"]];
  for (const [name, type, col] of tr) {
    if (!S.Tracers[name]) continue;
    for (const u of ((WD.units && WD.units[type]) || [])) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cam.x + p.x, cam.y + p.y); ctx.lineTo(cam.x + u.x, cam.y + u.y); ctx.stroke(); ctx.restore(); }
  }
  ctx.save(); ctx.font = "16px Baloo Paaji"; ctx.textAlign = "left";
  let y = 30;
  if (S.fpsDisplay) { ctx.strokeStyle = "#000"; ctx.lineWidth = 4; ctx.fillStyle = "#fff"; ctx.strokeText(fpsText, 12, y); ctx.fillText(fpsText, 12, y); y += 20; }
  if (S.pingDisplay && pingText) { ctx.strokeStyle = "#000"; ctx.lineWidth = 4; ctx.fillStyle = "#0ff"; ctx.strokeText(pingText + " ms", 12, y); ctx.fillText(pingText + " ms", 12, y); y += 20; }
  if (S.listEnabledHacks.mode !== "Off") {
    let ly = S.listEnabledHacks.mode === "Bottom Left" ? ctx.canvas.height - 20 : 60;
    for (const k in S) { const f = S[k]; if (f && f.active && f.bind && f.bind !== "NONE") { ctx.strokeStyle = "#000"; ctx.lineWidth = 4; ctx.fillStyle = "#0f0"; ctx.strokeText(k, 12, ly); ctx.fillText(k, 12, ly); ly += S.listEnabledHacks.mode === "Bottom Left" ? -20 : 20; } }
  }
  ctx.restore();
}

/* ============================== 9. petle funkcji ============================== */
function loopAimbot() { if (!S.Aimbot.active) return; const p = me(); if (!p) return; const t = nearestPlayer(600, S.Aimbot.mode !== "Rabbit Chase"); if (!t) { S.Aimbot.angle = 0; return; } const rng = WEAPON_RANGE[weaponKind(p.right) - 1] || 0; const d = dist(p, t); if (rng && d <= rng + 4) { S.Aimbot.angle = angleTo(t, p); CL.WQU(S.Aimbot.angle); CL.WQT(); } }
function loopAutoSpike() { if (!S.AutoSpike.active) return; const p = me(); if (!p) return; const spike = firstInv([ITEM.REIDITE_SPIKE,ITEM.AMETHYST_SPIKE,ITEM.DIAMOND_SPIKE,ITEM.GOLD_SPIKE,ITEM.STONE_SPIKE,ITEM.SPIKE]); if (spike < 0 || UD.WUZ.WVA) return; const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2)); if (S.AutoSpike.mode === "Normal") { for (let i = 0; i < 6; i++) { wsSend([pkt.build, spike, (i*4 + a) % 255, 0]); wsSend([pkt.build, spike, (a - i*4 + 255) % 255, 0]); } wsSend([pkt.build, spike, a % 255, 0]); } else { if (UD.WUZ.WVB !== spike) equip(spike); if (UD.WUZ.WVB === spike) CL.WQP(); } }
function loopAutoWall() { if (!S.AutoWall.active) return; const p = me(); if (!p) return; const wall = firstInv([ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.AMETHYST_WALL,ITEM.REIDITE_WALL]); if (wall < 0 || UD.WUZ.WVA) return; const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2)); if (S.AutoWall.mode === "Normal") { for (let i = 0; i < 6; i++) { wsSend([pkt.build, wall, (i*4 + a) % 255, 0]); wsSend([pkt.build, wall, (a - i*4 + 255) % 255, 0]); } wsSend([pkt.build, wall, a % 255, 0]); } else { if (UD.WUZ.WVB !== wall) equip(wall); if (UD.WUZ.WVB === wall) CL.WQP(); } }
function loopAutoFire() { if (!S.AutoFire.active) return; const p = me(); if (!p || UD.WUZ.WVA) return; if (!inv(ITEM.FIRE) && !inv(ITEM.BIG_FIRE)) return; const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2)); wsSend([pkt.build, ITEM.FIRE, a, 0]); wsSend([pkt.build, ITEM.BIG_FIRE, a, 0]); }
function loopAutoBuild() { if (!S.AutoBuild.active) return; const p = me(); if (!p || UD.WUZ.WVA) return; const map = { Bridges:ITEM.BRIDGE, Plots:ITEM.PLOT, Roofs:ITEM.ROOF }; const id = map[S.AutoBuild.mode]; if (!inv(id)) return; const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2)); wsSend([pkt.build, id, a, 0]); }
function loopAutoSteal() { if (!S.AutoSteal.active) return; const p = me(); if (!p || UD.WUZ.WVA) return; for (const c of (WD.units[E.CHEST] || [])) if (dist(p, c) < 300) { c[MS.iid] = c.id; CL.WSZ(c); } }
function loopAutoExt() { if (!S.AutoExtTake.active && !S.AutoExtPut.active && !S.AutoSteal.active) return; const p = me(); if (!p) return; const types = [E.EXTRACTOR_MACHINE_STONE,E.EXTRACTOR_MACHINE_GOLD,E.EXTRACTOR_MACHINE_DIAMOND,E.EXTRACTOR_MACHINE_AMETHYST,E.EXTRACTOR_MACHINE_REIDITE,E.EXTRACTOR_MACHINE_EMERALD,E.EXTRACTOR_MACHINE_COPPER,E.EXTRACTOR_MACHINE_IRON,E.EXTRACTOR_MACHINE_TOPAZ,E.EXTRACTOR_MACHINE_SAPPHIRE,E.EXTRACTOR_MACHINE_JADE,E.EXTRACTOR_MACHINE_RUBY,E.EXTRACTOR_MACHINE_COAL,E.EXTRACTOR_MACHINE_AQUAMARINE]; for (const t of types) for (const x of (WD.units[t] || [])) if (dist(p, x) < 300) { x[MS.iid] = x.id; if ((S.AutoExtTake.active || S.AutoSteal.active) && (x.info & 65280) >> 8) CL.WSX(x); if (S.AutoExtPut.active && (x.info & 255) < 255) CL.WSU(x, 255); } }
function loopAutoBread() { if (!S.AutoBreadTake.active && !S.AutoBreadPut.active && !S.AutoSteal.active) return; const p = me(); if (!p) return; for (const o of (WD.units[E.BREAD_OVEN] || [])) if (dist(p, o) < 300) { o[MS.iid] = o.id; if (S.AutoBreadPut.active) { CL.WSR(o, 31, 0); CL.WSR(o, 0, 31); } if (S.AutoBreadTake.active || S.AutoSteal.active) CL.WSS(o); } for (const w of (WD.units[E.WINDMILL] || [])) if (dist(p, w) < 300) { w[MS.iid] = w.id; if (S.AutoBreadPut.active) CL.WSP(w, 255); if (S.AutoBreadTake.active || S.AutoSteal.active) CL.WSY(w, 255); } }
function loopAutoTotem() { if (!S.AutoTotem.active) return; const p = me(); if (!p || UD.WUD.wait || (UD.WUB || []).length) return; for (const t of (WD.units[E.TOTEM] || [])) if (!((t.info & 16) >> 4) && t.info < 8 && dist(p, t) < 300) { UD.WUD[WD.pid] = t[WD.pid]; UD.WUD.id = t.id; CL.WQD(); } }
function loopAutoCrown() { if (!S.AutoCrown.active) return; if (inv(ITEM.CROWN_BLUE)) equip(ITEM.CROWN_BLUE); const h = firstInv([ITEM.HAMMER_REIDITE,ITEM.HAMMER_AMETHYST,ITEM.HAMMER_DIAMOND,ITEM.HAMMER_GOLD,ITEM.HAMMER]); if (h >= 0) equip(h); CL.WQJ && CL.WQJ(); }
function loopAutoEmerald() { if (!S.AutoEmerald.active) return; const p = me(); if (!p) return; const pts = CL.__emerald || (CL.__emerald = [[28750,3018],[29563,3273],[29519,2750]]); let bi = 0, bd = Infinity; pts.forEach((pt, i) => { const d = Math.hypot(p.x - pt[0], p.y - pt[1]); if (d < bd) { bd = d; bi = i; } }); const tgt = { x: pts[bi][0], y: pts[bi][1] }; moveTowards(p, tgt, 60); if (Math.abs(p.x - tgt.x) < 100 && Math.abs(p.y - tgt.y) < 100) { S.AutoEmerald.angle = [-3.68,-5.28,-0.94][bi]; CL.WQU(S.AutoEmerald.angle); CL.WQT(); } }
function loopAutoFarm() { if (!S.AutoFarm.active) return; const p = me(); if (!p) return; const seeds = [ITEM.SEED,ITEM.PUMPKIN_SEED,ITEM.GARLIC_SEED,ITEM.THORNBUSH_SEED,ITEM.CARROT_SEED,ITEM.TOMATO_SEED,ITEM.WATERMELON_SEED,ITEM.ALOE_VERA_SEED,ITEM.WHEAT_SEED]; let best = null, bd = Infinity; for (const t of seeds) for (const s of (WD.units[t] || [])) { if (!s.info || s.info === 10) continue; const d = dist(p, s); if (d !== null && d < bd) { bd = d; best = s; } } if (best && UD.WSJ.WUN * 100 > 80) { if (best.info >= 16 && best.info <= 19) { if (inv(ITEM.WATERING_CAN_FULL)) equip(ITEM.WATERING_CAN_FULL); } else equip(firstInv([ITEM.PITCHFORK, ITEM.PITCHFORK2])); S.AutoFarm.angle = angleTo(best, p); if (S.AutoFarm.angle) { CL.WQU(S.AutoFarm.angle); CL.WQT(); } moveTowards(p, best, 50); } else moveTowards(p, { x: S.AutoFarm.SX, y: S.AutoFarm.SY }, 30); }
function loopAutoTame() { if (!S.AutoTame.active) return; const p = me(); if (!p) return; if (!inv(ITEM.SADDLE) || p[WD.fly]) { S.AutoTame.angle = 0; return; } let cand = null; for (const t of [E.PARROT,E.GOLDEN_CHICKEN,E.BABY_DRAGON,E.BABY_LAVA,E.BABY_MAMMOTH,E.CRAB_BOSS,E.HAWK]) for (const u of (WD.units[t] || [])) if (dist(p, u) < 150 && (u.info & 1) === 0) { cand = u; break; } if (cand) { S.AutoTame.angle = angleTo(cand, p); equip(ITEM.SADDLE); CL.WQU(S.AutoTame.angle); CL.WQT(); } else S.AutoTame.angle = 0; }
function loopAutoUnlock() { if (!S.AutoUnlock.active || !inv(ITEM.LOCKPICK)) return; const p = me(); if (!p) return; for (const c of (WD.units[E.CHEST] || [])) if (!isAlly(c[WD.pid]) && c.lock && dist(p, c) < 300) { c[MS.iid] = c.id; CL.WQA(c); } }
function loopAutoFurnace() { if (!S.AutoFurnace.active) return; const p = me(); if (!p) return; for (const f of (WD.units[E.FURNACE] || [])) if (dist(p, f) <= 150) { f[MS.iid] = f.id; CL.WSV(f, 255); } }
function loopAutoSeed() { if (!S.AutoSeed.active || UD.WUZ.WVA) return; const p = me(); if (!p) return; const seed = firstInv([ITEM.WHEAT_SEED, ITEM.PUMPKIN_SEED, ITEM.CARROT_SEED, ITEM.TOMATO_SEED]); if (seed < 0) return; for (let i = 0; i < 26; i++) wsSend([pkt.build, seed, i * 10, 1]); }
function loopAutoIce() { if (!S.AutoIce.active) return; const p = me(); if (!p || UD.WUZ.WVA) return; if (UD.WSJ.WUM + (1 - UD.WSJ.WUS) >= 2 && inv(ITEM.ICE)) { const b = UD.WUZ.WVB; equip(ITEM.ICE); UD.WUZ.WVB = b; } }
function loopAutoBook() { if (!S.AutoBook.active) return; const p = me(); if (!p) return; if (p.right !== ITEM.BOOK && inv(ITEM.BOOK)) equip(ITEM.BOOK); }
function loopZmaCrown() { if (!S.ZmaAutoCrown || !wsReady || !wsOrig.url.includes("community")) return; const p = me(); if (!p) return; const secs = 5 - (Date.now() - lastGaugeT) / 1000; if (Math.floor(UD.WSJ.WUN * 100) !== 100 && inv(ITEM.CROWN_GREEN) && p[WD.clothe] !== ITEM.CROWN_GREEN && secs <= .3) equip(ITEM.CROWN_GREEN); }
function loopZmaBottle() { if (!S.ZmaAutoBottle.enabled || !wsReady) return; if (Math.floor(UD.WSJ.WUN * 100) <= Number(S.ZmaAutoBottle.health) && inv(ITEM.BOTTLE_FULL)) equip(ITEM.BOTTLE_FULL); }
function loopZmaRedGold() { if (!S.ZmaRedGold.active || !wsReady) return; const p = me(); if (!p) return; for (const c of (WD.units[E.CHEST] || [])) if (dist(p, c) < 150 && (isAlly(c[WD.pid]) || !c.lock)) for (const it of [ITEM.REIDITE, ITEM.GOLD]) if (inv(it)) { c[MS.iid] = c.id; CL.WSW(c, it, 255); } }
function loopPathfinder() { if (!S.PathFinder.active) return; const p = me(); if (!p || typeof window.findpath !== "function") return; window.findpath({ x: Math.round(p.x/100), y: Math.round(p.y/100) }, S.PathFinder.End); if (dist(p, { x: S.PathFinder.End.x*100, y: S.PathFinder.End.y*100 }) < 1000 && window.lastChosenKit !== -1 && S.PathFinder.lastKit && window.chooseKit) window.chooseKit(window.lastChosenKit); }
function loopAutoRespawn() { if (!S.AutoRespawn.active || !wsReady) return; const p = me(); if (!p) { try { CL.WTL && CL.WTL(); } catch (e) {} } }
function loopAutoLand() { if (!S.AutoLand.active) return; const p = me(); if (!p) return; if (!p[WD.fly] && WD.flyableEquiped !== undefined && p[WD.vehicle] === WD.flyableEquiped && p[WD.speed] < 50) equip(WD.flyableEquiped); }
function loopAutoDiving() { if (!S.AutoDiving.active) return; const p = me(); if (!p) return; if (UD.WUZ.WUP && !inv(ITEM.SUPER_DIVING_SUIT) && inv(ITEM.DIVING_MASK) && p[WD.clothe] !== ITEM.DIVING_MASK) equip(ITEM.DIVING_MASK); }
function loopAutoHat() { if (!S.AutoHat.active) return; const p = me(); if (!p || !WD.flyableEquiped) return; if (p[WD.vehicle] !== WD.flyableEquiped) { if (WD.flyableEquiped === ITEM.NIMBUS && inv(ITEM.WITCH)) equip(ITEM.WITCH); else if (inv(ITEM.EXPLORER_HAT)) equip(ITEM.EXPLORER_HAT); } }
function loopSmartCraft() { if (!S.SmartCraft.active) return; const p = me(); if (!p) return; const id = SmartCraftId(S.SmartCraft.option); if (id < 0 || !inv(id)) return; for (let i = 0; i < S.SmartCraft.amount; i++) CL.WQI(id); }
function SmartCraftId(opt) { const m = { "Reidite Spikes":ITEM.REIDITE_SPIKE, "Amethyst Spikes":ITEM.AMETHYST_SPIKE, "Diamond Spikes":ITEM.DIAMOND_SPIKE, "Gold Spikes":ITEM.GOLD_SPIKE, "Stone Spikes":ITEM.STONE_SPIKE, "Wood Spikes":ITEM.SPIKE, "Reidite Walls":ITEM.REIDITE_WALL, "Amethyst Walls":ITEM.AMETHYST_WALL, "Diamond Walls":ITEM.DIAMOND_WALL, "Gold Walls":ITEM.GOLD_WALL, "Stone Walls":ITEM.STONE_WALL, "Wood Walls":ITEM.WALL }; return m[opt] !== undefined ? m[opt] : -1; }

const loops = [loopAimbot, loopAutoSpike, loopAutoWall, loopAutoFire, loopAutoBuild, loopAutoSteal, loopAutoExt,
  loopAutoBread, loopAutoTotem, loopAutoCrown, loopAutoEmerald, loopAutoFarm, loopAutoTame, loopAutoUnlock,
  loopAutoFurnace, loopAutoSeed, loopAutoIce, loopAutoBook, loopZmaCrown, loopZmaBottle, loopZmaRedGold,
  loopPathfinder, loopAutoLand, loopAutoDiving, loopAutoHat, loopSmartCraft];

function mainLoop(t) { const dt = Math.min((t - lastFrameT) / 1000, 1); lastFrameT = t; if (Date.now() - lastFpsT > 1000) { lastFpsT = Date.now(); fpsText = Math.round(1 / (dt || 1)) + " FPS"; } if (wsReady) { try { drawOverlay(); } catch (e) {} } requestAnimationFrame(mainLoop); }

/* ============================== 10. start ============================== */
function patchSource(src) {
  return src.replace(/(<\s*|>\s*)(?:0[xX][fF]{4}|65535)(\s*>|\s*)|(\s*)(?:0[xX][fF]{4}|65535)(\s*)(?=>|<)/g,
    m => m.replace(/(?:0[xX][fF]{4}|65535)/, "0"));
}

/* FIX 3 — pętla instalacji z diagnostyką */
function startInstall() {
  let tries = 0;
  const poll = setInterval(() => {
    tries++;
    const picked = pickObjects();
    const missing = ["client","world","game","user","opts"].filter(k => !{client:CLIENT,world:WORLD,game:GAME,user:USER,opts:OPTS}[k]);
    if (tries === 1 || tries % 5 === 0) log("[install] t" + tries + " | captured=" + captured.length + " | brak=" + (missing.join(",") || "OK"));
    if (!missing.length && typeof window.js_beautify === "function") {
      clearInterval(poll);
      try {
        mapAll();
        hookWebSocket(); hookSpawn(); hookGauges(); hookTime(); hookPing(); hookCanvas(); hookDrawGame(); hookKeys();
        gui = new Gui(guiConfig); gui.build();
        for (const l of loops) setInterval(l, 60);
        requestAnimationFrame(mainLoop);
        setInterval(() => { if (wsReady) { try { CL.WSG && CL.WSG(); } catch (e) {} } }, 2000);
        applyBrightness(); applyMenuOpacity();
        window.__VOID = { S, CL, GD, WD, UD, MS };
        log("ZAINSTALOWANO — hack aktywny", "lime");
      } catch (e) { log("BLAD instalacji: " + ((e && e.stack) || e)); }
    } else if (tries === 150) {
      log("!!! instalacja utknela. captured=" + captured.length + " brak=" + missing.join(","), "orange");
      captured.slice(0, 15).forEach((o, i) => { try { log("#" + i + ": " + Object.keys(o).slice(0, 25).join(",")); } catch (e) {} });
      if (!captured.length) log("captured puste → zle propsy. Ustaw window.__VOID_REDETECT=true i przeladuj.", "orange");
    }
  }, 200);
}

/* przywrot ustawien */
try {
  const gs = localStorage.getItem("guiSettings");
  if (gs) { const a = JSON.parse(gs); ["align","toggleGuiKey","toggleGuiButton","draggable","fontSize","opacity","width","height"].forEach((k, i) => { if (a[i] !== undefined) guiConfig[k] = a[i]; }); }
  const st = localStorage.getItem("settings_all");
  if (st) { const o = JSON.parse(st); for (const p in o) setPath(p, o[p]); }
} catch (e) {}

/* odpal gre */
hookTimeout();
reloadTextures();
log("uruchamiam gre (" + Math.round(GAME_SRC.length / 1024) + " KB)...");
try { Function(patchSource(GAME_SRC))(); } catch (e) { log("BLAD uruchomienia gry: " + ((e && e.stack) || e)); }
setInterval(() => { const p = $("exapush-popup"); if (p) { p.style.opacity = 0; p.remove(); } }, 2500);
startInstall();

})();
