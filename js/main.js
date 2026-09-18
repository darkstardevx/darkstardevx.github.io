// ============================================================
// Cybercore System Panel — project data + interactions
// No framework, no build step: plain DOM.
//
// Systems data used to be a hand-maintained array here, which is exactly
// why it drifted: half the "In Development" entries pointed at repos that
// don't exist anymore, cybercore's language sat frozen on "Python" long
// after it went Rust-first, and every "updated" date was whatever day
// someone last remembered to touch this file. None of that can happen
// once it's a live read of the GitHub API instead of a copy of it.
// ============================================================

const OWNER = "darkstardevx";

// Real repos, not "systems" — the profile README repo (must be named
// exactly <user>/<user> for GitHub's profile feature), this site's own
// repo, and cyberplug's marketplace packaging wrapper (a build artifact
// of cyberplug, not a distinct product).
const EXCLUDED_REPOS = new Set(["darkstardevx", "darkstardevx.github.io", "cyberplug-bar-widget"]);

// No tags yet but pushed within this window = "Active Dev"; older = "In
// Development". Having any tag at all = "Released" — a cut version is a
// real milestone a recency window can't fake.
const ACTIVE_WINDOW_DAYS = 30;

const CACHE_KEY = "cybercore-ecosystem-cache-v1";

const CATEGORY_ACCENT = {
  released: { accent: "var(--cyan)", glow: "rgba(46, 241, 255, 0.35)", glowSoft: "rgba(46, 241, 255, 0.08)", badge: "badge-cyan" },
  active: { accent: "var(--magenta)", glow: "rgba(255, 46, 230, 0.35)", glowSoft: "rgba(255, 46, 230, 0.08)", badge: "badge-magenta" },
  dev: { accent: "var(--purple)", glow: "rgba(157, 78, 221, 0.35)", glowSoft: "rgba(157, 78, 221, 0.08)", badge: "badge-purple" },
};

// ------------------------------------------------------------
// Time helpers
// ------------------------------------------------------------
function daysSince(iso) {
  return (Date.now() - new Date(iso).getTime()) / 86400000;
}

function relativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ------------------------------------------------------------
// Live GitHub data
// ------------------------------------------------------------
async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status} on ${url}`);
  return res.json();
}

async function loadEcosystem() {
  const repos = await fetchJSON(
    `https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&sort=pushed`
  );
  const systemRepos = repos.filter((r) => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name));

  // One tags call per system repo, in parallel — tag presence is the
  // signal for "released" (see ACTIVE_WINDOW_DAYS comment above), and
  // doubles as the version string shown on the badge.
  const withTags = await Promise.all(
    systemRepos.map(async (repo) => {
      let tags = [];
      try {
        tags = await fetchJSON(`https://api.github.com/repos/${OWNER}/${repo.name}/tags`);
      } catch (_) {
        // Missing tags shouldn't break the whole page — worst case this
        // repo is classified by recency instead of by release.
      }
      return { repo, tags };
    })
  );

  const projects = withTags.map(({ repo, tags }) => {
    let category, badge;
    if (tags.length > 0) {
      category = "released";
      badge = `Released · ${tags[0].name}`;
    } else if (daysSince(repo.pushed_at) <= ACTIVE_WINDOW_DAYS) {
      category = "active";
      badge = "Active Dev";
    } else {
      category = "dev";
      badge = "In Development";
    }
    return {
      id: repo.name,
      name: repo.name,
      category,
      badge,
      lang: repo.language || "—",
      updated: repo.pushed_at.slice(0, 10),
      updatedRel: relativeTime(repo.pushed_at),
      desc: repo.description || "No description yet.",
      url: repo.html_url,
      stars: repo.stargazers_count,
      issues: repo.open_issues_count,
    };
  });

  projects.sort((a, b) => (a.updated < b.updated ? 1 : -1));

  const langTally = {};
  for (const p of projects) {
    if (p.lang === "—") continue;
    langTally[p.lang] = (langTally[p.lang] || 0) + 1;
  }

  const stats = {
    repoCount: projects.length,
    totalStars: projects.reduce((s, p) => s + p.stars, 0),
    totalIssues: projects.reduce((s, p) => s + p.issues, 0),
    lastPush: projects[0] || null, // already sorted newest-first
    langTally: Object.entries(langTally).sort((a, b) => b[1] - a[1]),
  };

  return { projects, stats };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch (_) {
    // Private browsing / storage disabled — fine, this is a convenience
    // fallback, not a requirement.
  }
}

