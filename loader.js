/* =============================================================================
   Void V7 Reborn — loader.js (v7.1 FIXED)
   ============================================================================= */
(async function () {
"use strict";

/* ------------------------------------------------------------------ utils */
const log   = (m, c) => console.log("%c[Void] " + m, "color:" + (c || "cyan") + ";font-weight:bold");
   window.addEventListener('error', e => log('BLAD:', e.message, '@', e.filename + ':' + e.lineno));
window.addEventListener('unhandledrejection', e => log('BLAD PROMISE:', (e.reason && (e.reason.stack || e.reason)) || e.reason));
const warn  = (...a) => console.warn("[Void]", ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const $     = (id) => document.getElementById(id);
const randStr = (n) => Array.from({ length: n }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");

window.addEventListener("unhandledrejection", e => warn("promise:", e.reason));

/* ---------------------------------------------------- 0. biblioteki (AST) */
if (window.__voidLibs) { try { await window.__voidLibs; } catch (e) {} }
for (let i = 0; i < 400 && (!window.acorn || !window.Terser || !window.js_beautify); i++) await sleep(25);
if (!window.acorn || !window.Terser) log("brak acorn/Terser — sprawdz net", "red");
if (typeof window.js_beautify !== "function") { log("brak js-beautify — detekcja moze byc niedokladna", "orange"); window.js_beautify = (s) => s.replace(/;/g, ";\n").replace(/\{/g, "{\n").replace(/\}/g, "\n}"); }

/* ---------------------------------------------- 1. typy jednostek i itemy */
const E = {
  PLAYERS:0, FIRE:1, WORKBENCH:2, SEED:3, WALL:4, SPIKE:5, BIG_FIRE:6, STONE_WALL:7,
  GOLD_WALL:8, DIAMOND_WALL:9, WOOD_DOOR:10, CHEST:11, STONE_SPIKE:12, GOLD_SPIKE:13,
  DIAMOND_SPIKE:14, STONE_DOOR:15, GOLD_DOOR:16, DIAMOND_DOOR:17, FURNACE:18,
  AMETHYST_WALL:19, AMETHYST_SPIKE:20, AMETHYST_DOOR:21, RESURRECTION:22, EMERALD_MACHINE:23,
  EXTRACTOR_MACHINE_STONE:24, EXTRACTOR_MACHINE_GOLD:25, EXTRACTOR_MACHINE_DIAMOND:26,
  EXTRACTOR_MACHINE_AMETHYST:27, EXTRACTOR_MACHINE_REIDITE:28, EXTRACTOR_MACHINE_EMERALD:29,
  EXTRACTOR_MACHINE_COPPER:30, EXTRACTOR_MACHINE_IRON:31, EXTRACTOR_MACHINE_TOPAZ:32,
  EXTRACTOR_MACHINE_SAPPHIRE:33, EXTRACTOR_MACHINE_JADE:34, EXTRACTOR_MACHINE_RUBY:35,
  EXTRACTOR_MACHINE_COAL:36, EXTRACTOR_MACHINE_AQUAMARINE:37, TOTEM:38, WHEAT_SEED:40,
  WINDMILL:41, BREAD_OVEN:43, WELL:44, PUMPKIN_SEED:46, ROOF:47, GARLIC_SEED:48,
  THORNBUSH_SEED:49, BED:50, TOMATO_SEED:52, CARROT_SEED:53, WOOD_DOOR_SPIKE:54,
  STONE_DOOR_SPIKE:55, GOLD_DOOR_SPIKE:56, DIAMOND_DOOR_SPIKE:57, AMETHYST_DOOR_SPIKE:58,
  REIDITE_WALL:59, REIDITE_DOOR:60, REIDITE_SPIKE:61, REIDITE_DOOR_SPIKE:62, WATERMELON_SEED:63,
  ALOE_VERA_SEED:64, WOLF:67, SPIDER:68, FOX:69, BEAR:70, DRAGON:71, PIRANHA:72, KRAKEN:73,
  CRAB:74, FLAME:75, LAVA_DRAGON:76, BOAR:77, CRAB_BOSS:78, BABY_DRAGON:79, BABY_LAVA:80,
  HAWK:81, VULTURE:82, SAND_WORM:83, BABY_MAMMOTH:84, MAMMOTH:85, PARROT:86, OCELOT:87,
  CROCODILE:88, GOLDEN_CHICKEN:89, GOLDEN_HEN:90, RABBIT:92, TREASURE_CHEST:93, DEAD_BOX:94,
  THORNBUSH_MOB:97, CRATE:98, GIFT:99, PENGUIN:100, ALOE_VERA_MOB:101
};
const ITEM = {};
("SWORD PICK FUR PICK_GOLD PICK_DIAMOND SWORD_GOLD SWORD_DIAMOND HAND PICK_WOOD PIRATE_SWORD " +
 "EARMUFFS COAT WOOD_SPEAR SPEAR GOLD_SPEAR DIAMOND_SPEAR DRAGON_SPEAR LAVA_SPEAR CRAB_SPEAR " +
 "EMERALD_SPEAR COPPER_SPEAR IRON_SPEAR TOPAZ_SPEAR SAPPHIRE_SPEAR JADE_SPEAR RUBY_SPEAR COAL_SPEAR " +
 "AQUAMARINE_SPEAR REIDITE_SWORD DIAMOND_PROTECTION AMETHYST_PROTECTION REIDITE_PROTECTION " +
 "EXPLORER_HAT PIRATE_HAT STONE_HELMET GOLD_HELMET DIAMOND_HELMET EMERALD_HELMET COPPER_HELMET " +
 "IRON_HELMET TOPAZ_HELMET SAPPHIRE_HELMET JADE_HELMET RUBY_HELMET COAL_HELMET AQUAMARINE_HELMET " +
 "BOOK BAG SWORD_AMETHYST PICK_AMETHYST PICK_REIDITE PICK_EMERALD PICK_COPPER PICK_IRON PICK_TOPAZ " +
 "PICK_SAPPHIRE PICK_JADE PICK_RUBY PICK_COAL PICK_AQUAMARINE AMETHYST_SPEAR REIDITE_SPEAR HAMMER " +
 "HAMMER_GOLD HAMMER_DIAMOND HAMMER_AMETHYST HAMMER_REIDITE CAP_SCARF CHRISTMAS_HAT ELF_HAT " +
 "AMETHYST_HELMET REIDITE_HELMET SUPER_HAMMER HAMMER_EMERALD HAMMER_COPPER HAMMER_IRON HAMMER_TOPAZ " +
 "HAMMER_SAPPHIRE HAMMER_JADE HAMMER_RUBY HAMMER_COAL HAMMER_AQUAMARINE SHOVEL SUPER_DIVING_SUIT " +
 "DIVING_MASK WATERING_CAN_FULL SHOVEL_GOLD SHOVEL_DIAMOND SHOVEL_AMETHYST SHOVEL_REIDITE " +
 "SHOVEL_EMERALD SHOVEL_COPPER SHOVEL_IRON SHOVEL_TOPAZ SHOVEL_SAPPHIRE SHOVEL_JADE SHOVEL_RUBY " +
 "SHOVEL_COAL SHOVEL_AQUAMARINE PITCHFORK PITCHFORK2 SPANNER MACHETE SWORD_WOOD WOOD_HELMET " +
 "DRAGON_HELMET LAVA_HELMET CROWN_CRAB DRAGON_SWORD LAVA_SWORD SWORD_EMERALD SWORD_COPPER SWORD_IRON " +
 "SWORD_TOPAZ SWORD_SAPPHIRE SWORD_JADE SWORD_RUBY SWORD_COAL SWORD_AQUAMARINE WOOD_BOW STONE_BOW " +
 "GOLD_BOW DIAMOND_BOW AMETHYST_BOW REIDITE_BOW DRAGON_BOW EMERALD_BOW COPPER_BOW IRON_BOW TOPAZ_BOW " +
 "SAPPHIRE_BOW JADE_BOW RUBY_BOW COAL_BOW AQUAMARINE_BOW WOOD_SHIELD STONE_SHIELD GOLD_SHIELD " +
 "DIAMOND_SHIELD AMETHYST_SHIELD REIDITE_SHIELD EMERALD_SHIELD COPPER_SHIELD IRON_SHIELD TOPAZ_SHIELD " +
 "SAPPHIRE_SHIELD JADE_SHIELD RUBY_SHIELD COAL_SHIELD AQUAMARINE_SHIELD CROWN_GREEN CROWN_ORANGE " +
 "CROWN_BLUE TURBAN1 TURBAN2 PILOT_HELMET HOOD PEASANT WINTER_HOOD WINTER_PEASANT FLOWER_HAT FUR_HAT " +
 "SADDLE WITCH NIMBUS WAND1 WAND2 WOOD_AXE STONE_AXE GOLD_AXE DIAMOND_AXE AMETHYST_AXE REIDITE_AXE " +
 "EMERALD_AXE COPPER_AXE IRON_AXE TOPAZ_AXE SAPPHIRE_AXE JADE_AXE RUBY_AXE COAL_AXE AQUAMARINE_AXE " +
 "FIREFLY WOOD_ARROW STONE_ARROW GOLD_ARROW DIAMOND_ARROW AMETHYST_ARROW REIDITE_ARROW DRAGON_ARROW " +
 "EMERALD_ARROW COPPER_ARROW IRON_ARROW TOPAZ_ARROW SAPPHIRE_ARROW JADE_ARROW RUBY_ARROW COAL_ARROW " +
 "AQUAMARINE_ARROW STONE WOOD PLANT GOLD DIAMOND FIRE WORKBENCH SEED MEAT COOKED_MEAT BIG_FIRE " +
 "FURNACE PAPER AMETHYST AMETHYST_WALL AMETHYST_SPIKE AMETHYST_DOOR BRIDGE SAND BOTTLE_FULL " +
 "randomshit1 randomshit2 BOTTLE_EMPTY KRAKEN_SKIN WATERING_CAN FLOUR WHEAT_SEED COOKIE WILD_WHEAT " +
 "WINDMILL CAKE FOODFISH FOODFISH_COOKED SCALES GROUND PLOT ICE BREAD BREAD_OVEN SANDWICH FUR_WINTER " +
 "BLUE_CORD LOCK DRAGON_HEART LAVA_HEART RESURRECTION EMERALD_MACHINE EXTRACTOR_MACHINE_STONE " +
 "EXTRACTOR_MACHINE_GOLD EXTRACTOR_MACHINE_DIAMOND EXTRACTOR_MACHINE_AMETHYST EXTRACTOR_MACHINE_REIDITE " +
 "EXTRACTOR_MACHINE_EMERALD EXTRACTOR_MACHINE_COPPER EXTRACTOR_MACHINE_IRON EXTRACTOR_MACHINE_TOPAZ " +
 "EXTRACTOR_MACHINE_SAPPHIRE EXTRACTOR_MACHINE_JADE EXTRACTOR_MACHINE_RUBY EXTRACTOR_MACHINE_COAL " +
 "EXTRACTOR_MACHINE_AQUAMARINE LOCKPICK TOTEM SPIKE CORD WALL STONE_WALL GOLD_WALL DIAMOND_WALL " +
 "WOOD_DOOR CHEST STONE_SPIKE GOLD_SPIKE DIAMOND_SPIKE STONE_DOOR GOLD_DOOR DIAMOND_DOOR FUR_WOLF " +
 "GEMME_GREEN GEMME_ORANGE GEMME_BLUE SPECIAL_FUR SPECIAL_FUR_2 BUCKET_FULL BUCKET_EMPTY WELL SIGN " +
 "DRAGON_CUBE DRAGON_ORB LAVA_CUBE LAVA_ORB PUMPKIN_SEED PUMPKIN ROOF GARLIC_SEED GARLIC THORNBUSH_SEED " +
 "THORNBUSH BANDAGE CRAB_STICK CRAB_LOOT BED SUGAR_CAN CANDY GARLAND REIDITE FLAME COPPER IRON TOPAZ " +
 "SAPPHIRE JADE RUBY COAL AQUAMARINE CARROT_SEED CARROT TOMATO_SEED TOMATO WATERMELON_SEED WATERMELON " +
 "ALOE_VERA_SEED ALOE_VERA WOOD_DOOR_SPIKE STONE_DOOR_SPIKE GOLD_DOOR_SPIKE DIAMOND_DOOR_SPIKE " +
 "AMETHYST_DOOR_SPIKE REIDITE_WALL REIDITE_DOOR REIDITE_SPIKE REIDITE_DOOR_SPIKE WOOD_TOWER " +
 "PENGUIN_FEATHER BOAT SLED MOUNT_BOAR CRAB_BOSS BABY_DRAGON BABY_LAVA HAWK PLANE HAWK_FEATHER " +
 "VULTURE_FEATHER CACTUS randomshit3 PITCHFORK_PART PILOT_GLASSES FUR_BOAR SANDWORM_JUICE BABY_MAMMOTH " +
 "FUR_MAMMOTH FUR_CROCODILE PARROT_FEATHER FUR_OCELOT PARROT VULTURE BANANA randomshit4 GOLDEN_HEN"
).split(" ").forEach((n, i) => ITEM[n] = i);

/* ------------------------------------------------ 2. znalezienie bundle gry */
const gameTag = Array.from(document.querySelectorAll("script")).find(s => {
  const u = s.src || "";
  return u.includes("starve.io/js/") && u.includes(".js?v=") &&
         !/\/views\/|token\.js|howler\.js|jquery\.js/.test(u);
});
if (!gameTag) { log("nie znalazlem skryptu gry — wlacz rozszerzenie i odswiez strone", "red"); return; }
const GAME_URL = gameTag.src;
log("bundle gry: " + GAME_URL);

const GAME_SRC = await new Promise((res, rej) => {
  const x = new XMLHttpRequest();
  x.open("GET", GAME_URL, true);
  x.onreadystatechange = () => {
    if (x.readyState !== 4) return;
    (x.status === 200 || x.status === 0) ? res(x.responseText) : rej(new Error("HTTP " + x.status));
  };
  x.send();
});
log("pobrano " + Math.round(GAME_SRC.length / 1024) + " KB");

/* --------------------------------------------- 3. IndexedDB (POPRAWIONE) */
const idb = () => new Promise((res, rej) => {
  const req = indexedDB.open("crackSunrise", 1);
  req.onupgradeneeded = (ev) => {
    const db = ev.target ? ev.target.result : req.result;
    if (!db.objectStoreNames.contains("data")) db.createObjectStore("data");
  };
  req.onsuccess = (ev) => res(ev.target ? ev.target.result : req.result);   // <-- FIX: event, nie request
  req.onerror = () => rej(req.error);
});
const idbGet = async (k) => {
  const db = await idb();
  return new Promise((res) => {
    const r = db.transaction("data", "readonly").objectStore("data").get(k);
    r.onsuccess = (ev) => res((ev.target || r).result);
    r.onerror = () => res(undefined);
  });
};
const idbPut = async (k, v) => {
  const db = await idb();
  return new Promise((res) => {
    const r = db.transaction("data", "readwrite").objectStore("data").put(v, k);
    r.onsuccess = () => res(true);
    r.onerror = () => res(false);
  });
};

/* --------------------------------------------- 4. detekcja propsow z cache */
const VERSION = (GAME_URL.match(/v=(\d+)/) || [])[1] || "0";

function detectProps(ast) {
  const out = ["", "", "", "", ""];
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.type === "SequenceExpression") {
      let cur = null, other = null;
      for (const e of n.expressions) {
        if (e.type === "AssignmentExpression" && e.right && e.right.value === "url('img/cursor1.png'), pointer") cur = e;
        else if (e.type === "AssignmentExpression") other = e;
      }
      if (cur && other && other.left && other.left.property && other.left.property.name) out[0] = other.left.property.name;
    }
    if (n.type === "AssignmentExpression" && n.left && n.left.object && n.left.object.type === "ThisExpression" &&
        n.right && n.right.type === "ArrayExpression" && n.right.elements.length === 9 &&
        n.right.elements.every(e => e && e.type === "ArrayExpression")) out[1] = n.left.property.name;
    if (n.type === "AssignmentExpression" && n.right && n.right.type === "ObjectExpression" &&
        n.left && n.left.object && n.left.object.type === "ThisExpression") {
      for (const p of n.right.properties) {
        const a = p.value && p.value.arguments;
        if (Array.isArray(a) && a.some(x => x && x.value === "commandInput")) { out[2] = n.left.property.name; break; }
      }
    }
    if (n.type === "AssignmentExpression" && n.left && n.left.object && n.left.object.type === "ThisExpression" &&
        n.right && n.right.type === "UnaryExpression" && n.right.argument && n.right.argument.value === 1e6) out[3] = n.left.property.name;
    if (n.type === "AssignmentExpression" && n.right && n.right.type === "ObjectExpression" &&
        n.left && n.left.object && n.left.object.type === "ThisExpression") {
      for (const p of n.right.properties) {
        const a = p.value && p.value.arguments;
        if (Array.isArray(a) && a.some(x => x && x.value === "serverAddressBlock")) { out[4] = n.left.property.name; break; }
      }
    }
    for (const k in n) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") walk(v);
    }
  })(ast);
  return out;
}

