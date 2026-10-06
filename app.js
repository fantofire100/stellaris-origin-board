"use strict";

const SUPABASE_URL = "https://nwwxtmlghmtdkjoyivja.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53d3h0bWxnaG10ZGtqb3lpdmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzcyNTAsImV4cCI6MjA5MjM1MzI1MH0.dbqeqA_4-imfjYTXzgH_lWS9sJO4lB6dDoQ3Zeb-8ow";

const ADMIN_PASSWORD_STORAGE_KEY = "stellaris_admin_pw";
const BLOCKED_DISCORD_NAME = "!!Block";

const FILTER_ALL = "all";
const FILTER_AVAILABLE = "unclaimed";
const FILTER_CLAIMED = "claimed";
const FILTER_BLOCKED = "blocked";

const CLAIM_KINDS = {
  origin: {
    table: "claims",
    column: "origin",
    nameParam: "origin_name",
    claimRpc: "admin_claim_origin",
    releaseRpc: "admin_release_claim",
    modalTitle: "Claim Origin",
    noun: "Origin"
  },
  system: {
    table: "system_claims",
    column: "system",
    nameParam: "system_name",
    claimRpc: "admin_claim_system",
    releaseRpc: "admin_release_system_claim",
    modalTitle: "Claim System",
    noun: "System"
  }
};

const DLCS = [
  { name: "Base Game", cssKey: "base" },
  { name: "Humanoids", cssKey: "humanoids" },
  { name: "Plantoids", cssKey: "plantoids" },
  { name: "Lithoids", cssKey: "lithoids" },
  { name: "Aquatics", cssKey: "aquatics" },
  { name: "Utopia", cssKey: "utopia" },
  { name: "Synthetic Dawn", cssKey: "synthetic" },
  { name: "Apocalypse", cssKey: "apocalypse" },
  { name: "Ancient Relics", cssKey: "ancientrelics" },
  { name: "Federations", cssKey: "federations" },
  { name: "Necroids", cssKey: "necroids" },
  { name: "Overlord", cssKey: "overlord" },
  { name: "First Contact", cssKey: "firstcontact" },
  { name: "Toxoids", cssKey: "toxoids" },
  { name: "Galactic Paragons", cssKey: "paragons", filterLabel: "Paragons" },
  { name: "Astral Planes", cssKey: "astral" },
  { name: "The Machine Age", cssKey: "machineage", filterLabel: "Machine Age" },
  { name: "Cosmic Storms", cssKey: "cosmicstorms" },
  { name: "Grand Archive", cssKey: "grandarchive" },
  { name: "BioGenesis", cssKey: "biogenesis" },
  { name: "Shadows of the Shroud", cssKey: "shroud" },
  { name: "Infernals", cssKey: "infernals" },
  { name: "Nomads", cssKey: "nomads" }
];

const DLCS_BY_NAME = new Map(DLCS.map(dlc => [dlc.name, dlc]));

const FILTERS = [
  { value: FILTER_ALL, label: "All" },
  { value: FILTER_AVAILABLE, label: "Available" },
  { value: FILTER_CLAIMED, label: "Claimed" },
  { value: FILTER_BLOCKED, label: "Unavailable" },
  ...DLCS.map(dlc => ({ value: dlc.name, label: dlc.filterLabel ?? dlc.name }))
];