async function getEcosystemData() {
  try {
    const data = await loadEcosystem();
    writeCache(data);
    return { data, stale: false };
  } catch (err) {
    console.warn("[ecosystem] live GitHub fetch failed, falling back to cache:", err);
    const cached = readCache();
    if (cached) return { data: cached.data, stale: true, cachedAt: cached.ts };
    throw err;
  }
}

// ------------------------------------------------------------
// Rendering
// ------------------------------------------------------------
function renderProjects(projects) {
  const counts = { released: 0, active: 0, dev: 0 };

  for (const container of document.querySelectorAll(".grid[data-tab]")) {
    container.innerHTML = "";
  }

  for (const p of projects) {
    counts[p.category]++;
    const grid = document.querySelector(`.grid[data-tab="${p.category}"]`);
    if (!grid) continue;

    const c = CATEGORY_ACCENT[p.category];
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--accent", c.accent);
    card.style.setProperty("--glow", c.glow);
    card.style.setProperty("--glow-soft", c.glowSoft);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.innerHTML = `
      <div class="card-head">
        <span class="card-title">${p.name}</span>
        <span class="badge ${c.badge}">${p.badge}</span>
      </div>
      <p class="card-desc">${p.desc}</p>
    `;
    card.addEventListener("click", () => openProjectModal(p));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(p);
      }
    });
    grid.appendChild(card);
  }

  document.getElementById("cnt-released").textContent = counts.released;
  document.getElementById("cnt-active").textContent = counts.active;
  document.getElementById("cnt-dev").textContent = counts.dev;

  const statGrid = document.getElementById("statGrid");
  const stats = [
    { n: counts.released, label: "Released", color: "var(--cyan)" },
    { n: counts.active, label: "Active Development", color: "var(--magenta)" },
    { n: counts.dev, label: "In Development", color: "var(--purple)" },
  ];
  statGrid.innerHTML = stats
    .map(
      (s) => `
      <div class="stat-card" style="--stat-color:${s.color}">
        <span class="stat-num">${s.n}</span>
        <span class="stat-label">${s.label}</span>
      </div>`
    )
    .join("");

  // Re-run tilt on the freshly-built cards — VanillaTilt only wires up
  // elements that exist at init() time, and these didn't exist until now.
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.VanillaTilt && !prefersReducedMotion) {
    VanillaTilt.init(document.querySelectorAll(".grid[data-tab] .card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02,
      perspective: 900,
    });
  }
}

function renderLiveGrid(stats, meta) {
  const grid = document.getElementById("liveGrid");
  if (!grid) return;

  const topLangs = stats.langTally
    .slice(0, 3)
    .map(([lang, n]) => `${lang} (${n})`)
    .join(" · ") || "—";

  const rows = [
    ["SYSTEMS TRACKED", stats.repoCount],
    ["TOTAL STARS", stats.totalStars],
    ["OPEN ISSUES", stats.totalIssues],
    ["LAST PUSH", stats.lastPush ? `${stats.lastPush.updatedRel} · ${stats.lastPush.name}` : "—"],
    ["TOP LANGUAGES", topLangs],
  ];

  grid.innerHTML = rows
    .map(([label, value]) => `<div class="info-row"><span>${label}</span><span class="v-cyan">${value}</span></div>`)
    .join("");

  const note = document.getElementById("liveNote");
  if (note) {
    note.textContent = meta.stale
      ? `cached snapshot (github.com unreachable) · saved ${relativeTime(new Date(meta.cachedAt).toISOString())}`
      : "live from api.github.com just now";
  }
}

function renderEcosystemError() {
  const grid = document.getElementById("liveGrid");
  if (grid) {
    grid.innerHTML = `<div class="info-row"><span>STATUS</span><span class="v-cyan">Couldn't reach api.github.com — <a href="https://github.com/${OWNER}?tab=repositories" target="_blank" rel="noopener" style="color:var(--cyan);">browse repos directly ↗</a></span></div>`;
  }
  for (const container of document.querySelectorAll(".grid[data-tab]")) {
    container.innerHTML = `<p class="card-desc">Couldn't load live systems data. <a href="https://github.com/${OWNER}?tab=repositories" target="_blank" rel="noopener" style="color:var(--cyan);">Browse the repos on GitHub instead ↗</a></p>`;
  }
}

async function initEcosystem() {
  try {
    const { data, stale, cachedAt } = await getEcosystemData();
    renderProjects(data.projects);
    renderLiveGrid(data.stats, { stale, cachedAt });
  } catch (err) {
    console.error("[ecosystem] no live data and no cache available:", err);
    renderEcosystemError();
  }
}

// ------------------------------------------------------------
// Project modal
// ------------------------------------------------------------
const projectModal = document.getElementById("projectModal");
const projectBackdrop = document.getElementById("modalBackdrop");

