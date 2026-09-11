// ============================================================
// Cybercore System Panel — project data + interactions
// No framework, no build step: plain DOM, one data array.
// ============================================================

const PROJECTS = [
  {
    id: "cyberdeck",
    name: "cyberdeck",
    category: "released",
    badge: "Released · v1.0.0",
    lang: "Rust",
    updated: "2026-07-28",
    desc: "The Ultimate Systems Intelligence Framework — a high-level layout system, configuration matrix, and theme compilation engine for advanced local environments. Feature-complete and production-ready as of v1.0.0.",
    url: "https://github.com/darkstardevx/cyberdeck",
  },
  {
    id: "cyberplug",
    name: "cyberplug",
    category: "active",
    badge: "Active Dev",
    lang: "Rust",
    updated: "2026-09-11",
    desc: "Rust TUI plugin manager for Omarchy's Quattro shell — discover, install, enable, and configure plugins from the bar, without leaving the keyboard. Ships as an Omarchy bar-widget plugin.",
    url: "https://github.com/darkstardevx/cyberplug",
  },
  {
    id: "cybercore",
    name: "cybercore",
    category: "active",
    badge: "Active Dev",
    lang: "Python",
    updated: "2026-09-10",
    desc: "The master definition repository of the Cybercore Systems Framework — the canonical CYBERGRID color palette, shared design tokens, and filesystem paths consumed by every downstream module.",
    url: "https://github.com/darkstardevx/cybercore",
  },
  {
    id: "ddrop",
    name: "ddrop",
    category: "active",
    badge: "Active Dev",
    lang: "Rust",
    updated: "2026-06-26",
    desc: "A high-performance, secure, and decentralized local file-sharing utility built with Rust.",
    url: "https://github.com/darkstardevx/ddrop",
  },
  {
    id: "hypr-audio-hud",
    name: "hypr-audio-hud",
    category: "active",
    badge: "Active Dev",
    lang: "Shell",
    updated: "2026-06-18",
    desc: "An interactive, cyberpunk terminal audio recording HUD designed specifically for Hyprland 0.55+ and Ghostty.",
    url: "https://github.com/darkstardevx/hypr-audio-hud",
  },
  {
    id: "cybervault",
    name: "cybervault",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "High-performance configuration vault, cryptographic state synchronizer, and environment deployment machine.",
    url: "https://github.com/darkstardevx/cybervault",
  },
  {
    id: "cyberterm",
    name: "cyberterm",
    category: "dev",
    badge: "In Dev",
    lang: "Rust",
    updated: "2026-07-06",
    desc: "A highly customizable, scriptable terminal emulator built from the ground up in Rust, optimized for high-luminance diagnostic output.",
    url: "https://github.com/darkstardevx/cyberterm",
  },
  {
    id: "cyberview",
    name: "cyberview",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "High-speed, minimalist, keyboard-centric image viewer built following modern sxiv conventions.",
    url: "https://github.com/darkstardevx/cyberview",
  },
  {
    id: "cybertest",
    name: "cybertest",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "Streamlined security validation harness, local configuration scanner, and penetration testing engine.",
    url: "https://github.com/darkstardevx/cybertest",
  },
  {
    id: "cybershell",
    name: "cybershell",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "Performance-tuned shell configuration toolkit and dynamic layout compilation workspace.",
    url: "https://github.com/darkstardevx/cybershell",
  },
  {
    id: "cybermeta",
    name: "cybermeta",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "High-capacity EXIF metadata processor and deep image telemetry parser.",
    url: "https://github.com/darkstardevx/cybermeta",
  },
  {
    id: "cyberkit",
    name: "cyberkit",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "Highly modular Open Source Intelligence (OSINT) gathering and reconnaissance suite.",
    url: "https://github.com/darkstardevx/cyberkit",
  },
  {
    id: "cybergtk",
    name: "cybergtk",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "GTK theme asset processing pipeline and unified layout synchronization tools.",
    url: "https://github.com/darkstardevx/cybergtk",
  },
  {
    id: "cyberdev",
    name: "cyberdev",
    category: "dev",
    badge: "In Dev",
    lang: "—",
    updated: "2026-07-06",
    desc: "Custom automation layout compiler, scripting tools, and optimized system development toolkit.",
    url: "https://github.com/darkstardevx/cyberdev",
  },
];

const CATEGORY_ACCENT = {
  released: { accent: "var(--cyan)", glow: "rgba(46, 241, 255, 0.35)", glowSoft: "rgba(46, 241, 255, 0.08)", badge: "badge-cyan" },
  active: { accent: "var(--magenta)", glow: "rgba(255, 46, 230, 0.35)", glowSoft: "rgba(255, 46, 230, 0.08)", badge: "badge-magenta" },
  dev: { accent: "var(--purple)", glow: "rgba(157, 78, 221, 0.35)", glowSoft: "rgba(157, 78, 221, 0.08)", badge: "badge-purple" },
};

function renderProjects() {
  const counts = { released: 0, active: 0, dev: 0 };

  for (const p of PROJECTS) {
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
  document.getElementById("modalMeta").innerHTML =
    `<div>LANG <span>${p.lang}</span></div><div>UPDATED <span>${p.updated}</span></div>`;
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
renderProjects();