const ORIGINS = [
  { name: "Exterminator", dlc: "Base Game", description: "Any type of exterminator.", isSpecial: true },
  { name: "Lost Colony", dlc: "Base Game", description: "This civilization originated as a lost and forgotten colony, separated from its homeworld long ago." },
  { name: "Galactic Doorstep", dlc: "Base Game", description: "A dormant Gateway lies within the home system, offering both opportunity and potential danger." },

  { name: "Tree of Life", dlc: "Utopia", description: "This Hive evolved in a symbiotic relationship with a vast Tree. The Tree grants them many benefits, but its loss would cripple them." },
  { name: "Mechanist", dlc: "Utopia", description: "This civilization has long been fascinated with robots, building them long before achieving spaceflight." },
  { name: "Syncretic Evolution", dlc: "Utopia", description: "A second species forms an integral part of this civilization, serving alongside the dominant one." },

  { name: "Clone Army", dlc: "Humanoids", description: "A species of short-lived and infertile soldier clones, engineered for war and now left to determine their own fate." },

  { name: "Fruitful Partnership", dlc: "Plantoids", description: "This civilization has developed a unique relationship with spaceborne fauna, using them to spread across the galaxy." },

  { name: "Calamitous Birth", dlc: "Lithoids", description: "Not native to their homeworld, these lithoids arrived when a meteorite impact reshaped the planet." },

  { name: "Resource Consolidation", dlc: "Synthetic Dawn", description: "This Machine Intelligence has consolidated all planetary resources into its capital world, covering it entirely with machinery." },
  { name: "Hard Reset", dlc: "Synthetic Dawn", description: "Severed from a greater Machine Intelligence, this civilization must now forge its own destiny." },

  { name: "Life-Seeded", dlc: "Apocalypse", description: "This civilization's homeworld is a perfect Gaia World, seemingly designed specifically for them." },
  { name: "Post-Apocalyptic", dlc: "Apocalypse", description: "Baptized by nuclear fire, this civilization survived total annihilation and rebuilt from the ashes." },

  { name: "Remnants", dlc: "Ancient Relics", description: "Once rulers of a vast empire, this civilization now rises from the ruins of a fallen age, seeking to reclaim its lost glory among the stars." },

  { name: "Doomsday", dlc: "Federations", description: "This civilization's homeworld is highly unstable and will eventually be destroyed." },
  { name: "On the Shoulders of Giants", dlc: "Federations", description: "Hidden boons and secrets lie scattered throughout this civilization's home system." },
  { name: "Common Ground", dlc: "Federations", description: "This civilization begins as part of a federation with two other empires." },
  { name: "Hegemon", dlc: "Federations", description: "This civilization begins as the leader of a Hegemony federation." },
  { name: "Scion", dlc: "Federations", description: "A Fallen Empire has guided this civilization for thousands of years." },
  { name: "Shattered Ring", dlc: "Federations", description: "This civilization inhabits a ruined Ring World built by an unknown precursor." },
  { name: "Void Dwellers", dlc: "Federations", description: "This civilization has lived in space habitats for as long as it has maintained records." },

  { name: "Here Be Dragons", dlc: "Aquatics", description: "A powerful Sky Dragon has shared this civilization's home system since ancient times." },
  { name: "Ocean Paradise", dlc: "Aquatics", description: "This civilization evolved on a large Ocean World with abundant natural resources." },

  { name: "Necrophage", dlc: "Necroids", description: "This civilization survives by transforming other species into its own." },

  { name: "Overtuned", dlc: "Toxoids", description: "This civilization uses extreme biological enhancements regardless of the risks involved." },
  { name: "Knights of the Toxic God", dlc: "Toxoids", description: "A knightly order devotes itself to finding the mysterious Toxic God." },

  { name: "Subterranean", dlc: "Overlord", description: "This civilization adapted to life underground, thriving beneath the planet's surface." },
  { name: "Progenitor Hive", dlc: "Overlord", description: "This hive relies on semi-independent offspring leaders to guide its expansion." },
  { name: "Teachers of the Shroud", dlc: "Overlord", description: "This civilization has long been guided by a Shroudwalker enclave." },
  { name: "Imperial Fiefdom", dlc: "Overlord", description: "This civilization begins as a subject of a powerful overlord empire." },
  { name: "Slingshot to the Stars", dlc: "Overlord", description: "A ruined Quantum Catapult in the home system defines this civilization's future." },

  { name: "Fear of the Dark", dlc: "First Contact", description: "A past catastrophe divided this civilization between fear and curiosity of the unknown." },
  { name: "Broken Shackles", dlc: "First Contact", description: "A group of escaped slaves formed a new civilization from many different species." },
  { name: "Payback", dlc: "First Contact", description: "After resisting alien invaders, this civilization prepares to strike back." },

  { name: "Under One Rule", dlc: "Galactic Paragons", description: "This civilization was unified under a single powerful ruler." },

  { name: "Riftworld", dlc: "Astral Planes", description: "A massive rift near the homeworld has drawn this civilization into studying its mysteries." },

  { name: "Storm Chasers", dlc: "Cosmic Storms", description: "This civilization thrives in the chaos and opportunity presented by cosmic storms." },

  { name: "Primal Calling", dlc: "Grand Archive", description: "This civilization shares a deep connection with wildlife and space fauna." },
  { name: "Treasure Hunters", dlc: "Grand Archive", description: "Driven by adventure, this civilization searches the galaxy for legendary treasure." },

  { name: "Wilderness", dlc: "BioGenesis", description: "A vast planetary ecosystem evolved into a single unified consciousness." },
  { name: "Evolutionary Predators", dlc: "BioGenesis", description: "This species evolves by absorbing traits from the creatures it hunts." },
  { name: "Starlit Citadel", dlc: "BioGenesis", description: "A mysterious portal threatens the home system, defended by a powerful citadel." },

  { name: "Arc Welders", dlc: "The Machine Age", description: "This machine civilization focuses on massive industrial megastructures." },
  { name: "Cybernetic Creed", dlc: "The Machine Age", description: "This civilization views cybernetic enhancement as a sacred calling." },
  { name: "Synthetic Fertility", dlc: "The Machine Age", description: "Facing extinction, this species turns to synthetic solutions for survival." },

  { name: "Mindwardens", dlc: "Shadows of the Shroud", description: "This civilization developed technology to defend against psionic threats." },
  { name: "Endbringers", dlc: "Shadows of the Shroud", description: "Obsessed with a past catastrophe, this civilization seeks answers in the Shroud." },
  { name: "Shroud-Forged", dlc: "Shadows of the Shroud", description: "Guided by a Shroud entity, this machine civilization bears a heavy cost." },

  { name: "Red Giant", dlc: "Infernals", description: "This civilization's home system is dominated by an unstable red giant star threatening their survival." },
  { name: "Cosmic Dawn", dlc: "Infernals", description: "Awakened from stasis, this civilization must rebuild in a galaxy that has moved on without them." },

  { name: "The Sacred Path", dlc: "Nomads", description: "A nomadic spiritualist people follow a sacred pilgrimage ordained by their ancestors, but advancing technology and new knowledge of the galaxy challenge the purpose of their eternal journey." },
  { name: "Heirs of the Khan", dlc: "Nomads", description: "A betrayed former ruling clan wanders the stars as nomads, rebuilding its strength to one day reclaim its honor through vengeance." },
  { name: "Forever Cruise", dlc: "Nomads", description: "A luxury star cruise roams the galaxy, offering passengers breathtaking sights while its crew ensures every journey is comfortable and unforgettable." }
];

const SYSTEMS = [
  { name: "Sol", description: "The birthplace of humanity and one of the most iconic systems in Stellaris." },
  { name: "Deneb", description: "A classic starting system centered on the bright star Deneb." },
  { name: "Titawin", description: "A notable trinary-inspired system option with distinct strategic flavor." }
];

const SYSTEM_BADGE = { label: "System", cssKey: "base" };

/* ------------------------------------------------------------------ state */

