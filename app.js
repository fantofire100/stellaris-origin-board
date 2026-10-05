const SUPABASE_URL = "https://nwwxtmlghmtdkjoyivja.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53d3h0bWxnaG10ZGtqb3lpdmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzcyNTAsImV4cCI6MjA5MjM1MzI1MH0.dbqeqA_4-imfjYTXzgH_lWS9sJO4lB6dDoQ3Zeb-8ow";

const ADMIN_PASSWORD_STORAGE_KEY = "stellaris_admin_pw";
const BLOCKED_DISCORD_NAME = "No";

const FILTER_ALL = "all";
const FILTER_AVAILABLE = "unclaimed";
const FILTER_CLAIMED = "claimed";

const CLAIM_KINDS = {
  origin: {
    table: "claims",
    column: "origin",
    nameParam: "origin_name",
    claimRpc: "admin_claim_origin",
    releaseRpc: "admin_release_claim",
    modalTitle: "Claim Origin"
  },
  system: {
    table: "system_claims",
    column: "system",
    nameParam: "system_name",
    claimRpc: "admin_claim_system",
    releaseRpc: "admin_release_system_claim",
    modalTitle: "Claim System"
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

const state = {
  currentUserId: null,
  isAdmin: false,
  activeFilter: FILTER_ALL,
  searchQuery: "",
  claims: { origin: new Map(), system: new Map() },
  pendingClaim: null
};

const latestRequestIds = { origin: 0, system: 0 };

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const adminSession = {
  isActive: () => Boolean(localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY)),
  getPassword: () => localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY),
  start: password => localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password),
  end: () => localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY)
};

function unwrap({ data, error }) {
  if (error) {
    throw new Error(error.message, { cause: error });
  }
  return data;
}

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
    throw new Error("This claim could not be released.");
  }
}

function requireAdminPassword() {
  const password = adminSession.getPassword();
  if (!password) {
    throw new Error("Admin session is missing its password. Please log in again.");
  }
  return password;
}

async function callApprovedRpc(functionName, params, rejectionMessage) {
  const approved = unwrap(await db.rpc(functionName, params));
  if (!approved) {
    throw new Error(rejectionMessage);
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
    "Admin password was rejected."
  );
}

async function adminDeleteClaim(kind, name) {
  const { releaseRpc, nameParam } = CLAIM_KINDS[kind];
  await callApprovedRpc(
    releaseRpc,
    { pw: requireAdminPassword(), [nameParam]: name },
    "Admin password was rejected."
  );
}

async function adminClearAllClaims(wipePassword) {
  await callApprovedRpc("admin_clear_claims", { wipe_pw: wipePassword }, "Wipe password was rejected.");
}

function subscribeToClaimChanges(onChange) {
  const channel = db.channel("claims-channel");
  Object.entries(CLAIM_KINDS).forEach(([kind, { table }]) => {
    channel.on("postgres_changes", { event: "*", schema: "public", table }, () => onChange(kind));
  });
  channel.subscribe();
}

function byId(id) {
  return document.getElementById(id);
}

const elements = {
  totalCount: byId("total-count"),
  claimedCount: byId("claimed-count"),
  freeCount: byId("free-count"),
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
  adminClear: byId("admin-clear")
};

function isTaken(claim) {
  return Boolean(claim) && !claim.isBlocked;
}

function matchesFilter(origin) {
  if (state.activeFilter === FILTER_ALL) {
    return true;
  }
  if (state.activeFilter === FILTER_CLAIMED) {
    return !origin.isSpecial && isTaken(state.claims.origin.get(origin.name));
  }
  if (state.activeFilter === FILTER_AVAILABLE) {
    return !origin.isSpecial && !isTaken(state.claims.origin.get(origin.name));
  }
  return origin.dlc === state.activeFilter;
}

function matchesSearch(origin) {
  const query = state.searchQuery;
  return !query
    || origin.name.toLowerCase().includes(query)
    || origin.dlc.toLowerCase().includes(query);
}

function describeClaim(claim, canManage) {
  if (!claim) {
    return "Available";
  }
  return canManage ? `Claimed — ${claim.discordName}` : "Claimed";
}

function buildCard({ kind, name, description, badge, isSpecial = false, index }) {
  const claim = state.claims[kind].get(name);
  const isOwner = Boolean(claim) && claim.userId === state.currentUserId;
  const canManage = isOwner || state.isAdmin;

  const card = elements.cardTemplate.content.firstElementChild.cloneNode(true);
  const badgeElement = card.querySelector(".badge");
  const actionButton = card.querySelector("button");

  card.dataset.kind = kind;
  card.dataset.name = name;
  card.style.setProperty("--index", index);
  card.classList.toggle("is-claimed", Boolean(claim));
  card.classList.toggle("is-blocked", Boolean(claim?.isBlocked));
  card.classList.toggle("is-special", isSpecial);

  card.querySelector(".card-name").textContent = name;
  card.querySelector(".card-desc").textContent = description;
  card.querySelector(".card-status-text").textContent = describeClaim(claim, canManage);

  badgeElement.classList.add(`badge--${badge.cssKey}`);
  badgeElement.textContent = badge.label;

  actionButton.dataset.action = claim ? "release" : "claim";
  actionButton.textContent = claim ? "Release" : "Claim";
  actionButton.classList.add(claim ? "btn--release" : "btn--accent");
  actionButton.hidden = Boolean(claim) && !canManage;

  return card;
}

