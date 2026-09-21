const OWNER = "darkstardevx";
const EXCLUDED = new Set(["darkstardevx", "darkstardevx.github.io", "cyberplug-bar-widget"]);
const ACTIVE_DAYS = 30;
const CACHE_KEY = "darkstar-home-ecosystem-v2";
const COLORS = { released: "#74b5ad", active: "#c47748", dev: "#a9a2c8" };
let projects = [];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const daysSince = (iso) => (Date.now() - new Date(iso).getTime()) / 86400000;
function relativeTime(iso) { const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); return days < 1 ? "today" : days === 1 ? "yesterday" : `${days}d ago`; }

async function fetchJSON(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub ${response.status}`);
  return response.json();
}

async function loadProjects() {
  const repos = await fetchJSON(`https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&sort=pushed`);
  const visible = repos.filter((repo) => !repo.fork && !repo.archived && !EXCLUDED.has(repo.name));
  const tagged = await Promise.all(visible.map(async (repo) => {
    let tags = [];
    try { tags = await fetchJSON(`https://api.github.com/repos/${OWNER}/${repo.name}/tags`); } catch (_) { /* recency still gives us a useful category */ }
    const category = tags.length ? "released" : daysSince(repo.pushed_at) <= ACTIVE_DAYS ? "active" : "dev";
    return { name: repo.name, desc: repo.description || "No field note yet.", lang: repo.language || "Unspecified", url: repo.html_url, stars: repo.stargazers_count, issues: repo.open_issues_count, pushed: repo.pushed_at, updated: relativeTime(repo.pushed_at), category, version: tags[0]?.name || "" };
  }));
  return tagged.sort((a, b) => new Date(b.pushed) - new Date(a.pushed));
}

function cachedProjects() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (_) { return null; } }
function cacheProjects(data) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (_) {} }

function renderStats(list, stale = false) {
  const counts = list.reduce((all, project) => { all[project.category]++; return all; }, { released: 0, active: 0, dev: 0 });
  $("#cnt-all").textContent = list.length;
  $("#cnt-released").textContent = counts.released;
  $("#cnt-active").textContent = counts.active;
  $("#cnt-dev").textContent = counts.dev;
  $("#statGrid").innerHTML = `<div><strong>${list.length}</strong><span>systems tracked</span></div><div><strong>${counts.released}</strong><span>released</span></div><div><strong>${counts.active + counts.dev}</strong><span>in motion</span></div><div><strong>${stale ? "cached" : "live"}</strong><span>GitHub signal</span></div>`;
  $("#liveNote").textContent = stale ? "cached GitHub snapshot · refresh later for the live signal" : "live from api.github.com · updated just now";
}

function renderProjects(filter = "all") {
  const grid = $("#projectGrid");
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  if (!visible.length) { grid.innerHTML = `<div class="project-empty">No projects in this channel yet.</div>`; return; }
  grid.innerHTML = visible.map((project) => {
    const color = COLORS[project.category];
    const status = project.category === "released" ? `released${project.version ? ` · ${escapeHTML(project.version)}` : ""}` : project.category === "active" ? "active development" : "in development";
    return `<article class="project-card" tabindex="0" role="button" data-project="${escapeHTML(project.name)}" style="--accent:${color}"><span class="card-meta">${status}</span><h3>${escapeHTML(project.name)}</h3><p>${escapeHTML(project.desc)}</p><span class="card-lang">${escapeHTML(project.lang)} · ${escapeHTML(project.updated)}</span></article>`;
  }).join("");
  $$(".project-card", grid).forEach((card) => { const project = projects.find((item) => item.name === card.dataset.project); card.addEventListener("click", () => openProject(project)); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProject(project); } }); });
}

function openProject(project) {
  if (!project) return;
  $("#modalBadge").textContent = `${project.category} / ${project.lang}`;
  $("#modalTitle").textContent = project.name;
  $("#modalDesc").textContent = project.desc;
  $("#modalMeta").innerHTML = `<span>updated ${escapeHTML(project.updated)}</span><span>★ ${project.stars}</span><span>issues ${project.issues}</span>`;
  $("#modalLink").href = project.url;
  openDialog($("#projectModal"));
}

function openDialog(dialog) { $("#modalBackdrop").classList.add("open"); if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
function closeDialog(dialog) { $("#modalBackdrop").classList.remove("open"); if (dialog.open && typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }

async function init() {
  try { projects = await loadProjects(); cacheProjects(projects); renderStats(projects); renderProjects(); }
  catch (error) { console.warn("GitHub signal unavailable", error); projects = cachedProjects() || []; if (projects.length) { renderStats(projects, true); renderProjects(); } else { $("#projectGrid").innerHTML = `<div class="project-empty">GitHub is quiet right now. <a href="https://github.com/${OWNER}?tab=repositories" target="_blank" rel="noopener">Browse the forge directly ↗</a></div>`; $("#liveNote").textContent = "GitHub signal unavailable · direct link above"; } }
}

$$('.filter').forEach((button) => button.addEventListener('click', () => { $$('.filter').forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', item === button ? 'true' : 'false'); }); renderProjects(button.dataset.filter); }));
$("#openStatement").addEventListener("click", () => openDialog($("#statementModal")));
$("#modalClose").addEventListener("click", () => closeDialog($("#projectModal")));
$("#statementClose").addEventListener("click", () => closeDialog($("#statementModal")));
$("#modalBackdrop").addEventListener("click", () => { closeDialog($("#projectModal")); closeDialog($("#statementModal")); });
$$('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(dialog); }));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeDialog($("#projectModal")); closeDialog($("#statementModal")); } });

const menuButton = $("#menuBtn");
const mobileNav = $("#mobileNav");
menuButton.addEventListener("click", () => { const open = mobileNav.classList.toggle("open"); menuButton.setAttribute("aria-expanded", String(open)); });
$$('#mobileNav a').forEach((link) => link.addEventListener('click', () => { mobileNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));

init();