const state = {
  currentUserId: null,
  isAdmin: false,
  activeFilter: FILTER_ALL,
  searchQuery: "",
  claims: { origin: new Map(), system: new Map() },
  loaded: { origin: false, system: false },
  loadFailed: false,
  pendingClaim: null,
  realtime: "connecting"
};

const latestRequestIds = { origin: 0, system: 0 };
const refreshTimers = {};
const entranceTimers = {};

const db = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) ?? null;

const adminSession = {
  isActive: () => Boolean(adminSession.getPassword()),
  getPassword: () => {
    try { return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY); } catch { return null; }
  },
  start: password => {
    try { localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password); } catch { /* storage blocked */ }
  },
  end: () => {
    try { localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY); } catch { /* storage blocked */ }
  }
};

/* --------------------------------------------------------------- helpers */

function byId(id) {
  return document.getElementById(id);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text != null) {
    node.textContent = text;
  }
  return node;
}

function formatDate(iso) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

const shortId = id => (id ? String(id).slice(0, 8) : "?");
const isReservedName = name => name.trim().toLowerCase() === BLOCKED_DISCORD_NAME.toLowerCase();

const elements = {
  totalCount: byId("total-count"),
  claimedCount: byId("claimed-count"),
  freeCount: byId("free-count"),
  blockedCount: byId("blocked-count"),
  filters: byId("filters"),
  searchInput: byId("search-input"),
  originGrid: byId("origin-grid"),
  systemGrid: byId("system-grid"),
  emptyState: byId("empty-state"),
  cardTemplate: byId("card-template"),
  claimTitle: byId("claim-title"),
  claimSubject: byId("claim-subject"),
  adminLogin: byId("admin-login"),
  adminLogout: byId("admin-logout"),
  adminClear: byId("admin-clear"),
  adminPanel: byId("admin-panel"),
  panelBody: byId("panel-body"),
  panelDialog: byId("panel-dialog"),
  toasts: byId("toasts"),
  loadBanner: byId("load-banner"),
  loadRetry: byId("load-retry")
};

function toast(message, type = "info") {
  const node = el("div", `toast toast--${type}`, message);
  node.setAttribute("role", type === "error" ? "alert" : "status");
  elements.toasts.append(node);
  setTimeout(() => node.remove(), type === "error" ? 6000 : 3500);
}

function friendlyError(error) {
  const code = error?.cause?.code ?? error?.code;
  if (code === "23505") {
    return "Someone just claimed that one. The board has been refreshed.";
  }
  if (code === "42501") {
    return "You're not allowed to do that.";
  }
  if (code === "23514") {
    return "That name isn't allowed. Use 1–40 characters, and not the reserved block marker.";
  }
  if (code === "P0002" || code === "NOT_RELEASED") {
    return "That couldn't be released. It may already be free, or it belongs to someone else.";
  }
  if (error instanceof TypeError || /failed to fetch|network|load failed/i.test(error?.message ?? "")) {
    return "Network problem. Check your connection and try again.";
  }
  return error?.message || "Something went wrong.";
}

function needsRefresh(error) {
  const code = error?.cause?.code ?? error?.code;
  return code === "23505" || code === "P0002" || code === "NOT_RELEASED";
}

function adminRejected(message, endsSession) {
  const error = new Error(message);
  error.name = "AdminRejected";
  error.endsSession = endsSession;
  return error;
}

function unwrap({ data, error }) {
  if (error) {
    throw new Error(error.message, { cause: error });
  }
  return data;
}

/* ------------------------------------------------------------- data layer */

async function ensureAnonymousSession() {
  const { session } = unwrap(await db.auth.getSession());
  if (session) {
    return session.user.id;
  }
  const { user } = unwrap(await db.auth.signInAnonymously());
  return user.id;
}

function toClaim(row) {
  return {
    userId: row.user_id,
    discordName: row.discord_name,
    createdAt: row.created_at ?? null,
    isBlocked: row.discord_name === BLOCKED_DISCORD_NAME
  };
}

async function fetchClaims(kind) {
  const { table, column } = CLAIM_KINDS[kind];
  const rows = unwrap(await db.from(table).select("*"));
  return new Map(rows.map(row => [row[column], toClaim(row)]));
}

async function insertClaim(kind, name, discordName) {
  const { table, column } = CLAIM_KINDS[kind];
  unwrap(await db.from(table).insert({
    [column]: name,
    user_id: state.currentUserId,
    discord_name: discordName
  }));
}

async function deleteClaim(kind, name) {
  const { table, column } = CLAIM_KINDS[kind];
  const deletedRows = unwrap(await db.from(table).delete().eq(column, name).select());
  if (deletedRows.length === 0) {
    const error = new Error("This claim could not be released.");
    error.code = "NOT_RELEASED";
    throw error;
  }
}

function requireAdminPassword() {
  const password = adminSession.getPassword();
  if (!password) {
    throw adminRejected("Admin session is missing its password. Please log in again.", true);
  }
  return password;
}

async function callApprovedRpc(functionName, params, rejectionMessage, endsSession = true) {
  const approved = unwrap(await db.rpc(functionName, params));
  if (!approved) {
    throw adminRejected(rejectionMessage, endsSession);
  }
}

async function verifyAdminPassword(password) {
  return Boolean(unwrap(await db.rpc("check_admin", { pw: password })));
}

async function adminInsertClaim(kind, name, discordName) {
  const { claimRpc, nameParam } = CLAIM_KINDS[kind];
  await callApprovedRpc(
    claimRpc,
    { pw: requireAdminPassword(), [nameParam]: name, discord_name_in: discordName },
    "Admin password was rejected. Please log in again."
  );
}