function openProjectModal(p) {
  document.getElementById("modalBadge").innerHTML =
    `<span class="badge ${CATEGORY_ACCENT[p.category].badge}">${p.badge}</span>`;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalDesc").textContent = p.desc;
  document.getElementById("modalMeta").innerHTML = `
    <div>LANG <span>${p.lang}</span></div>
    <div>UPDATED <span>${p.updatedRel}</span></div>
    <div>STARS <span>${p.stars}</span></div>
    <div>OPEN ISSUES <span>${p.issues}</span></div>
  `;
  document.getElementById("modalLink").href = p.url;
  openModal(projectModal, projectBackdrop);
}

function openModal(modal, backdrop) {
  modal.classList.add("open");
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(modal, backdrop) {
  modal.classList.remove("open");
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", () => closeModal(projectModal, projectBackdrop));
projectBackdrop.addEventListener("click", () => closeModal(projectModal, projectBackdrop));

// ------------------------------------------------------------
// Statement modal
// ------------------------------------------------------------
const statementModal = document.getElementById("statementModal");
const statementBackdrop = document.getElementById("statementBackdrop");

document.getElementById("openStatement").addEventListener("click", () => openModal(statementModal, statementBackdrop));
document.getElementById("statementClose").addEventListener("click", () => closeModal(statementModal, statementBackdrop));
statementBackdrop.addEventListener("click", () => closeModal(statementModal, statementBackdrop));

// Escape closes whichever modal/drawer is open
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeModal(projectModal, projectBackdrop);
  closeModal(statementModal, statementBackdrop);
  closeDrawer();
});

// ------------------------------------------------------------
// Hamburger drawer
// ------------------------------------------------------------
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");

function openDrawer() {
  drawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  if (drawer.classList.contains("open")) closeDrawer();
  else openDrawer();
});
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.querySelectorAll(".drawer-link").forEach((a) => a.addEventListener("click", closeDrawer));

// ------------------------------------------------------------
initEcosystem();

// ------------------------------------------------------------
// Futuristic touch: cursor-tracked 3D tilt + glare on every card. The
// Connect/Support cards exist at load time, so they're wired here; the
// dynamically-built Systems cards don't exist yet (initEcosystem() above
// is async and hasn't resolved) — they get the same treatment inside
// renderProjects() once they're actually in the DOM.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.VanillaTilt && !prefersReducedMotion) {
  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    scale: 1.02,
    perspective: 900,
  });
}

// ------------------------------------------------------------
// AOS: fade/slide sections and hero elements in as they scroll into view.
// AOS has its own reduced-motion handling (disable: "reduce-motion") so it
// doesn't need to be gated by prefersReducedMotion again here.
// ------------------------------------------------------------
if (window.AOS) {
  AOS.init({
    duration: 650,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
    disable: "reduce-motion",
  });
}

// ------------------------------------------------------------
// Typed.js: re-type each terminal `.prompt` line the first time it scrolls
// into view, instead of it just being there — the "> whoami" / "> cat
// career.log" lines are what actually sell the terminal feel. Leaves the
// static text in place until then (progressive enhancement: still fully
// readable with no JS), and never touches elements with nested markup
// (hero tagline keeps its <strong> instead of being flattened to text).
// ------------------------------------------------------------
if (window.Typed && !prefersReducedMotion && "IntersectionObserver" in window) {
  const prompts = document.querySelectorAll(".prompt");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        io.unobserve(el);
        const text = el.textContent;
        el.textContent = "";
        new Typed(el, {
          strings: [text],
          typeSpeed: 14,
          showCursor: true,
          cursorChar: "▌",
        });
      }
    },
    { threshold: 0.6 }
  );
  prompts.forEach((el) => io.observe(el));
}

// ------------------------------------------------------------
// tsParticles: a faint constellation field behind everything — sits under
// the real content (z-index:0 vs main's z-index:1) and stays out of the
// way of reading, but reacts to the cursor in the empty margins around the
// centered column. Skipped entirely under reduced motion.
// ------------------------------------------------------------
if (window.tsParticles && !prefersReducedMotion) {
  tsParticles.load("tsparticles", {
    fpsLimit: 60,
    background: { color: "transparent" },
    particles: {
      number: { value: 55, density: { enable: true, area: 900 } },
      color: { value: ["#2ef1ff", "#ff2ee6", "#9d4edd"] },
      links: { enable: true, distance: 130, color: "#9d4edd", opacity: 0.22, width: 1 },
      move: { enable: true, speed: 0.6, outModes: { default: "out" } },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 2.5 } },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 140, links: { opacity: 0.45 } } },
    },
    detectRetina: true,
  });
}