let PROPS = null;
const cached = await idbGet("__ClientHandler__");
if (cached && cached.version === VERSION && Array.isArray(cached.props) && cached.props.filter(Boolean).length >= 4) {
  PROPS = cached.props;
  log("props z cache (v" + VERSION + ")");
} else {
  try {
    const t0 = performance.now();
    const min = await window.Terser.minify(GAME_SRC, { compress: { passes: 1 }, mangle: false });
    log("Terser gotowy w " + Math.round(performance.now() - t0) + "ms");
    PROPS = detectProps(window.acorn.parse(min.code, { ecmaVersion: 2022 }));
    if (PROPS.filter(Boolean).length < 4) {
      log("malo propsow ze skompresowanego zrodla — probuje surowe", "orange");
      const alt = detectProps(window.acorn.parse(GAME_SRC, { ecmaVersion: 2022 }));
      PROPS = PROPS.map((p, i) => p || alt[i]);
    }
    await idbPut("__ClientHandler__", { version: VERSION, props: PROPS });
    log("props wykryte: " + JSON.stringify(PROPS));
  } catch (e) { warn("detekcja:", e); PROPS = (cached && cached.props) || null; }
}
if (!PROPS || !PROPS.filter(Boolean).length) { log("nie udalo sie wykryc propsow gry", "red"); return; }

/* ------------------------------ 5. hook Object.prototype (przechwyt instancji) */
const captured = [];
for (const p of PROPS) {
  if (!p) continue;
  const slot = p + "\u200b";
  try {
    Object.defineProperty(Object.prototype, p, {
      configurable: true,
      set(v) { this[slot] = v; captured.push(this); },
      get() { return this[slot]; }
    });
  } catch (e) {}
}
const _keys = Object.keys;
Object.keys = (o) => (o === null || o === undefined) ? [] : _keys(o);
Object.keys.toString = () => "function keys() { [native code] }";