async function adminDeleteClaim(kind, name) {
  const { releaseRpc, nameParam } = CLAIM_KINDS[kind];
  await callApprovedRpc(
    releaseRpc,
    { pw: requireAdminPassword(), [nameParam]: name },
    "Admin password was rejected. Please log in again."
  );
}

async function adminReleaseClaimant(claimantName) {
  const count = unwrap(await db.rpc("admin_release_user_claims", {
    pw: requireAdminPassword(),
    claimant: claimantName
  }));
  if (count < 0) {
    throw adminRejected("Admin password was rejected. Please log in again.", true);
  }
  return count;
}

async function adminClearAllClaims(wipePassword) {
  await callApprovedRpc("admin_clear_claims", { wipe_pw: wipePassword }, "Wipe password was rejected.", false);
}

/* --------------------------------------------------------------- realtime */

function scheduleRefresh(kind) {
  clearTimeout(refreshTimers[kind]);
  refreshTimers[kind] = setTimeout(() => refreshClaims(kind), 150);
}

function subscribeToClaimChanges() {
  const channel = db.channel("claims-channel");
  Object.entries(CLAIM_KINDS).forEach(([kind, { table }]) => {
    channel.on("postgres_changes", { event: "*", schema: "public", table }, () => scheduleRefresh(kind));
  });

  let wasSubscribed = false;
  channel.subscribe(status => {
    state.realtime = status;
    if (status === "SUBSCRIBED") {
      if (wasSubscribed) {
        refreshAllClaims(); // catch up on anything missed while disconnected
      }
      wasSubscribed = true;
    }
    renderPanelIfOpen();
  });
}

/* ------------------------------------------------------------ derived data */

function isTaken(claim) {
  return Boolean(claim) && !claim.isBlocked;
}

function getOriginStats() {
  const countable = ORIGINS.filter(origin => !origin.isSpecial);
  let claimed = 0;
  let blocked = 0;
  for (const origin of countable) {
    const claim = state.claims.origin.get(origin.name);
    if (!claim) {
      continue;
    }
    if (claim.isBlocked) {
      blocked++;
    } else {
      claimed++;
    }
  }
  return {
    total: countable.length,
    claimed,
    blocked,
    available: countable.length - claimed - blocked
  };
}

function matchesFilter(origin) {
  if (state.activeFilter === FILTER_ALL) {
    return true;
  }
  const claim = state.claims.origin.get(origin.name);
  switch (state.activeFilter) {
    case FILTER_CLAIMED:
      return !origin.isSpecial && isTaken(claim);
    case FILTER_AVAILABLE:
      return !origin.isSpecial && !claim;
    case FILTER_BLOCKED:
      return !origin.isSpecial && Boolean(claim?.isBlocked);
    default:
      return origin.dlc === state.activeFilter;
  }
}

function matchesSearch(origin) {
  const query = state.searchQuery;
  return !query
    || origin.name.toLowerCase().includes(query)
    || origin.dlc.toLowerCase().includes(query);
}

function describeClaim(kind, claim, canManage) {
  if (!state.loaded[kind]) {
    return state.loadFailed ? "Status unknown" : "Loading…";
  }
  if (!claim) {
    return "Available";
  }
  if (claim.isBlocked) {
    return "Unavailable";
  }
  return canManage ? `Claimed — ${claim.discordName}` : "Claimed";
}

function describeAdminMeta(claim) {
  const when = formatDate(claim.createdAt);
  const parts = claim.isBlocked
    ? [`Blocker name: ${claim.discordName}`]
    : [`Claimed by ${claim.discordName}`, `acct ${shortId(claim.userId)}`];
  if (when) {
    parts.push(when);
  }
  return parts.join(" · ");
}

/* --------------------------------------------------------------- rendering */

function buildCard({ kind, name, description, badge, isSpecial = false, index }) {
  const known = state.loaded[kind];
  const claim = known ? state.claims[kind].get(name) : undefined;
  const isOwner = Boolean(claim) && claim.userId === state.currentUserId;
  const canManage = known && (isOwner || state.isAdmin);

  const card = elements.cardTemplate.content.firstElementChild.cloneNode(true);
  const badgeElement = card.querySelector(".badge");
  const actionButton = card.querySelector(".card-action");
  const blockButton = card.querySelector(".card-block");
  const meta = card.querySelector(".card-meta");

  card.dataset.kind = kind;
  card.dataset.name = name;
  card.style.setProperty("--index", index);
  card.classList.toggle("is-claimed", Boolean(claim));
  card.classList.toggle("is-blocked", Boolean(claim?.isBlocked));
  card.classList.toggle("is-special", isSpecial);

  card.querySelector(".card-name").textContent = name;
  card.querySelector(".card-desc").textContent = description;
  card.querySelector(".card-status-text").textContent = describeClaim(kind, claim, canManage);

  meta.hidden = !(state.isAdmin && claim);
  if (!meta.hidden) {
    meta.textContent = describeAdminMeta(claim);
  }

  badgeElement.classList.add(`badge--${badge.cssKey}`);
  badgeElement.textContent = badge.label;

  if (claim) {
    const verb = claim.isBlocked ? "Unblock" : "Release";
    actionButton.dataset.action = "release";
    actionButton.textContent = verb;
    actionButton.classList.add("btn--release");
    actionButton.setAttribute("aria-label", `${verb} ${name}`);
    actionButton.hidden = !canManage;
  } else {
    actionButton.dataset.action = "claim";
    actionButton.textContent = "Claim";
    actionButton.classList.add("btn--accent");
    actionButton.setAttribute("aria-label", `Claim ${name}`);
    actionButton.hidden = !known;
  }

  blockButton.hidden = !(known && state.isAdmin && !claim);
  blockButton.setAttribute("aria-label", `Block ${name}`);

  return card;
}