function renderStats() {
  const countableOrigins = ORIGINS.filter(origin => !origin.isSpecial);
  const claimedTotal = countableOrigins.filter(origin => isTaken(state.claims.origin.get(origin.name))).length;

  elements.totalCount.textContent = countableOrigins.length;
  elements.claimedCount.textContent = claimedTotal;
  elements.freeCount.textContent = countableOrigins.length - claimedTotal;
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

function renderAll() {
  Object.values(renderers).forEach(render => render());
}

function renderFilters() {
  const buttons = FILTERS.map(({ value, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.classList.toggle("is-active", value === state.activeFilter);
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
}

async function refreshClaims(kind) {
  const requestId = ++latestRequestIds[kind];
  try {
    const claims = await fetchClaims(kind);
    if (requestId !== latestRequestIds[kind]) {
      return;
    }
    state.claims[kind] = claims;
    renderers[kind]();
  } catch (error) {
    console.error(`Could not load ${kind} claims:`, error);
  }
}

function refreshAllClaims() {
  return Promise.all(Object.keys(CLAIM_KINDS).map(refreshClaims));
}

async function attempt(action) {
  try {
    await action();
  } catch (error) {
    console.error(error);
    alert(error.message);
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
  });
}

async function releaseClaim(kind, name) {
  if (!confirm(`Release claim on "${name}"?`)) {
    return;
  }

  await attempt(async () => {
    if (state.isAdmin) {
      await adminDeleteClaim(kind, name);
    } else {
      await deleteClaim(kind, name);
    }
    await refreshClaims(kind);
  });
}

async function loginAsAdmin(password) {
  let verified = false;
  try {
    verified = await verifyAdminPassword(password);
  } catch (error) {
    console.error(error);
  }

  if (!verified) {
    return false;
  }

  adminSession.start(password);
  state.isAdmin = true;
  updateAdminControls();
  renderAll();
  await refreshAllClaims();
  return true;
}

async function logoutAdmin() {
  adminSession.end();
  state.isAdmin = false;
  updateAdminControls();
  renderAll();
  await refreshAllClaims();
}

async function clearAllClaims() {
  const wipePassword = prompt("Enter wipe password to clear ALL claims:");
  if (!wipePassword) {
    return;
  }

  if (!confirm("⚠ Are you sure you want to delete ALL origin and system claims? This cannot be undone.")) {
    return;
  }

  await attempt(async () => {
    await adminClearAllClaims(wipePassword);
    await refreshAllClaims();
  });
}

function createModal({ overlay, input, error, confirmButton, cancelButton, onSubmit, onClose }) {
  const modal = {
    open() {
      input.value = "";
      modal.setInvalid(false);
      overlay.classList.add("open");
      input.focus();
    },
    close() {
      overlay.classList.remove("open");
      onClose?.();
    },
    setInvalid(isInvalid) {
      input.classList.toggle("is-invalid", isInvalid);
      error.hidden = !isInvalid;
    }
  };

  const submit = () => onSubmit(input.value, modal);

  confirmButton.addEventListener("click", submit);
  cancelButton.addEventListener("click", modal.close);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      modal.close();
    }
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      submit();
    } else if (event.key === "Escape") {
      modal.close();
    }
  });

  return modal;
}

function handleClaimSubmit(rawName, modal) {
  const discordName = rawName.trim();
  if (!discordName) {
    modal.setInvalid(true);
    return;
  }

  const target = state.pendingClaim;
  modal.close();
  return submitClaim(target, discordName);
}

async function handleAdminSubmit(password, modal) {
  if (await loginAsAdmin(password)) {
    modal.close();
  } else {
    modal.setInvalid(true);
  }
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

function openClaimModal(kind, name) {
  state.pendingClaim = { kind, name };
  elements.claimTitle.textContent = CLAIM_KINDS[kind].modalTitle;
  elements.claimSubject.textContent = name;
  claimModal.open();
}

function handleCardAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { kind, name } = button.closest(".card").dataset;
  if (button.dataset.action === "claim") {
    openClaimModal(kind, name);
  } else {
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

function bindEvents() {
  elements.originGrid.addEventListener("click", handleCardAction);
  elements.systemGrid.addEventListener("click", handleCardAction);
  elements.filters.addEventListener("click", handleFilterClick);
  elements.searchInput.addEventListener("input", handleSearchInput);
  elements.adminLogin.addEventListener("click", adminModal.open);
  elements.adminLogout.addEventListener("click", logoutAdmin);
  elements.adminClear.addEventListener("click", clearAllClaims);
}

async function init() {
  renderFilters();
  bindEvents();

  try {
    state.currentUserId = await ensureAnonymousSession();
  } catch (error) {
    console.error(error);
    alert("Could not create anonymous session.");
    return;
  }

  state.isAdmin = adminSession.isActive();
  updateAdminControls();
  subscribeToClaimChanges(refreshClaims);
  await refreshAllClaims();
}

init();