/* ---------------------------------------------- 6. pomocnicze do mapowania */
const assigned = [], assignLog = [];
const countCalls = s => (s.replace(/function\s*\(\s*\)\s*{/g, "").match(/[^\s()]+\s*\(\s*\)/g) || []).length;
const unesc = s => s.replace(/\\(\d{1,3})/g, (m, d) => String.fromCharCode(parseInt(d, 8)))
                    .replace(/\\x([0-9A-Fa-f]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
                    .replace(/\\u([\dA-Fa-f]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
const strings = s => { const r = /['"`]([^'"`]+)['"`]/g, o = []; let m; while ((m = r.exec(s))) o.push(m[1]); return o; };
const shape = (a, b) => (typeof a === "object" && a !== null) &&
  Object.keys(b).every(k => (k in a) && (b[k] === "any" ? true : typeof a[k] === typeof b[k]));
const lenOf = o => Array.isArray(o) ? o.length : Object.keys(o).length;
const counts = s => ({ semi: (s.match(/;/g) || []).length, slash: (s.match(/\//g) || []).length, eq: (s.match(/=/g) || []).length });
const sim = (a, b) => { const x = counts(a), y = counts(b); const n = (x.semi === y.semi) + (x.slash === y.slash) + (x.eq === y.eq); const p = n / 3 * 100; return p === 100 ? 100 : p >= 66 ? 66 : 33; };
const lines = s => { try { return window.js_beautify(s).split("\n").length; } catch (e) { return s.split("\n").length; } };
const def = (dst, name, src, key) => Object.defineProperty(dst, name, {
  configurable: true, get() { return src[key]; }, set(v) { src[key] = v; }
});

function assign(prefix, src, dst, name, type, spec, fnLen, callCnt, lineCnt, mustInc, refSrc, pick) {
  let hit = 0;
  const keys = Object.keys(src);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i], val = src[key];
    if (src[name]) { assigned.push(prefix + name); return; }
    if (typeof type === "function" && typeof val === "function" && !assigned.includes(prefix + key)) {
      if (lineCnt && lines(val.toString()) !== lineCnt && lineCnt !== "any") continue;
      let strs = strings(unesc(val.toString()));
      if (strs.join("").length > 300 || !strs.length) strs = [];
      const kw = (Array.isArray(spec) ? spec : []).some(k => strs.some(s => s.includes(k))) || (strs.length && spec[0] === "any");
      const inc = mustInc === "any" || val.toString().includes(mustInc);
      if ((mustInc === "any" || !mustInc || mustInc === "none" || inc) &&
          (kw || (!spec[0] && kw === 0)) &&
          (val.length === fnLen || fnLen === "any") &&
          (((callCnt || callCnt === 0) && countCalls(val.toString()) === callCnt) || (!callCnt && callCnt !== 0) || callCnt === "any") &&
          (!refSrc || sim(refSrc.toString(), val.toString()) >= 100)) {
        def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
      }
    } else if (Array.isArray(val) && Array.isArray(type) && (lenOf(val) === spec || spec === "any") && !assigned.includes(prefix + key)) {
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    } else if (!Array.isArray(type) && typeof type === "object" && type !== null && !Array.isArray(val) &&
               typeof val === "object" && val !== null && shape(val, type) && (lenOf(val) === spec || spec === "any") && !assigned.includes(prefix + key)) {
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    } else if (typeof type === "boolean" && typeof val === "boolean" && val === type && !assigned.includes(prefix + key)) {
      if (pick) { hit++; if (pick !== hit) continue; }
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    } else if (typeof type === "number" && typeof val === "number" && val === type && val === spec && !assigned.includes(prefix + key)) {
      if (pick) { hit++; if (pick !== hit) continue; }
      def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, fnLen]); return;
    }
  }
}
function assignIdx(prefix, src, dst, name, index) {
  if (src[name]) return;
  let i = 0;
  for (const key in src) {
    if (i === index) { def(dst, name, src, key); assigned.push(prefix + key); assignLog.push([prefix + name, index]); return; }
    i++;
  }
}
const idx = (prefix, name) => { for (const [k, v] of assignLog) if (k === prefix + name) return v; return null; };

/* ============================================================== SETTINGS */
function cookie(name) {
  const d = decodeURIComponent(document.cookie).split("; ");
  for (const c of d) if (c.indexOf(name + "=") === 0) return c.substring(name.length + 1);
  return "";
}
function setCookie(name, val, days = 7) {
  const dt = new Date(); dt.setTime(dt.getTime() + days * 864e5);
  document.cookie = name + "=" + encodeURIComponent(val) + "; expires=" + dt.toUTCString() + "; path=/";
}
const S = {
  darkMode: 0, putToChest: 10, pingDisplay: 1, fpsDisplay: 1, gaugeTimer: 1, gaugePercentages: 1,
  boxInfo: 1, fireInfo: 1, timePlayed: { active: 1, start: 0, resetClock: true }, daysAlive: 1,
  chestInfo: { texture: "Bright", active: 1 }, playerTimers: "Enemys", smoothRoofs: 1, joinsLeaves: 1,
  menuOpacity: .5, buildingInfo: 1, playersOnTop: 1, treasureChestOnTop: 1,
  skinChanger: { active: 0, skin: 0 }, bagChanger: { active: 0, bag: 0 }, bookChanger: { active: 0, book: 0 },
  accChanger: { active: 0, acc: 0 }, totemOnMap: { active: 1, x: 0, y: 0 }, deathOnMap: { active: 1, x: 0, y: 0 },
  drawLeaderboardAllies: 1, ZmaAutoCrown: 1, playerTracers: 1, ColoredSpikes: { texture: "Light", active: 1 },
  vehicleOpacity: .5, listEnabledHacks: { mode: "Bottom Left" }, movementPredictor: 1, blizzardAndSandstorm: 1,
  Debugger: { mode: "None" }, equipAfterPlace: { active: 1 }, Spectator: { bind: "KeyV", speed: 25, active: 0 },
  DropSword: { bind: "Backquote" }, Roof: { active: 1, opacity: .5 }, Hidden: { active: false, bind: "NONE" },
  AutoSteal: { active: false, bind: "KeyQ" }, AutoCraft: { active: false, bind: "KeyC" },
  AutoExtPut: { active: false, bind: "NONE" }, AutoExtTake: { active: false, bind: "NONE" },
  AutoBreadTake: { active: false, bind: "NONE" }, AutoBreadPut: { active: false, bind: "NONE" },
  AutoRecycle: { active: false, bind: "KeyE" },
  SmartCraft: { active: false, option: "Gold Spikes", amount: 10, bind: "NONE" },
  Xray: { active: true, opacity: .5, bind: "KeyZ" }, AutoWall: { active: false, mode: "Normal", bind: "Space" },
  AutoSpike: { active: false, mode: "Normal", bind: "KeyF", speed: 4 }, AutoCrown: { active: false, bind: "NONE" },
  AutoTotem: { active: false, bind: "KeyT" }, AutoBuild: { active: false, bind: "KeyB", mode: "Bridges" },
  AutoFire: { active: false, bind: "NONE" },
  Aimbot: { active: false, bind: "Numpad1", angle: 0, mode: "Only Attack", rangeVisual: 0, BowRange: 300 },
  AutoIce: { active: 1 }, AutoFurnace: { active: 0, bind: "NONE" }, AutoRespawn: { active: 1 },
  AutoBook: { active: 1 }, ZmaAutoBottle: { enabled: 0, health: 30 },
  AutoEmerald: { active: false, bind: "KeyM", angle: 0 }, AutoTame: { active: false, bind: "NONE", angle: 0 },
  AutoLand: { active: 0 }, AutoHat: { active: 0 }, AutoDiving: { active: 0 }, AutoUnlock: { active: 0 },
  AutoSeed: { active: 0 },
  AutoFarm: { active: false, bind: "KeyH", angle: 0, TLX: 0, TLY: 0, BRX: 0, BRY: 0, SX: 0, SY: 0, whitelist: "" },
  PathFinder: { active: false, bind: "KeyP", End: { x: -1, y: -1 }, inventory: 1, lastKit: 0 },
  Translation: { recievedLang: "English (American)", sentLang: "English (American)", translateSent: 0, translateRecieved: 1 },
  ZmaRedGold: { active: false, bind: "NONE" },
  Tracers: { Krakens:0, Sandworms:0, BabyDragons:0, BabyLavaDragons:0, BabyMammoths:0, Bears:0, Boars:0, Crabs:0,
             Dragons:0, FireMobs:0, Foxes:0, Hawks:0, KingCrabs:0, LavaDragons:0, Mammoths:0, Penguins:0,
             Piranhas:0, Rabbits:0, Spiders:0, Vultures:0, Wolfs:0, GoldenHens:0, GoldenChickens:0, Ocelots:0,
             Crocodiles:0, Parrots:0 },
  canvasBrightness: 1, localToken: { Token: cookie("starve_token"), TokenID: cookie("starve_token_id") },
  showLeaderBoardLevels: 1, increasedZoom: "Auto",
  market: { wood: 0, stone: 0, gold: 0, diamond: 0, amethyst: 0, reidite: 0 },
  tokenHolder: { autofarm:0, autoseed:0, autocraft:0, autorecycle:0, craftId:0, recycleId:0, seedToPlace:0, bluecrown:0 }
};

function flatPair(o, path = [], out = []) {
  for (const k in o) {
    const v = o[k], p = [...path, k];
    if (typeof v === "object" && v !== null && !Array.isArray(v)) flatPair(v, p, out);
    else out.push([p.join("."), v]);
  }
  return out;
}
function setPath(path, val) {
  const parts = path.split("."), last = parts.pop();
  const o = parts.reduce((a, k) => a && a[k], S);
  if (o && last in o) o[last] = val;
}
const save = () => { try { localStorage.setItem("settings_all", JSON.stringify(flatPair(S))); } catch (e) {} };

/* --- skroty GUI (MUSZA byc przed guiConfig!) --- */
const cb  = (label, obj, prop, onChange) => ({ type: "checkbox", label, object: obj, property: prop, onChange });
const rng = (label, obj, prop, min, max, step, onChange) => ({ type: "range", label, object: obj, property: prop, min, max, step, onChange });
const sel = (label, obj, prop, options, onChange) => ({ type: "select", label, object: obj, property: prop, options, onChange });
const bind = (label, obj) => ({ type: "bind", label, buttonTextObject: obj, buttonTextProperty: "bind" });
const btn = (label, action) => ({ type: "button", label, action });
const txt = (label, obj, prop) => ({ type: "text", label, object: obj, property: prop });
const sub = (label, subfolder) => ({ type: "subfolder", label, subfolder });

const LANGS = ["Arabic","Bulgarian","Czech","Danish","German","Greek","English (British)","English (American)",
  "Spanish","Estonian","Finnish","French","Hungarian","Indonesian","Italian","Japanese","Korean","Lithuanian",
  "Latvian","Norwegian Bokmål","Dutch","Polish","Portuguese (Brazilian)","Portuguese (Other)","Romanian",
  "Russian","Slovak","Slovenian","Swedish","Turkish","Ukrainian","Chinese (Simplified)","Chinese (Traditional)"];

function tracersFolder() {
  const g = (n, list) => sub(n, list.map(([key, label]) => cb(label, S.Tracers, key)));
  return [ g("Forest", [["Boars","Boars"],["GoldenChickens","Golden Chickens"],["GoldenHens","Golden Hens"],["Hawks","Hawks"],["Rabbits","Rabbits"],["Spiders","Spiders"],["Wolfs","Wolfs"]]),
           g("Jungle", [["Ocelots","Ocelots"],["Crocodiles","Crocodiles"],["Parrots","Parrots"]]),
           g("Lava", [["BabyLavaDragons","Baby Lava Dragons"],["FireMobs","Fire Mobs"],["LavaDragons","Lava Dragons"]]),
           g("Ocean", [["Krakens","Krakens"],["Piranhas","Piranhas"]]),
           g("Sand", [["Sandworms","Sand Worms"],["Crabs","Crabs"],["KingCrabs","King Crabs"],["Vultures","Vultures"]]),
           g("Winter", [["BabyDragons","Baby Dragons"],["BabyMammoths","Baby Mammoths"],["Bears","Bears"],["Dragons","Dragons"],["Foxes","Foxes"],["Mammoths","Mammoths"],["Penguins","Penguins"]]) ];
}

const guiConfig = {
  title: "Void V7 Reborn", align: "right", toggleGuiKey: "NONE", toggleGuiButton: true, draggable: true,
  fontSize: 18, opacity: .85, width: 880, height: 630,
  folders: {
    Visuals: [
      cb("Dark Mode", S, "darkMode", afterTexture), cb("Fps", S, "fpsDisplay"), cb("Ping", S, "pingDisplay"),
      cb("Days Alive", S, "daysAlive"), cb("Time Played", S.timePlayed, "active"), cb("Timer", S, "gaugeTimer"),
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
      sub("Chests", [ cb("Chest Info", S.chestInfo, "active"), sel("Chest Textures", S.chestInfo, "texture", ["Bright","Light","Dark"], afterTexture) ]),
      sub("Spikes", [ cb("Colored Spikes", S.ColoredSpikes, "active"), sel("Spike Textures", S.ColoredSpikes, "texture", ["Light","Dark"], reloadTextures) ]),
      sub("Roofs", [ cb("Smooth Roofs", S, "smoothRoofs"), cb("Opaque Roofs", S.Roof, "active"), rng("Roofs Opacity", S.Roof, "opacity", .1, 1, .1) ]),
      sub("Opacitys", [ rng("Vehicles Opacity", S, "vehicleOpacity", .1, 1, .1), rng("Menus Opacity", S, "menuOpacity", .1, 1, .1, applyMenuOpacity) ]),
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
        sel("Craft Mode", S.SmartCraft, "option", ["Reidite Spike Doors","Amethyst Spike Doors","Reidite Walls","Reidite Spikes","Amethyst Spikes","Diamond Spikes","Gold Spikes","Reidite Swords","Reidite Spears","Reidite Helmets","Reidite Shields"]),
        rng("Craft Amount", S.SmartCraft, "amount", 1, 1000, 1) ])
    ],
    Spiking: [
      sub("Auto Spike Settings", [ bind("AutoSpike Key:", S.AutoSpike), sel("AutoSpike Mode", S.AutoSpike, "mode", ["Normal","Hidden"]) ]),
      sub("Auto Wall Settings", [ bind("AutoWall Key:", S.AutoWall), sel("AutoWall Mode", S.AutoWall, "mode", ["Normal","Hidden"]) ]),
      rng("Hidden Speed", S.AutoSpike, "speed", 0, 10, 1)
    ],
    Farming: [
      sub("Auto Farm Settings", [ cb("AutoFarm", S.AutoFarm, "active"), bind("AutoFarm Key:", S.AutoFarm),
        btn("Top left of farm", () => { const p = me(); if (p) { S.AutoFarm.TLX = p.x; S.AutoFarm.TLY = p.y; } save(); }),
        btn("Bottom right of farm", () => { const p = me(); if (p) { S.AutoFarm.BRX = p.x; S.AutoFarm.BRY = p.y; } save(); }),
        btn("Safe Point", () => { const p = me(); if (p) { S.AutoFarm.SX = p.x; S.AutoFarm.SY = p.y; } save(); }),
        txt("Whitelist Ids", S.AutoFarm, "whitelist") ]),
      cb("Auto Emerald", S.AutoEmerald, "active")
    ],
    Pathfind: [
      sub("Pathfinder Settings", [ cb("Pathfinder", S.PathFinder, "active"), cb("Give To Chest", S.PathFinder, "inventory"),
        cb("Claim Previous Kit", S, "lastKit"), bind("Pathfinder Key:", S.PathFinder),
        txt("Path X", S.PathFinder.End, "x"), txt("Path Y", S.PathFinder.End, "y"),
        btn("Set Pathfinder Location", () => { const p = me(); if (p) { S.PathFinder.End.x = Math.floor(p.x/100); S.PathFinder.End.y = Math.floor(p.y/100); } save(); }) ])
    ],
    ZMA: [
      cb("Auto Crown", S, "ZmaAutoCrown"),
      sub("ZMA Resource Settings", [ cb("Reidite To Chest", S.ZmaRedGold, "active"), bind("Key:", S.ZmaRedGold) ]),
      sub("Auto Bottle Settings", [ cb("Auto Bottle", S.ZmaAutoBottle, "enabled"), rng("Health", S.ZmaAutoBottle, "health", 10, 90, 1) ])
    ],
    Translate: [
      sub("Translate Your Messages", [ cb("Your Messages", S.Translation, "translateSent"), sel("Translate To Language", S.Translation, "sentLang", LANGS) ]),
      sub("Translate Others Messages", [ cb("Others Messages", S.Translation, "translateRecieved"), sel("Translate To Language", S.Translation, "recievedLang", LANGS) ])
    ],
    Token: [
      txt("Token", S.localToken, "Token"), txt("Token ID", S.localToken, "TokenID"),
      btn("Generate Kit Token", () => { const t = randStr(14); S.localToken.Token = t; setCookie("starve_token", t); save(); }),
      btn("Copy Token", () => prompt("Copy", "Token: " + S.localToken.Token + "\nTokenID: " + S.localToken.TokenID)),
      btn("Back To Lobby", backToLobby)
    ],
    Binds: [
      bind("Spectator Key:", S.Spectator), bind("DropSword Key:", S.DropSword), bind("Xray Key:", S.Xray),
      bind("Hide Script Key:", S.Hidden), bind("AutoTame Key:", S.AutoTame), bind("Aimbot Key:", S.Aimbot),
      bind("AutoFire Key:", S.AutoFire), bind("AutoBuild Key:", S.AutoBuild), bind("AutoCrown Key:", S.AutoCrown),
      bind("AutoTotem Key:", S.AutoTotem), bind("AutoSteal Key:", S.AutoSteal), bind("Bread Take Key:", S.AutoBreadTake),
      bind("Bread Put Key:", S.AutoBreadPut), bind("AutoEmerald Key:", S.AutoEmerald),
      bind("Extractor Take Key:", S.AutoExtTake), bind("Extractor Put Key:", S.AutoExtPut), bind("AutoFurnace:", S.AutoFurnace)
    ],
    Player: [
      sub("Skin", [ cb("Skin Changer", S.skinChanger, "active", () => refreshSkin("skin")), rng("Skin ID", S.skinChanger, "skin", 0, 270, 1, () => refreshSkin("skin")) ]),
      sub("Accessories", [ cb("Accessories Changer", S.accChanger, "active", () => refreshSkin("acc")), rng("Accessories ID", S.accChanger, "acc", 0, 120, 1, () => refreshSkin("acc")) ]),
      sub("Bag", [ cb("Bag Changer", S.bagChanger, "active", () => refreshSkin("bag")), rng("Bag ID", S.bagChanger, "bag", 0, 81, 1, () => refreshSkin("bag")) ]),
      sub("Book", [ cb("Book Changer", S.bookChanger, "active", () => refreshSkin("book")), rng("Book ID", S.bookChanger, "book", 0, 49, 1, () => refreshSkin("book")) ]),
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

/* ------------------------------------------------------------- GUI klasa */
const xor = (s) => Array.from(s).map(c => String.fromCharCode(c.charCodeAt(0) ^ 1410065407)).join("");

class Gui {
  constructor(cfg) { this.cfg = cfg; this.container = null; this.folderBtns = []; this.content = null; }
  saveGui() { localStorage.setItem("guiSettings", JSON.stringify([this.cfg.align, this.cfg.toggleGuiKey, this.cfg.toggleGuiButton, this.cfg.draggable, this.cfg.fontSize, this.cfg.opacity, this.cfg.width, this.cfg.height])); }
  build() {
    if (this.container) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+Paaji&display=swap";
    document.head.appendChild(link);
    this._build();
  }
  _build() {
    if (this.container) return;
    const c = document.createElement("div");
    this.container = c; c.id = xor("voidGui");
    Object.assign(c.style, { position: "fixed", width: this.cfg.width + "px", height: this.cfg.height + "px",
      background: "rgb(20,20,20)", border: "8px solid rgb(20,20,20)", borderRadius: "8px", zIndex: 9999,
      boxShadow: "0 6px 12px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", boxSizing: "border-box",
      opacity: this.cfg.opacity, cursor: "grab", fontFamily: "Baloo Paaji, sans-serif", userSelect: "none" });
    this._place(c, this.cfg.align);
    document.body.appendChild(c);

    const title = document.createElement("div");
    title.textContent = this.cfg.title;
    Object.assign(title.style, { color: "#fff", fontSize: this.cfg.fontSize + 8 + "px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" });
    c.appendChild(title);
    const cbtn = document.createElement("button");
    cbtn.textContent = "Customise";
    Object.assign(cbtn.style, { background: "rgb(45,45,45)", color: "#fff", border: "none", borderRadius: "5px", padding: "6px 12px", cursor: "pointer", marginLeft: "auto", fontSize: this.cfg.fontSize + "px" });
    title.appendChild(cbtn);

    const main = document.createElement("div");
    Object.assign(main.style, { display: "flex", height: this.cfg.height - 85 + "px", borderRadius: "15px" });
    c.appendChild(main);
    const sidebar = document.createElement("div");
    Object.assign(sidebar.style, { width: "35%", color: "#fff", background: "rgb(30,30,30)", borderRadius: "8px", overflowY: "auto", padding: "8px", fontSize: this.cfg.fontSize + 6 + "px", display: "flex", flexDirection: "column", gap: "10px" });
    main.appendChild(sidebar);
    const content = document.createElement("div");
    this.content = content;
    Object.assign(content.style, { width: "65%", background: "rgb(30,30,30)", color: "#fff", padding: "8px", overflowY: "auto", display: "flex", flexDirection: "column", borderRadius: "12px" });
    main.appendChild(content);

    Object.keys(this.cfg.folders).forEach(name => {
      const b = document.createElement("button");
      b.textContent = name;
      Object.assign(b.style, { background: "rgb(51,51,51)", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontSize: this.cfg.fontSize + 6 + "px" });
      b.onclick = () => { this.renderFolder(name); this.folderBtns.forEach(x => x.style.outline = ""); b.style.outline = "2px solid #888"; b.blur(); };
      sidebar.appendChild(b); this.folderBtns.push(b);
    });
    this._drag(c, title);
    this._customise();
    cbtn.onclick = () => this.overlay.style.display = "flex";
    document.addEventListener("keydown", e => { if (this.cfg.toggleGuiKey !== "NONE" && e.code === this.cfg.toggleGuiKey) this.toggle(); });
    const first = Object.keys(this.cfg.folders)[0];
    if (first) this.renderFolder(first);
  }
  _place(el, align) {
    el.style.top = align === "center" ? "50%" : "0%";
    el.style.left = align === "left" ? "0%" : align === "right" ? "auto" : "50%";
    if (align === "right") el.style.right = "0%";
    el.style.transform = align === "center" ? "translate(-50%,-50%)" : "";
  }
  _drag(el, handle) {
    let on = false, ox = 0, oy = 0;
    handle.addEventListener("mousedown", e => { if (e.target.tagName === "BUTTON") return; on = true; ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; });
    document.addEventListener("mousemove", e => { if (on) { el.style.left = e.clientX - ox + "px"; el.style.top = e.clientY - oy + "px"; el.style.transform = ""; } });
    document.addEventListener("mouseup", () => on = false);
  }
  toggle() { const g = $(xor("voidGui")); if (g) g.style.display = g.style.display === "none" ? "flex" : "none"; }
  _customise() {
    const o = document.createElement("div"); this.overlay = o;
    Object.assign(o.style, { position: "fixed", inset: "0", background: "rgba(0,0,0,.5)", zIndex: 10000, display: "none", alignItems: "center", justifyContent: "center" });
    const box = document.createElement("div");
    Object.assign(box.style, { background: "rgb(30,30,30)", padding: "20px", borderRadius: "12px", color: "#fff", width: "420px" });
    o.appendChild(box);
    const mk = (label, min, max, step, get, set) => {
      const row = document.createElement("div"); row.style.marginBottom = "10px";
      const l = document.createElement("div"); l.textContent = label; l.style.fontSize = "13px";
      const i = document.createElement("input"); i.type = "range"; i.min = min; i.max = max; i.step = step; i.value = get(); i.style.width = "100%";
      i.oninput = () => set(Number(i.value));
      row.appendChild(l); row.appendChild(i); box.appendChild(row);
    };
    mk("Width", 400, 1000, 10, () => this.cfg.width, v => { this.cfg.width = v; this.container.style.width = v + "px"; });
    mk("Height", 300, 1000, 10, () => this.cfg.height, v => { this.cfg.height = v; this.container.style.height = v + "px"; });
    mk("Font Size", 10, 18, 1, () => this.cfg.fontSize, v => { this.cfg.fontSize = v; });
    mk("Opacity", .1, 1, .01, () => this.cfg.opacity, v => { this.cfg.opacity = v; this.container.style.opacity = v; });
    const al = document.createElement("select");
    ["left","center","right"].forEach(v => al.appendChild(new Option(v, v)));
    al.value = this.cfg.align; al.onchange = () => { this.cfg.align = al.value; this._place(this.container, al.value); };
    box.appendChild(al);
    const close = document.createElement("button");
    close.textContent = "Close";
    Object.assign(close.style, { marginTop: "14px", padding: "8px 16px", background: "#444", color: "#fff", border: "0", borderRadius: "6px", cursor: "pointer" });
    close.onclick = () => { o.style.display = "none"; this.saveGui(); };
    box.appendChild(close);
    document.body.appendChild(o);
  }
  renderFolder(name) {
    const c = this.content; c.innerHTML = "";
    const h = document.createElement("div");
    h.textContent = name;
    Object.assign(h.style, { color: "#fff", fontSize: this.cfg.fontSize + 4 + "px", padding: "8px 12px", background: "#333", borderRadius: "5px", marginBottom: "8px" });
    c.appendChild(h);
    (this.cfg.folders[name] || []).forEach(item => {
      if (item.type === "subfolder") {
        const wrap = document.createElement("div");
        Object.assign(wrap.style, { background: "#2a2a2a", borderRadius: "4px", marginBottom: "4px" });
        const head = document.createElement("div"); head.textContent = item.label;
        Object.assign(head.style, { color: "#fff", padding: "6px 10px", cursor: "pointer", fontSize: this.cfg.fontSize + 2 + "px" });
        const body = document.createElement("div"); body.style.display = "none"; body.style.padding = "6px 10px";
        head.onclick = () => body.style.display = body.style.display === "none" ? "block" : "none";
        wrap.appendChild(head); wrap.appendChild(body); c.appendChild(wrap);
        (item.subfolder || []).forEach(si => this._item(body, si, 1));
      } else this._item(c, item, 0);
    });
  }
  _item(root, item, indent) {
    const row = document.createElement("div");
    Object.assign(row.style, { display: "flex", alignItems: "center", background: "#2a2a2a", padding: "3px 10px", borderRadius: "4px", marginBottom: "4px", marginLeft: indent ? "14px" : "0", gap: "6px" });
    const lbl = document.createElement("span");
    lbl.textContent = item.label;
    Object.assign(lbl.style, { color: "#fff", flexGrow: 1, fontSize: this.cfg.fontSize + "px" });
    row.appendChild(lbl);
    const val = () => item.property ? item.object[item.property] : item.object;
    const setv = v => { if (item.property) item.object[item.property] = v; else item.object = v; if (item.onChange) item.onChange(v); save(); };

    if (item.type === "checkbox") {
      const i = document.createElement("input"); i.type = "checkbox"; i.checked = !!val();
      i.onchange = () => setv(Number(i.checked)); row.appendChild(i);
    } else if (item.type === "range") {
      const i = document.createElement("input"); i.type = "range"; i.min = item.min; i.max = item.max; i.step = item.step || 1; i.value = val();
      const n = document.createElement("input"); n.type = "number"; n.min = item.min; n.max = item.max; n.step = item.step || 1; n.value = val(); n.style.width = "70px";
      i.oninput = () => n.value = i.value; i.onchange = () => setv(Number(i.value));
      n.onchange = () => { i.value = n.value; setv(Number(n.value)); };
      row.appendChild(i); row.appendChild(n);
    } else if (item.type === "select") {
      const s = document.createElement("select"); s.style.background = "#444"; s.style.color = "#fff";
      (item.options || []).forEach(o => s.appendChild(new Option(o, o)));
      s.value = val(); s.onchange = () => setv(s.value); row.appendChild(s);
    } else if (item.type === "text") {
      const i = document.createElement("input"); i.type = "text"; i.value = val(); i.style.background = "#444"; i.style.color = "#fff"; i.style.width = "120px";
      i.onchange = () => setv(i.value); row.appendChild(i);
    } else if (item.type === "bind") {
      const b = document.createElement("button");
      b.textContent = item.buttonTextObject[item.buttonTextProperty] || "NONE";
      Object.assign(b.style, { background: "#444", color: "#fff", border: "0", borderRadius: "4px", padding: "2px 10px", cursor: "pointer" });
      b.onclick = () => {
        b.textContent = "Press key... (Esc = NONE)"; b.blur();
        const h = e => {
          item.buttonTextObject[item.buttonTextProperty] = e.code === "Escape" ? "NONE" : e.code;
          b.textContent = item.buttonTextObject[item.buttonTextProperty];
          document.removeEventListener("keydown", h); save(); b.blur();
        };
        document.addEventListener("keydown", h);
      };
      row.appendChild(b);
    } else if (item.type === "button") {
      const b = document.createElement("button"); b.textContent = "Run";
      Object.assign(b.style, { background: "#444", color: "#fff", border: "0", borderRadius: "4px", padding: "2px 14px", cursor: "pointer" });
      b.onclick = () => { item.action && item.action(); b.blur(); }; row.appendChild(b);
    }
    root.appendChild(row);
  }
}
let gui = null;
function applyBrightness() { const c = $("game_canvas"); if (c) c.style.filter = "brightness(" + S.canvasBrightness + ")"; }
function applyMenuOpacity() {
  ["shop_market","option_in_game","sure_delete","cancel_sure_delete","shop_starterkit","recipe_craft","home_craft","chronoquest","sign_window","team_box"]
    .forEach(id => { const e = $(id); if (e) e.style.opacity = S.Hidden.active ? 1 : S.menuOpacity; });
}
function afterTexture() {
  if (S.darkMode) { S.ColoredSpikes.texture = "Dark"; S.chestInfo.texture = "Dark"; }
  else { S.ColoredSpikes.texture = "Light"; S.chestInfo.texture = "Light"; }
  reloadTextures();
}

/* -------------------------------------- wlasne tekstury spike/door (Void) */
const TEX_BASE = "https://raw.githubusercontent.com/shwtdev/Void_V6/refs/heads/main/";
const TEX = {
  Light: { WOOD_SPIKE_ALLY:"69",STONE_SPIKE_ALLY:"65",GOLD_SPIKE_ALLY:"54",DIAMOND_SPIKE_ALLY:"38",AMETHYST_SPIKE_ALLY:"3",REIDITE_SPIKE_ALLY:"58",
           WOOD_SPIKE_ENEMY:"72",STONE_SPIKE_ENEMY:"68",GOLD_SPIKE_ENEMY:"57",DIAMOND_SPIKE_ENEMY:"41",AMETHYST_SPIKE_ENEMY:"6",REIDITE_SPIKE_ENEMY:"61",
           WOOD_DOOR_ALLY:"53",STONE_DOOR_ALLY:"50",GOLD_DOOR_ALLY:"47",DIAMOND_DOOR_ALLY:"45",AMETHYST_DOOR_ALLY:"42",REIDITE_DOOR_ALLY:"49",
           WOOD_DOOR_ENEMY:"52",STONE_DOOR_ENEMY:"51",GOLD_DOOR_ENEMY:"46",DIAMOND_DOOR_ENEMY:"44",AMETHYST_DOOR_ENEMY:"43",REIDITE_DOOR_ENEMY:"48" },
  Dark:  { WOOD_SPIKE_ALLY:"34",STONE_SPIKE_ALLY:"30",GOLD_SPIKE_ALLY:"22",DIAMOND_SPIKE_ALLY:"17",AMETHYST_SPIKE_ALLY:"13",REIDITE_SPIKE_ALLY:"26",
           WOOD_SPIKE_ENEMY:"37",STONE_SPIKE_ENEMY:"33",GOLD_SPIKE_ENEMY:"25",DIAMOND_SPIKE_ENEMY:"21",AMETHYST_SPIKE_ENEMY:"16",REIDITE_SPIKE_ENEMY:"29",
           WOOD_DOOR_ALLY:"53",STONE_DOOR_ALLY:"50",GOLD_DOOR_ALLY:"47",DIAMOND_DOOR_ALLY:"45",AMETHYST_DOOR_ALLY:"42",REIDITE_DOOR_ALLY:"49",
           WOOD_DOOR_ENEMY:"52",STONE_DOOR_ENEMY:"51",GOLD_DOOR_ENEMY:"46",DIAMOND_DOOR_ENEMY:"44",AMETHYST_DOOR_ENEMY:"43",REIDITE_DOOR_ENEMY:"48" }
};
const texCache = {};
function tex(key) {
  if (!key) return null;
  if (!texCache[key]) { texCache[key] = new Image(); texCache[key].src = TEX_BASE + key + ".png"; }
  return texCache[key];
}
function reloadTextures() { /* tekstury leniwe, wystarczy przeladowac klucze */ for (const k in texCache) delete texCache[k]; }

/* ============================================================ STAN / MAPY */
const CL = {}, GD = {}, UI = {}, WD = {}, UD = {}, MS = {};
Object.defineProperties(window, { v2600:{get:()=>CL}, v2601:{get:()=>GD}, v2602:{get:()=>UI}, v2603:{get:()=>WD}, v2604:{get:()=>UD}, v2605:{get:()=>MS} });
let CLIENT=null, WORLD=null, USER=null, GAME=null, OPTS=null;
let installed = false, wsReady = false, mapW = 0, mapH = 0, pingSent = 0, pingText = 0, lastGaugeT = Date.now();

function pickObjects() {
  if (!CLIENT) CLIENT = captured.find(o => o && (o.connect || o.message || o.ping || o.timeout));
  if (!WORLD)  WORLD  = captured.find(o => o && (o.w || o.transition) && (o.units || o.fast_units));
  if (!GAME)   GAME   = captured.find(o => o && (o.waiting || o.buttons || o.unlock));
  if (!USER)   USER   = captured.find(o => o && (o.alert || o.beta || o.control));
  if (!OPTS)   OPTS   = captured.find(o => o && o.options);
  return !!(CLIENT && WORLD && GAME && USER && OPTS);
}

function mapAll() {
  const F = function () {};
  /* CLIENT */
  assignIdx("client", CLIENT, CL, "websocket", 0);
  assign("client", CLIENT, CL, "WRZ", F, [], 0, 3, "any", "waiting");
  assign("client", CLIENT, CL, "WSA", F, [], 1, 0, 3, "none", "function(bandage){hiddenUser.bandage=bandage;}");
  assign("client", CLIENT, CL, "WSB", F, [], 1, 0, 3, "none", "function(blizzard){hiddenUser.blizzard=blizzard;}");
  assign("client", CLIENT, CL, "WSC", F, [], 1, 0, 3, "none", "function(msg){this.new_alert(msg);}");
  assign("client", CLIENT, CL, "WSD", F, [], 1, 0, 4, "none", "function(id){hiddenUser.auto_feed.delay=0;hiddenUser.craft.do_recycle(id);}");
  assign("client", CLIENT, CL, "WSE", F, [], 1, 0, 4, "none", "function(id){hiddenUser.auto_feed.delay=0;hiddenUser.craft.do_craft(id);}");
  assign("client", CLIENT, CL, "WSG", F, [], 0, 0, 3, "stringify", "function(){this.socket[SENDWORD](WINDOW1[JSONWORD1].stringify([11]));}");
  assign("client", CLIENT, CL, "WSH", F, [], 0, 0, 3, "EMPTY", "function(){this.new_alert(LANG[TEXT.EMPTY]);}");
  assign("client", CLIENT, CL, "WSI", F, [], 1, 0, 4, "stringify", "function(id){this.socket[SENDWORD](WINDOW3[JSONWORD7].stringify([21,id]));hiddenUser.shop.open=false;}");
  assign("client", CLIENT, CL, "WSJ", F, [], 7, 0, 9, "none");
  assign("client", CLIENT, CL, "WSK", F, [], 1, 0, 5, "none", "function(d){hiddenWorld.time=d;hiddenWorld.transition=true;audio.transition=1;}");
  assign("client", CLIENT, CL, "WSL", F, [], 1, 0, 4, "mode");
  assign("client", CLIENT, CL, "WSM", F, [], 1, 0, 4, "Uint16Array", "function(data){let ui16=new Uint16Array(data);player.cam.change(ui16[1],ui16[2]);}");
  assign("client", CLIENT, CL, "WSN", F, [], 1, 0, 4, "Uint16Array", "function(data){let ui16=new Uint16Array(data);hiddenUser.cam.change(ui16[1],ui16[2]);}");
  assign("client", CLIENT, CL, "WSO", F, [], 0, 0, 3, "stringify", "function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([17,hiddenUser.resurrection.pid,hiddenUser.resurrection.iid,]));}");
  assign("client", CLIENT, CL, "WSP", F, [], 2, 0, 3, "stringify", "function(windmill,n){this.socket[SENDWORD](WINDOW2[JSONWORD4].stringify([22,n,windmill.pid,windmill.iid]));}");
  assignIdx("client", CLIENT, CL, "WSR", idx("client","WSP") + 1);
  assign("client", CLIENT, CL, "WSS", F, [], 1, 0, 3, "stringify", "function(bread_oven){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([26,bread_oven.pid,bread_oven.iid]));}");
  assign("client", CLIENT, CL, "WSQ", F, [], 1, 0, 3, "stringify", "function(quest){this.socket[SENDWORD](WINDOW5[JSONWORD8].stringify([27,quest]));}");
  assign("client", CLIENT, CL, "WST", F, [], 1, 0, 3, "stringify", "function(well){this.socket[SENDWORD](WINDOW4[JSONWORD2].stringify([30,well.pid,well.iid]));}");
  assign("client", CLIENT, CL, "WSU", F, [], 2, 0, 3, "stringify", "function(extractor,n){this.socket[SENDWORD](WINDOW3[JSONWORD5].stringify([38,n,extractor.pid,extractor.iid,extractor.type,]));}");
  assign("client", CLIENT, CL, "WSV", F, [], 2, 0, 3, "stringify", "function (furnace,n) {this.socket[SENDWORD]( WINDOW3[JSONWORD5].stringify([12,n,furnace.pid,furnace.iid]));}");
  assign("client", CLIENT, CL, "WSW", F, [], 3, 0, 3, "stringify", "function(chest,id,n){this.socket[SENDWORD](WINDOW4[JSONWORD4].stringify([8,id,n,chest.pid,chest.iid]));}");
  assign("client", CLIENT, CL, "WSX", F, [], 1, 0, 3, "stringify", "function(extractor){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([37,extractor.pid,extractor.iid,extractor.type,]));}");
  assign("client", CLIENT, CL, "WSY", F, [], 1, 0, 3, "stringify", "function(windmill){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([23, windmill.pid, windmill.iid]));}");
  assign("client", CLIENT, CL, "WSZ", F, [], 1, 0, 3, "stringify", "function(chest){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([9, chest.pid, chest.iid]));}");
  assign("client", CLIENT, CL, "WQA", F, [], 1, 0, 3, "stringify", "function(chest){this.socket[SENDWORD](WINDOW6[JSONWORD6].stringify([15,chest.pid,chest.iid]));}");
  assign("client", CLIENT, CL, "WQB", F, [], 1, 0, 3, "stringify", "function(chest){this.socket[SENDWORD](WINDOW7[JSONWORD7].stringify([16,chest.iid]));}");
  assign("client", CLIENT, CL, "WQC", F, [], 1, 0, 3, "stringify", "function(kick){_this.socket[SENDWORD](WINDOW8[JSONWORD8].stringify([20,hiddenUser.totem.id,hiddenUser.team[kick]]));}");
  assign("client", CLIENT, CL, "WQD", F, [], 0, 0, 3, "stringify", "function(){_this.socket[SENDWORD](WINDOW9[JSONWORD9].stringify([18,hiddenUser.totem.pid,hiddenUser.totem.id]));}");
  assign("client", CLIENT, CL, "WQE", F, [], 0, 0, 3, "stringify", "function(){_this.socket[SENDWORD](WINDOW10[JSONWORD10].stringify([19]));}");
  assign("client", CLIENT, CL, "units", F, [], 3, 1, "any", "none");
  assign("client", CLIENT, CL, "WQG", F, [" ...","... "], 1, 2, "any", "none");
  assignIdx("client", CLIENT, CL, "WQH", idx("client","WQG") - 1);
  assign("client", CLIENT, CL, "WQI", F, [], 1, 1, 8, "none");
  assign("client", CLIENT, CL, "WQJ", F, [], 0, 0, 8, "none");
  assign("client", CLIENT, CL, "WQK", F, [], 1, 2, 13, "none");
  assign("client", CLIENT, CL, "WQL", F, [], 2, 1, 5, "none");
  assign("client", CLIENT, CL, "WQM", F, [], 0, 0, 3, "stringify", "function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([31]));}");
  assign("client", CLIENT, CL, "WQN", F, [], 1, 0, 3, "stringify", "function(v){this.socket[SENDWORD](WINDOW3[JSONWORD3].stringify([32,v.val,v.id]));}");
  assign("client", CLIENT, CL, "WQO", F, [], 2, 0, 3, "stringify", "function(id,symbol){this.socket[SENDWORD](WINDOW3[JSONWORD5].stringify([33,id,symbol]));}");
  assign("client", CLIENT, CL, "WQP", F, [], 0, 0, 7, "stringify");
  assignIdx("client", CLIENT, CL, "WQR", idx("client","WQP") + 1);
  assign("client", CLIENT, CL, "WQS", F, [], 1, 0, 3, "stringify", "function(id){this.socket[SENDWORD](WINDOW3[JSONWORD1].stringify([6,id]));}");
  assign("client", CLIENT, CL, "WQQ", F, [], 2, 0, 3, "stringify", "function(id,i){this.socket[SENDWORD](WINDOW1[JSONWORD7].stringify([29,id]));}");
  assign("client", CLIENT, CL, "WQT", F, [], 0, 0, 3, "stringify", "function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([14]));}");
  assign("client", CLIENT, CL, "WQU", F, [], 1, 0, 4, "stringify");
  assign("client", CLIENT, CL, "WQV", F, [], 1, 0, 4, "stringify");
  assign("client", CLIENT, CL, "WQW", F, [], 1, 0, 3, "stringify");
  assignIdx("client", CLIENT, CL, "WQX", idx("client","WQW") + 2);
  assign("client", CLIENT, CL, "WQY", F, [], 0, 2, 7, "none");
  assign("client", CLIENT, CL, "WQZ", F, ["adsRefresh"], 2, 3, 17, "none");
  assignIdx("client", CLIENT, CL, "WTA", idx("client","WQZ") + 1);
  assignIdx("client", CLIENT, CL, "WTB", idx("client","WTA") + 3);
  assign("client", CLIENT, CL, "WTC", F, [], 0, 1, 4, "none");
  assign("client", CLIENT, CL, "WTD", F, [], 1, 1, 8, "++");

  /* GAME */
  assign("game", GAME, GD, "WTE", F, [], 0, 29, "any", "options.button");
  assign("game", GAME, GD, "WSJ", { translate:{x:0,y:0}, y:0 }, 4);
  assign("game", GAME, GD, "WTF", [], 359);
  assign("game", GAME, GD, "WTG", F, ["team_box","shop_starterkit","home_craft","recipe_craft","option_in_game","sure_delete","cancel_sure_delete","chronoquest"], 1, 6);
  assign("game", GAME, GD, "drawGame", F, [], 0, 1, "any", "none", "function(){draw_world_with_effect ();}");
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
  assignIdx("world", WORLD, WD, "WTR", idx("world","WTP") + 3);
  assignIdx("world", WORLD, WD, "WTS", idx("world","WTR") + 1);

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

  try { for (const k of Object.keys(UD.WTU)) if (UD.WTU[k] === -1) MS.iid = k; } catch (e) {}

  const d = { 1:"pid", 6:"nangle", 12:"speed", 21:"dist_winter", 31:"tower", 34:"fly", 36:"draw",
              37:"draw_vehicle", 42:"vehicle_fx5", 43:"tower_fx", 44:"hit", 63:"vehicle", 65:"clothe", 66:"ghost" };
  const sample = (WD.units[E.PLAYERS] || [])[0] || (WD.units[E.CHEST] || [])[0];
  if (sample) Object.keys(sample).forEach((k, i) => { if (d[i]) WD[d[i]] = k; if (typeof sample[k] === "function") WD.update = k; });
  const chest = (WD.units[E.CHEST] || [])[0];
  if (chest && WD.hit && chest[WD.hit]) {
    const anim = Object.keys(chest[WD.hit])[0]; WD.anim = anim;
    const inner = chest[WD.hit][anim] && Object.keys(chest[WD.hit][anim]);
    if (inner) { WD.o = inner[0]; WD.v = inner[1]; }
  }
  const roof = (WD.units[E.ROOF] || [])[0];
  if (roof) Object.keys(roof).forEach((k, i) => { if (i === 15) WD.j = k; if (i === 16) WD.i = k; if (i === 18) WD.opacity = k; });
  log("mapowanie propsow gotowe (" + assigned.length + " pol)");
}

/* ====================================================== HOOKI */
let wsOrig = null, sendFn = null, onopenFn = null, oncloseFn = null;
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
  wsOrig.onopen = function () {
    wsReady = true;
    for (const k in spamStore) { spamStore[k] = S[k] && S[k].active; if (S[k]) S[k].active = false; }
    onopenFn && onopenFn();
  };
  wsOrig.onclose = function () {
    wsReady = false;
    for (const k in spamStore) if (S[k]) S[k].active = spamStore[k];
    try { CL.WSG && CL.WSG(); } catch (e) {}
  };
  CL.websocket = wsOrig;
  log("websocket zahookowany");
}

function hookTimeout() {
  const orig = window.setTimeout;
  window.setTimeout = function (fn, ms, ...a) {
    if (arguments.length === 0) throw new Error("setTimeout: 1 argument required");
    if (ms === 33 && !S.Hidden.active) ms = 0;
    return orig(fn, ms, ...a);
  };
  window.setTimeout.toString = () => "setTimeout() { [native code] }";
}

function hookSpawn() {
  if (typeof CL.WTB !== "function" || CL.__spawnHooked) return;
  const orig = CL.WTB;
  CL.WTB = function (a) {
    try {
      mapW = a[20]; mapH = a[21];
      WD.max_units = a[7];
      WD.uid = a[9] * WD.max_units;
      WD.time = a[5];
      S.timePlayed.start = Date.now(); S.timePlayed.resetClock = false;
    } catch (e) {}
    return orig.apply(this, arguments);
  };
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
function hookCanvas() {
  canvasEl = $("game_canvas");
  ctx = canvasEl && canvasEl.getContext("2d");
  if (ctx && !ctx.__voidAlpha) {
    const o = ctx.drawImage;
    ctx.drawImage = function (...a) { if (S.Xray.active && wsReady) ctx.globalAlpha = S.Xray.opacity; return o.apply(this, a); };
    ctx.__voidAlpha = true;
  }
}

/* --------------------------------------------- rysowanie / pomocnicze */
let ctx = null, canvasEl = null;
function drawImg(c, img, x, y, w, h) { if (img && img.naturalWidth) c.drawImage(img, x, y, w, h); }
function me() { return WD.fast_units ? WD.fast_units[WD.uid] : null; }
function dist(a, b) { return (a && b) ? Math.hypot(a.x - b.x, a.y - b.y) : null; }
function angleTo(t, f) { return Math.atan2(t.y - f.y, t.x - f.x); }
function isAlly(pid) { if (pid === USER.id) return true; try { return (UD.WUB || []).includes(pid); } catch (e) { return false; } }
function inv(id) { try { return UD.WUU.WUV[id] || 0; } catch (e) { return 0; } }
function equip(id) { if (CL.WQR) CL.WQR(id); }
function firstInv(list) { for (const id of list) if (inv(id)) return id; return -1; }
function weaponKind(it) {
  if (it == null) return 0;
  if ([ITEM.SWORD,ITEM.SWORD_GOLD,ITEM.SWORD_DIAMOND,ITEM.REIDITE_SWORD,ITEM.SWORD_AMETHYST,ITEM.SWORD_WOOD,ITEM.DRAGON_SWORD,ITEM.LAVA_SWORD,ITEM.PIRATE_SWORD].includes(it)) return 1;
  if ([ITEM.WOOD_SPEAR,ITEM.SPEAR,ITEM.GOLD_SPEAR,ITEM.DIAMOND_SPEAR,ITEM.DRAGON_SPEAR,ITEM.LAVA_SPEAR,ITEM.CRAB_SPEAR,ITEM.AMETHYST_SPEAR,ITEM.REIDITE_SPEAR].includes(it)) return 2;
  if (it === ITEM.SUPER_HAMMER) return 4;
  if ([ITEM.WOOD_BOW,ITEM.STONE_BOW,ITEM.GOLD_BOW,ITEM.DIAMOND_BOW,ITEM.AMETHYST_BOW,ITEM.REIDITE_BOW,ITEM.DRAGON_BOW].includes(it)) return 6;
  return 0;
}
const WEAPON_RANGE = [133, 203, 110, 120, 143];
function wsSend(a) { try { if (wsOrig && wsOrig.readyState === 1 && pkt.build != null) wsOrig.send(JSON.stringify(a)); } catch (e) {} }
function refreshSkin(which) {
  const p = me(); if (!p) return;
  const key = { skin:"skin", bag:"bag", acc:"acc", book:"book" }[which];
  const cfg = S[which + "Changer"];
  if (key && WD[key] !== undefined && cfg.active) p[WD[key]] = cfg[which];
}
function convert(res, need, item) {
  const have = S.market[res], n = Math.floor(have / need);
  for (let i = 0; i < n; i++) CL.WQN({ val: need, id: item });
  S.market[res] = have % need;
}
function backToLobby() { try { if (wsOrig) wsOrig.close(); CL.WSG && CL.WSG(); } catch (e) {} }
function fmtTime(s) { return s >= 3600 ? (s / 3600).toFixed(2) + "h" : s >= 60 ? (s / 60).toFixed(2) + "m" : s + "s"; }

/* ====================================================== PETLE FUNKCJI */
let fpsText = "0 FPS", lastFpsT = Date.now(), lastFrameT = Date.now();

function loopAimbot() {
  if (!S.Aimbot.active) return;
  const p = me(); if (!p) return;
  const t = nearestPlayer(600, S.Aimbot.mode !== "Rabbit Chase");
  if (!t) { S.Aimbot.angle = 0; return; }
  const rng = WEAPON_RANGE[weaponKind(p.right) - 1] || 0;
  if (rng && dist(p, t) <= rng + 4) { S.Aimbot.angle = angleTo(t, p); CL.WQU(S.Aimbot.angle); CL.WQT(); }
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
function moveTowards(p, tgt, tol) {
  const dx = p.x - tgt.x, dy = p.y - tgt.y;
  let m = 0;
  if (Math.abs(dx) > tol) m += dx > 0 ? 1 : 2;
  if (Math.abs(dy) > tol) m += dy > 0 ? 8 : 4;
  CL.WQW(m);
}
function loopAutoSpike() {
  if (!S.AutoSpike.active) return;
  const p = me(); if (!p) return;
  const spike = firstInv([ITEM.REIDITE_SPIKE,ITEM.AMETHYST_SPIKE,ITEM.DIAMOND_SPIKE,ITEM.GOLD_SPIKE,ITEM.STONE_SPIKE,ITEM.SPIKE]);
  if (spike < 0 || UD.WUZ.WVA) return;
  const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2));
  if (S.AutoSpike.mode === "Normal") {
    for (let i = 0; i < 6; i++) { wsSend([pkt.build, spike, (i*4 + a) % 255, 0]); wsSend([pkt.build, spike, (a - i*4 + 255) % 255, 0]); }
    wsSend([pkt.build, spike, a % 255, 0]);
  } else {
    if (UD.WUZ.WVB !== spike) equip(spike);
    if (UD.WUZ.WVB === spike) CL.WQP();
  }
}
function loopAutoWall() {
  if (!S.AutoWall.active) return;
  const p = me(); if (!p) return;
  const wall = firstInv([ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.AMETHYST_WALL,ITEM.REIDITE_WALL]);
  if (wall < 0 || UD.WUZ.WVA) return;
  const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2));
  if (S.AutoWall.mode === "Normal") {
    for (let i = 0; i < 6; i++) { wsSend([pkt.build, wall, (i*4 + a) % 255, 0]); wsSend([pkt.build, wall, (a - i*4 + 255) % 255, 0]); }
    wsSend([pkt.build, wall, a % 255, 0]);
  } else {
    if (UD.WUZ.WVB !== wall) equip(wall);
    if (UD.WUZ.WVB === wall) CL.WQP();
  }
}
function loopAutoFire() {
  if (!S.AutoFire.active) return;
  const p = me(); if (!p || UD.WUZ.WVA) return;
  if (!inv(ITEM.FIRE) && !inv(ITEM.BIG_FIRE)) return;
  const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2));
  wsSend([pkt.build, ITEM.FIRE, a, 0]); wsSend([pkt.build, ITEM.BIG_FIRE, a, 0]);
}
function loopAutoBuild() {
  if (!S.AutoBuild.active) return;
  const p = me(); if (!p || UD.WUZ.WVA) return;
  const id = { Bridges:ITEM.BRIDGE, Plots:ITEM.PLOT, Roofs:ITEM.ROOF }[S.AutoBuild.mode];
  if (!inv(id)) return;
  const a = Math.floor((p.angle + Math.PI*2) % (Math.PI*2) * 255 / (Math.PI*2));
  wsSend([pkt.build, id, a, 0]);
}
function loopAutoSteal() {
  if (!S.AutoSteal.active) return;
  const p = me(); if (!p || UD.WUZ.WVA) return;
  for (const c of (WD.units[E.CHEST] || [])) if (dist(p, c) < 300) { c[MS.iid] = c.id; CL.WSZ(c); }
}
function loopAutoExt() {
  if (!S.AutoExtTake.active && !S.AutoExtPut.active && !S.AutoSteal.active) return;
  const p = me(); if (!p) return;
  const types = [E.EXTRACTOR_MACHINE_STONE,E.EXTRACTOR_MACHINE_GOLD,E.EXTRACTOR_MACHINE_DIAMOND,E.EXTRACTOR_MACHINE_AMETHYST,E.EXTRACTOR_MACHINE_REIDITE,E.EXTRACTOR_MACHINE_EMERALD,E.EXTRACTOR_MACHINE_COPPER,E.EXTRACTOR_MACHINE_IRON,E.EXTRACTOR_MACHINE_TOPAZ,E.EXTRACTOR_MACHINE_SAPPHIRE,E.EXTRACTOR_MACHINE_JADE,E.EXTRACTOR_MACHINE_RUBY,E.EXTRACTOR_MACHINE_COAL,E.EXTRACTOR_MACHINE_AQUAMARINE];
  for (const t of types) for (const x of (WD.units[t] || [])) if (dist(p, x) < 300) {
    x[MS.iid] = x.id;
    if ((S.AutoExtTake.active || S.AutoSteal.active) && (x.info & 65280) >> 8) CL.WSX(x);
    if (S.AutoExtPut.active && (x.info & 255) < 255) CL.WSU(x, 255);
  }
}
function loopAutoBread() {
  if (!S.AutoBreadTake.active && !S.AutoBreadPut.active && !S.AutoSteal.active) return;
  const p = me(); if (!p) return;
  for (const o of (WD.units[E.BREAD_OVEN] || [])) if (dist(p, o) < 300) {
    o[MS.iid] = o.id;
    if (S.AutoBreadPut.active) { CL.WSR(o, 31, 0); CL.WSR(o, 0, 31); }
    if (S.AutoBreadTake.active || S.AutoSteal.active) CL.WSS(o);
  }
  for (const w of (WD.units[E.WINDMILL] || [])) if (dist(p, w) < 300) {
    w[MS.iid] = w.id;
    if (S.AutoBreadPut.active) CL.WSP(w, 255);
    if (S.AutoBreadTake.active || S.AutoSteal.active) CL.WSY(w, 255);
  }
}
function loopAutoTotem() {
  if (!S.AutoTotem.active) return;
  const p = me(); if (!p || UD.WUD.wait || (UD.WUB || []).length) return;
  for (const t of (WD.units[E.TOTEM] || [])) if (!((t.info & 16) >> 4) && t.info < 8 && dist(p, t) < 300) { UD.WUD[WD.pid] = t[WD.pid]; UD.WUD.id = t.id; CL.WQD(); }
}
function loopAutoCrown() {
  if (!S.AutoCrown.active) return;
  if (inv(ITEM.CROWN_BLUE)) equip(ITEM.CROWN_BLUE);
  const h = firstInv([ITEM.HAMMER_REIDITE,ITEM.HAMMER_AMETHYST,ITEM.HAMMER_DIAMOND,ITEM.HAMMER_GOLD,ITEM.HAMMER]);
  if (h >= 0) equip(h);
  if (CL.WQJ) CL.WQJ();
}
function loopAutoEmerald() {
  if (!S.AutoEmerald.active) return;
  const p = me(); if (!p) return;
  const pts = CL.__emerald || (CL.__emerald = [[28750,3018],[29563,3273],[29519,2750]]);
  let bi = 0, bd = Infinity;
  pts.forEach((pt, i) => { const d = Math.hypot(p.x - pt[0], p.y - pt[1]); if (d < bd) { bd = d; bi = i; } });
  const tgt = { x: pts[bi][0], y: pts[bi][1] };
  moveTowards(p, tgt, 60);
  if (Math.abs(p.x - tgt.x) < 100 && Math.abs(p.y - tgt.y) < 100) { S.AutoEmerald.angle = [-3.68,-5.28,-0.94][bi]; CL.WQU(S.AutoEmerald.angle); CL.WQT(); }
}
function loopAutoFarm() {
  if (!S.AutoFarm.active) return;
  const p = me(); if (!p) return;
  const seeds = [ITEM.SEED,ITEM.PUMPKIN_SEED,ITEM.GARLIC_SEED,ITEM.THORNBUSH_SEED,ITEM.CARROT_SEED,ITEM.TOMATO_SEED,ITEM.WATERMELON_SEED,ITEM.ALOE_VERA_SEED,ITEM.WHEAT_SEED];
  let best = null, bd = Infinity;
  for (const t of seeds) for (const s of (WD.units[t] || [])) {
    if (!s.info || s.info === 10) continue;
    if (!inv(ITEM.WATERING_CAN_FULL) && s.info === 16) continue;
    if (s.x > S.AutoFarm.TLX && s.x < S.AutoFarm.BRX && s.y > S.AutoFarm.TLY && s.y < S.AutoFarm.BRY) {
      const d = dist(p, s); if (d < bd) { bd = d; best = s; }
    }
  }
  if (best && UD.WSJ.WUN * 100 > 80) {
    if (best.info >= 16 && best.info <= 19) { if (inv(ITEM.WATERING_CAN_FULL)) equip(ITEM.WATERING_CAN_FULL); }
    else equip(firstInv([ITEM.PITCHFORK, ITEM.PITCHFORK2]));
    S.AutoFarm.angle = angleTo(best, p);
    if (S.AutoFarm.angle) { CL.WQU(S.AutoFarm.angle); CL.WQT(); }
    moveTowards(p, best, 50);
  } else moveTowards(p, { x: S.AutoFarm.SX, y: S.AutoFarm.SY }, 30);
}
function loopAutoTame() {
  if (!S.AutoTame.active) return;
  const p = me(); if (!p) return;
  if (!inv(ITEM.SADDLE) || p[WD.fly]) { S.AutoTame.angle = 0; return; }
  let cand = null;
  for (const t of [E.PARROT,E.GOLDEN_CHICKEN,E.BABY_DRAGON,E.BABY_LAVA,E.BABY_MAMMOTH,E.CRAB_BOSS,E.HAWK])
    for (const u of (WD.units[t] || [])) if (dist(p, u) < 150 && (u.info & 1) === 0) { cand = u; break; }
  if (cand) { S.AutoTame.angle = angleTo(cand, p); equip(ITEM.SADDLE); CL.WQU(S.AutoTame.angle); CL.WQT(); }
  else S.AutoTame.angle = 0;
}
function loopAutoUnlock() {
  if (!S.AutoUnlock.active || !inv(ITEM.LOCKPICK)) return;
  const p = me(); if (!p) return;
  for (const c of (WD.units[E.CHEST] || [])) if (!isAlly(c[WD.pid]) && c.lock && dist(p, c) < 300) { c[MS.iid] = c.id; CL.WQA(c); }
}
function loopAutoFurnace() {
  if (!S.AutoFurnace.active) return;
  const p = me(); if (!p) return;
  for (const f of (WD.units[E.FURNACE] || [])) if (dist(p, f) <= 150) { f[MS.iid] = f.id; CL.WSV(f, 255); }
}
function loopAutoSeed() {
  if (!S.AutoSeed.active || UD.WUZ.WVA) return;
  const seed = firstInv([ITEM.WHEAT_SEED, ITEM.PUMPKIN_SEED, ITEM.CARROT_SEED, ITEM.TOMATO_SEED]);
  if (seed < 0) return;
  for (let i = 0; i < 26; i++) wsSend([pkt.build, seed, i * 10, 1]);
}
function loopAutoIce() {
  if (!S.AutoIce.active) return;
  const p = me(); if (!p || UD.WUZ.WVA) return;
  if (UD.WSJ.WUM + (1 - UD.WSJ.WUS) >= 2 && inv(ITEM.ICE)) { const b = UD.WUZ.WVB; equip(ITEM.ICE); UD.WUZ.WVB = b; }
}
function loopAutoBook() {
  if (!S.AutoBook.active) return;
  const p = me(); if (!p) return;
  if (p.right !== ITEM.BOOK && inv(ITEM.BOOK)) equip(ITEM.BOOK);
}
function loopZmaCrown() {
  if (!S.ZmaAutoCrown || !wsReady) return;
  const p = me(); if (!p) return;
  const secs = 5 - (Date.now() - lastGaugeT) / 1000;
  if (Math.floor(UD.WSJ.WUN * 100) !== 100 && inv(ITEM.CROWN_GREEN) && p[WD.clothe] !== ITEM.CROWN_GREEN && secs <= .3) equip(ITEM.CROWN_GREEN);
}
function loopZmaBottle() {
  if (!S.ZmaAutoBottle.enabled || !wsReady) return;
  if (Math.floor(UD.WSJ.WUN * 100) <= Number(S.ZmaAutoBottle.health) && inv(ITEM.BOTTLE_FULL)) equip(ITEM.BOTTLE_FULL);
}
function loopZmaRedGold() {
  if (!S.ZmaRedGold.active || !wsReady) return;
  const p = me(); if (!p) return;
  for (const c of (WD.units[E.CHEST] || [])) if (dist(p, c) < 150 && (isAlly(c[WD.pid]) || !c.lock))
    for (const it of [ITEM.REIDITE, ITEM.GOLD]) if (inv(it)) { c[MS.iid] = c.id; CL.WSW(c, it, 255); }
}
function loopPathfinder() {
  if (!S.PathFinder.active) return;
  const p = me(); if (!p || typeof window.findpath !== "function") return;
  window.findpath({ x: Math.round(p.x/100), y: Math.round(p.y/100) }, S.PathFinder.End);
  if (dist(p, { x: S.PathFinder.End.x*100, y: S.PathFinder.End.y*100 }) < 1000 && window.lastChosenKit !== -1 && S.PathFinder.lastKit && window.chooseKit) window.chooseKit(window.lastChosenKit);
}
function loopAutoLand() {
  if (!S.AutoLand.active) return;
  const p = me(); if (!p || WD.flyableEquiped === undefined) return;
  if (!p[WD.fly] && p[WD.vehicle] === WD.flyableEquiped && p[WD.speed] < 50) equip(WD.flyableEquiped);
}
function loopAutoDiving() {
  if (!S.AutoDiving.active) return;
  const p = me(); if (!p) return;
  if (UD.WUZ.WUP && !inv(ITEM.SUPER_DIVING_SUIT) && inv(ITEM.DIVING_MASK) && p[WD.clothe] !== ITEM.DIVING_MASK) equip(ITEM.DIVING_MASK);
}
function loopAutoHat() {
  if (!S.AutoHat.active) return;
  const p = me(); if (!p || !WD.flyableEquiped) return;
  if (p[WD.vehicle] !== WD.flyableEquiped) {
    if (WD.flyableEquiped === ITEM.NIMBUS && inv(ITEM.WITCH)) equip(ITEM.WITCH);
    else if (inv(ITEM.PILOT_HELMET)) equip(ITEM.PILOT_HELMET);
  }
}
function loopSmartCraft() {
  if (!S.SmartCraft.active || UD.WUZ.WVA) return;
  const chains = {
    "Gold Spikes": [ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.GOLD_SPIKE],
    "Diamond Spikes": [ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.DIAMOND_SPIKE],
    "Amethyst Spikes": [ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.AMETHYST_WALL,ITEM.AMETHYST_SPIKE],
    "Reidite Spikes": [ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.AMETHYST_WALL,ITEM.REIDITE_WALL,ITEM.REIDITE_SPIKE],
    "Reidite Walls": [ITEM.WALL,ITEM.STONE_WALL,ITEM.GOLD_WALL,ITEM.DIAMOND_WALL,ITEM.AMETHYST_WALL,ITEM.REIDITE_WALL],
    "Reidite Swords": [ITEM.SWORD_WOOD,ITEM.SWORD,ITEM.SWORD_GOLD,ITEM.SWORD_DIAMOND,ITEM.SWORD_AMETHYST,ITEM.REIDITE_SWORD],
    "Reidite Spears": [ITEM.WOOD_SPEAR,ITEM.SPEAR,ITEM.GOLD_SPEAR,ITEM.DIAMOND_SPEAR,ITEM.AMETHYST_SPEAR,ITEM.REIDITE_SPEAR],
    "Reidite Helmets": [ITEM.WOOD_HELMET,ITEM.STONE_HELMET,ITEM.GOLD_HELMET,ITEM.DIAMOND_HELMET,ITEM.AMETHYST_HELMET,ITEM.REIDITE_HELMET],
    "Reidite Shields": [ITEM.WOOD_SHIELD,ITEM.STONE_SHIELD,ITEM.GOLD_SHIELD,ITEM.DIAMOND_SHIELD,ITEM.AMETHYST_SHIELD,ITEM.REIDITE_SHIELD],
    "Reidite Spike Doors": [ITEM.WOOD_DOOR,ITEM.STONE_DOOR,ITEM.GOLD_DOOR,ITEM.DIAMOND_DOOR,ITEM.AMETHYST_DOOR,ITEM.REIDITE_DOOR,ITEM.REIDITE_DOOR_SPIKE],
    "Amethyst Spike Doors": [ITEM.WOOD_DOOR,ITEM.STONE_DOOR,ITEM.GOLD_DOOR,ITEM.DIAMOND_DOOR,ITEM.AMETHYST_DOOR,ITEM.AMETHYST_DOOR_SPIKE]
  };
  const chain = chains[S.SmartCraft.option] || chains["Gold Spikes"];
  const final = chain[chain.length - 1];
  if (inv(final) >= S.SmartCraft.amount) { S.SmartCraft.active = false; return; }
  let step = 0;
  for (let i = 0; i < chain.length - 1; i++) if (inv(chain[i])) step = i + 1;
  CL.WQI(chain[step], 1);
}

const loops = [loopAimbot, loopAutoSpike, loopAutoWall, loopAutoFire, loopAutoBuild, loopAutoSteal, loopAutoExt,
  loopAutoBread, loopAutoTotem, loopAutoCrown, loopAutoEmerald, loopAutoFarm, loopAutoTame, loopAutoUnlock,
  loopAutoFurnace, loopAutoSeed, loopAutoIce, loopAutoBook, loopZmaCrown, loopZmaBottle, loopZmaRedGold,
  loopPathfinder, loopAutoLand, loopAutoDiving, loopAutoHat, loopSmartCraft];

/* -------------------------------------------------- rysowanie overlay */
function drawOverlay() {
  if (!ctx || !wsReady) return;
  const p = me(); if (!p || !UD.WUY) return;
  const cam = { x: UD.WUF.x, y: UD.WUF.y };

  for (const u of (WD.units[E.PLAYERS] || [])) {
    const pid = u[WD.pid];
    if (S.playerTracers && pid !== USER.id) {
      ctx.save(); ctx.strokeStyle = isAlly(pid) ? "#66ff00" : "#ff2e2e"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(cam.x + p.x, cam.y + p.y); ctx.lineTo(cam.x + u.x, cam.y + u.y); ctx.stroke(); ctx.restore();
    }
    if (S.movementPredictor && u.r && (u.x !== u.r.x || u.y !== u.r.y)) {
      ctx.save(); ctx.strokeStyle = "#ff2e2e"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(cam.x + u.x, cam.y + u.y); ctx.lineTo(cam.x + u.r.x, cam.y + u.r.y); ctx.stroke(); ctx.restore();
    }
  }

  const tr = [["Krakens",E.KRAKEN,"#000"],["Sandworms",E.SAND_WORM,"#000"],["BabyDragons",E.BABY_DRAGON,"#949494"],
    ["BabyLavaDragons",E.BABY_LAVA,"#660000"],["BabyMammoths",E.BABY_MAMMOTH,"#949494"],["Bears",E.BEAR,"#949494"],
    ["Boars",E.BOAR,"#007512"],["Crabs",E.CRAB,"#948f00"],["Dragons",E.DRAGON,"#949494"],["FireMobs",E.FLAME,"#660000"],
    ["Foxes",E.FOX,"#949494"],["Hawks",E.HAWK,"#007512"],["KingCrabs",E.CRAB_BOSS,"#948f00"],
    ["LavaDragons",E.LAVA_DRAGON,"#660000"],["Mammoths",E.MAMMOTH,"#949494"],["Penguins",E.PENGUIN,"#949494"],
    ["Piranhas",E.PIRANHA,"#000c78"],["Rabbits",E.RABBIT,"#007512"],["Spiders",E.SPIDER,"#007512"],
    ["Vultures",E.VULTURE,"#948f00"],["Wolfs",E.WOLF,"#007512"],["Crocodiles",E.CROCODILE,"#003c12"],
    ["GoldenChickens",E.GOLDEN_CHICKEN,"#007512"],["GoldenHens",E.GOLDEN_HEN,"#007512"],
    ["Ocelots",E.OCELOT,"#003c12"],["Parrots",E.PARROT,"#003c12"]];
  for (const [key, type, col] of tr) {
    if (!S.Tracers[key]) continue;
    for (const u of (WD.units[type] || [])) {
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(cam.x + p.x, cam.y + p.y); ctx.lineTo(cam.x + u.x, cam.y + u.y); ctx.stroke(); ctx.restore();
    }
  }

  const H = UD.WUY.translate;
  let y = H.y - 50;
  const line = (txt, color) => { ctx.save(); ctx.font = "30px Baloo Paaji"; ctx.lineWidth = 7; ctx.strokeStyle = "black"; ctx.fillStyle = color || "#fff"; ctx.strokeText(txt, H.x - 120, y); ctx.fillText(txt, H.x - 120, y); ctx.restore(); y += 30; };
  if (S.fpsDisplay) line(fpsText);
  if (S.pingDisplay && pingText) line(pingText + "ms");
  if (S.daysAlive) line(UD.WVF + " Day" + (UD.WVF > 1 ? "s" : ""));
  if (S.timePlayed.active) line(fmtTime(Math.round((Date.now() - S.timePlayed.start) / 1000)));

  if (S.listEnabledHacks.mode !== "Off") {
    let ly = S.listEnabledHacks.mode === "Bottom Left" ? innerHeight - 25 : 25;
    ctx.save(); ctx.font = "18px Baloo Paaji"; ctx.strokeStyle = "black"; ctx.lineWidth = 7; ctx.fillStyle = "#fff";
    for (const k in S) if (S[k] && S[k].active && S[k].bind && S[k].bind !== "NONE") { ctx.strokeText(k, 15, ly); ctx.fillText(k, 15, ly); ly += S.listEnabledHacks.mode === "Bottom Left" ? -20 : 20; }
    ctx.restore();
  }
}

/* ----------------------------------------------------- main loop / bindy */
const keys = {};
function mainLoop(t) {
  const dt = Math.min((t - lastFrameT) / 1000, 1);
  lastFrameT = t;
  if (Date.now() - lastFpsT > 1000) { lastFpsT = Date.now(); fpsText = Math.round(1 / (dt || 1)) + " FPS"; }
  if (S.Spectator.active && UD.WUF) {
    const sp = Number(S.Spectator.speed);
    if (keys.KeyS || keys.ArrowDown) UD.WUF.y -= sp;
    if (keys.KeyW || keys.ArrowUp) UD.WUF.y += sp;
    if (keys.KeyD || keys.ArrowRight) UD.WUF.x -= sp;
    if (keys.KeyA || keys.ArrowLeft) UD.WUF.x += sp;
  }
  requestAnimationFrame(mainLoop);
}
function inInput() { const a = document.activeElement; return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA"); }
const HOLD = ["AutoSpike","AutoWall","AutoFire","AutoCrown","AutoSteal","ZmaRedGold"];
function hookKeys() {
  document.addEventListener("keydown", e => {
    keys[e.code] = 1;
    if (e.code === S.Hidden.bind) { S.Hidden.active = !S.Hidden.active; applyMenuOpacity(); const g = $(xor("voidGui")); if (g) g.style.display = S.Hidden.active ? "none" : "flex"; return; }
    if (inInput()) return;
    for (const k in S) { const f = S[k]; if (f && f.bind === e.code && "active" in f && HOLD.indexOf(k) === -1) f.active = !f.active; }
    if (e.code === S.Spectator.bind) S.Spectator.active = !S.Spectator.active;
    if (e.code === S.DropSword.bind) { const p = me(); if (p && weaponKind(p.right)) CL.WQS(p.right); }
    save();
  });
  document.addEventListener("keyup", e => {
    keys[e.code] = 0;
    for (const k of HOLD) { const f = S[k]; if (f && f.bind === e.code) f.active = false; }
  });
}

/* ====================================================== START */
function patchSource(src) {
  return src.replace(/(<\s*|>\s*)(?:0[xX][fF]{4}|65535)(\s*>|\s*)|(\s*)(?:0[xX][fF]{4}|65535)(\s*)(?=>|<)/g,
    m => m.replace(/(?:0[xX][fF]{4}|65535)/, "0"));
}

async function boot() {
  hookTimeout();
  log("uruchamiam gre (" + Math.round(GAME_SRC.length / 1024) + " KB)...");
  try { Function(patchSource(GAME_SRC))(); }
  catch (e) { warn("blad uruchomienia gry:", e); }

  setInterval(() => { const p = $("exapush-popup"); if (p) { p.style.opacity = 0; p.remove(); } }, 2500);

  const poll = setInterval(() => {
    if (installed) return;
    if (!pickObjects()) return;
    if (typeof window.js_beautify !== "function") return;
    installed = true;
    try {
      mapAll();
      hookWebSocket(); hookSpawn(); hookGauges(); hookTime(); hookPing();
      hookCanvas(); hookDrawGame(); hookKeys();
      gui = new Gui(guiConfig); gui.build();
      for (const l of loops) setInterval(l, 60);
      requestAnimationFrame(mainLoop);
      setInterval(() => { if (wsReady) { try { CL.WSG && CL.WSG(); } catch (e) {} } }, 2000);
      applyBrightness(); applyMenuOpacity();
      window.__VOID = { S, CL, GD, WD, UD, MS };
      log("ZAINSTALOWANO — hack aktywny", "lime");
      clearInterval(poll);
    } catch (e) { warn("instalacja:", e); }
  }, 100);
}

/* restore ustawien */
try {
  const gs = localStorage.getItem("guiSettings");
  if (gs) { const a = JSON.parse(gs); ["align","toggleGuiKey","toggleGuiButton","draggable","fontSize","opacity","width","height"].forEach((k, i) => { if (a[i] !== undefined) guiConfig[k] = a[i]; }); }
  const st = localStorage.getItem("settings_all");
  if (st) JSON.parse(st).forEach(([p, v]) => setPath(p, v));
} catch (e) {}
S.Hidden.active = false;
S.timePlayed.resetClock = true;

boot();
})();