function renderStats() {
  const stats = getOriginStats();
  const loaded = state.loaded.origin;
  elements.totalCount.textContent = stats.total;
  elements.claimedCount.textContent = loaded ? stats.claimed : "–";
  elements.freeCount.textContent = loaded ? stats.available : "–";
  elements.blockedCount.textContent = loaded ? stats.blocked : "–";
}

function renderOrigins() {
  const visibleOrigins = ORIGINS.filter(origin => matchesFilter(origin) && matchesSearch(origin));
  const cards = visibleOrigins.map((origin, index) => {
    const dlc = DLCS_BY_NAME.get(origin.dlc);
    return buildCard({
      kind: "origin",
      name: origin.name,
      description: origin.description,
      badge: { label: dlc.name, cssKey: dlc.cssKey },
      isSpecial: origin.isSpecial,
      index
    });
  });

  elements.originGrid.replaceChildren(...cards);
  elements.emptyState.hidden = visibleOrigins.length > 0;
  renderStats();
}

function renderSystems() {
  const cards = SYSTEMS.map((system, index) => buildCard({
    kind: "system",
    name: system.name,
    description: system.description,
    badge: SYSTEM_BADGE,
    index
  }));

  elements.systemGrid.replaceChildren(...cards);
}

const renderers = { origin: renderOrigins, system: renderSystems };
const grids = { origin: elements.originGrid, system: elements.systemGrid };

function renderAll() {
  Object.values(renderers).forEach(render => render());
  renderPanelIfOpen();
}

// The fade-in only plays when a grid first receives real data, not on every
// re-render (search keystrokes, realtime updates, filter clicks).
function playEntrance(kind) {
  grids[kind].classList.add("is-entering");
  clearTimeout(entranceTimers[kind]);
  entranceTimers[kind] = setTimeout(() => grids[kind].classList.remove("is-entering"), 1200);
}

function renderFilters() {
  const buttons = FILTERS.map(({ value, label }) => {
    const button = document.createElement("button");
    const isActive = value === state.activeFilter;
    button.type = "button";
    button.className = "filter-btn";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.dataset.filter = value;
    button.textContent = label;
    return button;
  });

  elements.filters.replaceChildren(...buttons);
}

function updateAdminControls() {
  elements.adminLogin.hidden = state.isAdmin;
  elements.adminLogout.hidden = !state.isAdmin;
  elements.adminClear.hidden = !state.isAdmin;
  elements.adminPanel.hidden = !state.isAdmin;
}

function showLoadError(message) {
  state.loadFailed = true;
  elements.loadBanner.querySelector("span").textContent = message;
  elements.loadBanner.hidden = false;
  renderAll();
}

function clearLoadError() {
  state.loadFailed = false;
  elements.loadBanner.hidden = true;
}

/* ------------------------------------------------------------------ actions */

async function refreshClaims(kind) {
  const requestId = ++latestRequestIds[kind];
  try {
    const claims = await fetchClaims(kind);
    if (requestId !== latestRequestIds[kind]) {
      return;
    }
    const firstLoad = !state.loaded[kind];
    state.claims[kind] = claims;
    state.loaded[kind] = true;
    if (Object.values(state.loaded).every(Boolean)) {
      clearLoadError();
    }
    if (firstLoad) {
      playEntrance(kind);
    }
    renderers[kind]();
    renderPanelIfOpen();
  } catch (error) {
    console.error(`Could not load ${kind} claims:`, error);
    if (!state.loaded[kind]) {
      showLoadError("Couldn't load the latest claims, so statuses below are unknown.");
    }
  }
}

function refreshAllClaims() {
  return Promise.all(Object.keys(CLAIM_KINDS).map(refreshClaims));
}

async function attempt(action) {
  try {
    await action();
    return true;
  } catch (error) {
    console.error(error);
    toast(friendlyError(error), "error");
    if (error.endsSession) {
      endAdminSession("Admin session ended. Please log in again.");
    } else if (needsRefresh(error)) {
      await refreshAllClaims();
    }
    return false;
  }
}

function submitClaim({ kind, name }, discordName) {
  return attempt(async () => {
    if (state.isAdmin) {
      await adminInsertClaim(kind, name, discordName);
    } else {
      await insertClaim(kind, name, discordName);
    }
    await refreshClaims(kind);
    toast(`Claimed ${name}.`, "success");
  });
}

async function releaseClaim(kind, name) {
  const claim = state.claims[kind].get(name);
  const verb = claim?.isBlocked ? "Unblock" : "Release claim on";
  if (!confirm(`${verb} "${name}"?`)) {
    return;
  }

  await attempt(async () => {
    if (state.isAdmin) {
      await adminDeleteClaim(kind, name);
    } else {
      await deleteClaim(kind, name);
    }
    await refreshClaims(kind);
    toast(claim?.isBlocked ? `Unblocked ${name}.` : `Released ${name}.`, "success");
  });
}

async function blockEntry(kind, name) {
  if (!confirm(`Block "${name}"? It will show as Unavailable to everyone.`)) {
    return;
  }

  await attempt(async () => {
    await adminInsertClaim(kind, name, BLOCKED_DISCORD_NAME);
    await refreshClaims(kind);
    toast(`Blocked ${name}.`, "success");
  });
}

async function releaseClaimant(claimantName, count) {
  if (!confirm(`Release all ${count} claim${count === 1 ? "" : "s"} made under "${claimantName}"?`)) {
    return;
  }

  await attempt(async () => {
    const removed = await adminReleaseClaimant(claimantName);
    await refreshAllClaims();
    toast(`Released ${removed} claim${removed === 1 ? "" : "s"} for ${claimantName}.`, "success");
  });
}

