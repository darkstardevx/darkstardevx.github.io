# darkstardevx.github.io — Cybercore System Panel

Personal GitHub Pages site: a directory of the Cybercore Systems ecosystem.
Same proven structural pattern as [subgridsec.org](https://subgridsec.org)
(terminal-window chrome, tabbed project matrix, hamburger drawer) with a
darker, more purple/magenta/pink/cyan neon treatment and its own logo mark.

No build step — plain HTML/CSS/JS, deploys as-is via GitHub Pages.

## Structure

```
index.html          — single page: hero, overview, systems, about, connect
assets/style.css     — theme (see :root custom properties for the palette)
assets/logo.svg      — the hexagon/core mark (unique to this site)
assets/icons/*.svg   — line icons (github, mail, external, close, hex, grid, terminal)
assets/favicons/     — generated PNG favicons + favicon.ico
js/main.js           — project data (PROJECTS array) + all interactivity
```

## Editing the project list

Everything in the Systems section is generated from the `PROJECTS` array at
the top of `js/main.js` — add/edit/remove an entry there, no HTML to touch.
Each entry needs `category` (`released` / `active` / `dev`, drives which tab
and accent color it gets), `badge`, `lang`, `updated`, `desc`, and `url`.

Only public repos belong here — this is a public page.

## Local preview

```bash
python3 -m http.server 8000
```

## Deploy

This directory *is* the `darkstardevx.github.io` repo root. Push `main` to
GitHub Pages when ready — **note this replaces the currently-live site**,
which is a different, older design.