function enterAdminMode() {
  state.isAdmin = true;
  updateAdminControls();
  renderAll();
}

function endAdminSession(message) {
  adminSession.end();
  state.isAdmin = false;
  panelModal.close();
  updateAdminControls();
  renderAll();
  if (message) {
    toast(message, "info");
  }
}

async function loginAsAdmin(password) {
  let verified;
  try {
    verified = await verifyAdminPassword(password);
  } catch (error) {
    console.error(error);
    return { ok: false, reason: "network" };
  }

  if (!verified) {
    return { ok: false, reason: "wrong" };
  }

  adminSession.start(password);
  enterAdminMode();
  toast("Logged in as admin.", "success");
  return { ok: true };
}

function logoutAdmin() {
  endAdminSession("Logged out.");
}

// Re-check a saved admin password so a rotated/removed password doesn't leave
// the admin UI showing while every action fails.
async function restoreAdminSession() {
  const password = adminSession.getPassword();
  if (!password) {
    return;
  }

  try {
    if (await verifyAdminPassword(password)) {
      enterAdminMode();
    } else {
      endAdminSession("Saved admin session is no longer valid. Please log in again.");
    }
  } catch (error) {
    console.error(error);
    toast("Couldn't verify your saved admin session. Showing the public view.", "error");
  }
}

/* ------------------------------------------------------------------- modals */

function createModal({ overlay, input, error, confirmButton, cancelButton, onSubmit, onClose, onOpen }) {
  const dialog = overlay.querySelector('[role="dialog"]');
  let returnFocus = null;
  let busy = false;

  const focusable = () => [...dialog.querySelectorAll("button, input, summary")]
    .filter(node => !node.disabled && node.offsetParent !== null);

  const modal = {
    get isOpen() {
      return overlay.classList.contains("open");
    },
    open() {
      returnFocus = document.activeElement;
      if (input) {
        input.value = "";
      }
      modal.setInvalid(false);
      overlay.classList.add("open");
      onOpen?.();
      (input ?? dialog).focus();
    },
    close() {
      if (!modal.isOpen) {
        return;
      }
      overlay.classList.remove("open");
      onClose?.();
      returnFocus?.focus?.();
      returnFocus = null;
    },
    setInvalid(isInvalid, message) {
      if (!error) {
        return;
      }
      if (message) {
        error.textContent = message;
      }
      input?.classList.toggle("is-invalid", isInvalid);
      error.hidden = !isInvalid;
    }
  };

  async function submit() {
    if (busy || !onSubmit) {
      return;
    }
    busy = true;
    confirmButton.disabled = true;
    try {
      await onSubmit(input.value, modal);
    } finally {
      busy = false;
      confirmButton.disabled = false;
      // Disabling the focused button drops focus to <body>, which would stop
      // Escape/Tab from reaching the modal. Put it back.
      if (modal.isOpen && !dialog.contains(document.activeElement)) {
        (input ?? dialog).focus();
      }
    }
  }

  confirmButton?.addEventListener("click", submit);
  cancelButton?.addEventListener("click", modal.close);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      modal.close();
    }
  });
  overlay.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.stopPropagation();
      modal.close();
    } else if (event.key === "Enter" && input && event.target === input) {
      event.preventDefault();
      submit();
    } else if (event.key === "Tab") {
      const nodes = focusable();
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  return modal;
}

function handleClaimSubmit(rawName, modal) {
  const discordName = rawName.trim();
  if (!discordName) {
    modal.setInvalid(true, "Please enter a name.");
    return;
  }
  if (!state.isAdmin && isReservedName(discordName)) {
    modal.setInvalid(true, "That name is reserved.");
    return;
  }

  const target = state.pendingClaim;
  modal.close();
  return submitClaim(target, discordName);
}

async function handleAdminSubmit(password, modal) {
  if (!password) {
    modal.setInvalid(true, "Enter the password.");
    return;
  }

  const result = await loginAsAdmin(password);
  if (result.ok) {
    modal.close();
  } else if (result.reason === "network") {
    modal.setInvalid(true, "Couldn't reach the server. Try again.");
  } else {
    modal.setInvalid(true, "Wrong password.");
  }
}

async function handleWipeSubmit(password, modal) {
  if (!password) {
    modal.setInvalid(true, "Enter the wipe password.");
    return;
  }
  if (!confirm("⚠ Delete ALL origin and system claims? This cannot be undone.")) {
    return;
  }

  try {
    await adminClearAllClaims(password);
  } catch (error) {
    if (error.name === "AdminRejected") {
      modal.setInvalid(true, error.message);
    } else {
      console.error(error);
      toast(friendlyError(error), "error");
    }
    return;
  }

  modal.close();
  toast("All claims cleared.", "success");
  await refreshAllClaims();
}

const claimModal = createModal({
  overlay: byId("claim-modal"),
  input: byId("claim-name"),
  error: byId("claim-error"),
  confirmButton: byId("claim-confirm"),
  cancelButton: byId("claim-cancel"),
  onSubmit: handleClaimSubmit,
  onClose: () => { state.pendingClaim = null; }
});

const adminModal = createModal({
  overlay: byId("admin-modal"),
  input: byId("admin-password"),
  error: byId("admin-error"),
  confirmButton: byId("admin-confirm"),
  cancelButton: byId("admin-cancel"),
  onSubmit: handleAdminSubmit
});

const wipeModal = createModal({
  overlay: byId("wipe-modal"),
  input: byId("wipe-password"),
  error: byId("wipe-error"),
  confirmButton: byId("wipe-confirm"),
  cancelButton: byId("wipe-cancel"),
  onSubmit: handleWipeSubmit
});

const panelModal = createModal({
  overlay: byId("panel-modal"),
  cancelButton: byId("panel-close"),
  onOpen: () => renderAdminPanel()
});

function openClaimModal(kind, name) {
  state.pendingClaim = { kind, name };
  elements.claimTitle.textContent = CLAIM_KINDS[kind].modalTitle;
  elements.claimSubject.textContent = name;
  claimModal.open();
}

/* -------------------------------------------------------------- admin panel */

const panelOpenKeys = new Set(["overview", "blocked"]);

function disclosure(key, summaryNodes, bodyNode, className = "panel-section") {
  const details = el("details", className);
  details.dataset.key = key;
  details.open = panelOpenKeys.has(key);
  details.addEventListener("toggle", () => {
    if (details.open) {
      panelOpenKeys.add(key);
    } else {
      panelOpenKeys.delete(key);
    }
  });
  const summary = el("summary");
  summary.append(...summaryNodes);
  details.append(summary, bodyNode);
  return details;
}

function allEntries() {
  const entries = [];
  for (const kind of Object.keys(CLAIM_KINDS)) {
    const catalogNames = new Set((kind === "origin" ? ORIGINS : SYSTEMS).map(item => item.name));
    for (const [name, claim] of state.claims[kind]) {
      entries.push({ kind, name, ...claim, inCatalog: catalogNames.has(name) });
    }
  }
  return entries;
}

function releaseButton(entry) {
  const button = el("button", "btn btn--release", entry.isBlocked ? "Unblock" : "Release");
  button.type = "button";
  button.dataset.panelAction = "release";
  button.dataset.kind = entry.kind;
  button.dataset.name = entry.name;
  button.setAttribute("aria-label", `${entry.isBlocked ? "Unblock" : "Release"} ${entry.name}`);
  return button;
}

function entryRow(entry, detail) {
  const row = el("li", "panel-row");
  const text = el("div", "panel-row__text");
  const title = el("div", "panel-row__title");
  title.append(
    el("span", "panel-row__name", entry.name),
    el("span", "panel-tag", CLAIM_KINDS[entry.kind].noun)
  );
  if (!entry.inCatalog) {
    title.append(el("span", "panel-tag panel-tag--warn", "not in catalog"));
  }
  text.append(title);
  if (detail) {
    text.append(el("div", "panel-row__sub", detail));
  }
  row.append(text, releaseButton(entry));
  return row;
}

function entryList(entries, detailFor) {
  const list = el("ul", "panel-list");
  list.append(...entries.map(entry => entryRow(entry, detailFor(entry))));
  return list;
}

function emptyNote(text) {
  return el("p", "panel-note", text);
}

function buildOverview(entries) {
  const stats = getOriginStats();
  const claimedEntries = entries.filter(entry => !entry.isBlocked);
  const systemsClaimed = claimedEntries.filter(entry => entry.kind === "system").length;
  const claimants = new Set(claimedEntries.map(entry => entry.discordName.trim().toLowerCase()));
  const accounts = new Set(claimedEntries.map(entry => entry.userId));

  const tiles = [
    ["Origins claimed", stats.claimed],
    ["Origins available", stats.available],
    ["Origins unavailable", stats.blocked],
    ["Systems claimed", systemsClaimed],
    ["Distinct names", claimants.size],
    ["Browser accounts", accounts.size]
  ];

  const wrap = el("div");
  const grid = el("div", "panel-tiles");
  for (const [label, value] of tiles) {
    const tile = el("div", "panel-tile");
    tile.append(el("span", "panel-tile__num", String(value)), el("span", "panel-tile__label", label));
    grid.append(tile);
  }
  wrap.append(
    grid,
    emptyNote("Exterminator is a special entry and isn't included in the origin totals. “Browser accounts” counts the anonymous sessions behind the claims; admin-made claims each get their own.")
  );
  return wrap;
}

function buildBlocked(blocked) {
  const wrap = el("div");
  const note = el("p", "panel-note");
  note.append(
    "Block marker: ",
    el("code", "panel-code", BLOCKED_DISCORD_NAME),
    ". An entry whose claimant name is exactly this shows as Unavailable and counts as neither claimed nor available. Use the Block button on any available card to add one."
  );
  wrap.append(note);
  wrap.append(blocked.length
    ? entryList(blocked, entry => {
      const when = formatDate(entry.createdAt);
      return `Blocker name: ${entry.discordName}${when ? ` · ${when}` : ""}`;
    })
    : emptyNote("Nothing is blocked right now."));
  return wrap;
}

function groupByClaimant(claimedEntries) {
  const groups = new Map();
  for (const entry of claimedEntries) {
    const key = entry.discordName.trim().toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, { key, label: entry.discordName.trim(), entries: [], accounts: new Set() });
    }
    const group = groups.get(key);
    group.entries.push(entry);
    group.accounts.add(entry.userId);
  }
  return [...groups.values()].sort((a, b) => b.entries.length - a.entries.length || a.label.localeCompare(b.label));
}

function buildClaimants(claimedEntries) {
  const groups = groupByClaimant(claimedEntries);
  if (groups.length === 0) {
    return emptyNote("No claims yet.");
  }

  const wrap = el("div", "panel-groups");
  for (const group of groups) {
    const summaryNodes = [
      el("span", "panel-group__name", group.label),
      el("span", "panel-count", `${group.entries.length}`)
    ];
    if (group.accounts.size > 1) {
      summaryNodes.push(el("span", "panel-tag panel-tag--warn", `${group.accounts.size} accounts`));
    }

    const body = el("div", "panel-group__body");
    body.append(entryList(group.entries, entry => {
      const when = formatDate(entry.createdAt);
      return `acct ${shortId(entry.userId)}${when ? ` · ${when}` : ""}`;
    }));

    const releaseAll = el("button", "btn btn--release", `Release all ${group.entries.length}`);
    releaseAll.type = "button";
    releaseAll.dataset.panelAction = "release-claimant";
    releaseAll.dataset.claimant = group.label;
    releaseAll.dataset.count = String(group.entries.length);
    body.append(releaseAll);

    wrap.append(disclosure(`claimant:${group.key}`, summaryNodes, body, "panel-group"));
  }
  return wrap;
}

function buildRecent(entries) {
  const recent = entries
    .filter(entry => entry.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  if (recent.length === 0) {
    return emptyNote("No timestamps yet. Run supabase.sql to add them, and new claims will show up here.");
  }
  return entryList(recent, entry => (entry.isBlocked
    ? `Blocked · ${formatDate(entry.createdAt)}`
    : `By ${entry.discordName} · ${formatDate(entry.createdAt)}`));
}

function buildSession() {
  const list = el("dl", "panel-facts");
  const facts = [
    ["Admin", "Logged in"],
    ["Your account id", state.currentUserId ?? "none"],
    ["Realtime", state.realtime],
    ["Saved in this browser", "Admin password (localStorage). Log out on shared computers."]
  ];
  for (const [term, value] of facts) {
    list.append(el("dt", null, term), el("dd", null, value));
  }
  return list;
}

function renderAdminPanel() {
  if (!state.isAdmin) {
    return;
  }

  const entries = allEntries();
  const blocked = entries.filter(entry => entry.isBlocked);
  const claimed = entries.filter(entry => !entry.isBlocked);
  const orphans = entries.filter(entry => !entry.inCatalog);
  const section = (key, title, body, count) => {
    const nodes = [el("span", "panel-section__title", title)];
    if (count != null) {
      nodes.push(el("span", "panel-count", String(count)));
    }
    return disclosure(key, nodes, body);
  };

  const sections = [
    section("overview", "Overview", buildOverview(entries)),
    section("blocked", "Blocked entries", buildBlocked(blocked), blocked.length),
    section("claimants", "Claims by name", buildClaimants(claimed), claimed.length),
    section("recent", "Recent activity", buildRecent(entries))
  ];
  if (orphans.length > 0) {
    sections.push(section(
      "orphans",
      "Not in catalog",
      entryList(orphans, entry => `${entry.isBlocked ? "Blocker name" : "Claimed by"} ${entry.discordName}`),
      orphans.length
    ));
  }
  sections.push(section("session", "Session", buildSession()));

  const scrollTop = elements.panelDialog.scrollTop;
  elements.panelBody.replaceChildren(...sections);
  elements.panelDialog.scrollTop = scrollTop;
  if (!elements.panelDialog.contains(document.activeElement)) {
    elements.panelDialog.focus({ preventScroll: true });
  }
}

function renderPanelIfOpen() {
  if (panelModal.isOpen && state.isAdmin) {
    renderAdminPanel();
  }
}

function handlePanelClick(event) {
  const button = event.target.closest("button[data-panel-action]");
  if (!button) {
    return;
  }

  const { panelAction, kind, name, claimant, count } = button.dataset;
  if (panelAction === "release") {
    releaseClaim(kind, name);
  } else if (panelAction === "release-claimant") {
    releaseClaimant(claimant, Number(count));
  }
}

/* ------------------------------------------------------------------- events */

function handleCardAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { kind, name } = button.closest(".card").dataset;
  switch (button.dataset.action) {
    case "claim":
      openClaimModal(kind, name);
      break;
    case "block":
      blockEntry(kind, name);
      break;
    default:
      releaseClaim(kind, name);
  }
}

function handleFilterClick(event) {
  const button = event.target.closest(".filter-btn");
  if (!button) {
    return;
  }

  state.activeFilter = button.dataset.filter;
  renderFilters();
  renderOrigins();
}

function handleSearchInput(event) {
  state.searchQuery = event.target.value.trim().toLowerCase();
  renderOrigins();
}

async function retryLoad() {
  if (!db) {
    location.reload();
    return;
  }
  if (!state.currentUserId) {
    try {
      state.currentUserId = await ensureAnonymousSession();
      subscribeToClaimChanges();
    } catch (error) {
      console.error(error);
      toast(friendlyError(error), "error");
      return;
    }
  }
  await refreshAllClaims();
}

function bindEvents() {
  elements.originGrid.addEventListener("click", handleCardAction);
  elements.systemGrid.addEventListener("click", handleCardAction);
  elements.filters.addEventListener("click", handleFilterClick);
  elements.searchInput.addEventListener("input", handleSearchInput);
  elements.adminLogin.addEventListener("click", adminModal.open);
  elements.adminLogout.addEventListener("click", logoutAdmin);
  elements.adminClear.addEventListener("click", wipeModal.open);
  elements.adminPanel.addEventListener("click", panelModal.open);
  elements.panelBody.addEventListener("click", handlePanelClick);
  elements.loadRetry.addEventListener("click", retryLoad);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.currentUserId) {
      refreshAllClaims();
    }
  });
}

async function init() {
  renderFilters();
  bindEvents();
  updateAdminControls();
  renderAll(); // show the catalog immediately, even if the network is slow or down

  if (!db) {
    showLoadError("Couldn't load the Supabase library. Check your connection and reload.");
    return;
  }

  try {
    state.currentUserId = await ensureAnonymousSession();
  } catch (error) {
    console.error(error);
    showLoadError("Couldn't start a session, so claiming is unavailable right now.");
    return;
  }

  subscribeToClaimChanges();
  await Promise.all([refreshAllClaims(), restoreAdminSession()]);
}

init();
