# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**[← Back to wp_root](../../../CLAUDE.md)** | [AGENTS.md](AGENTS.md) | [README.md](README.md)

## Project Overview

Theatrum Animation adds GSAP-powered animations to any block via the block inspector
(scroll/load/hover triggers), plus a standalone JS-free `tm-*` CSS utility class layer and a
GSAP stagger option for cascading a parent block's entrance children.

**This file stays intentionally thin — [README.md](README.md) is the real reference**: full
architecture, all ~60 animations by category, the block editor panel's control-by-control
behavior, stagger internals, the `tm-*` CSS utilities, and a live "Next Steps" list ordered
by severity. Read it before making non-trivial changes here; this file only orients you and
points at the code review for known issues.

## Build & Development Commands

```bash
npm run start          # watch both bundles in parallel (main + editor)
npm run build           # production build (main + editor)
npm run build:editor    # editor only
npm run typecheck       # tsc --noEmit
npm run deploy           # alias for build
```

Two Vite builds: `vite.config.js` → `dist/main.js` (frontend, bundles GSAP) and
`vite.config.editor.js` → `dist/editor.js` (block editor, externalizes React/`@wordpress/*`).

## Architecture (orientation only — see README for depth)

```
src/
├── index.ts          # frontend entry: init + MutationObserver
├── engine.ts          # shared state/helpers used by index.ts and stagger.ts
├── stagger.ts          # bindStaggerGroups() — GSAP stagger for entrance children
├── config/registry.ts  # REGISTRY — single source of truth for editor + frontend
├── block-editor/inspector.tsx  # HOC: InspectorControls (Animation + Stagger panels)
└── entrance/, exit/, attention/, text/, background/, basic/   # animation groups

inc/
└── render-block.php   # render_block filter: re-applies data-animation-*/data-stagger-*
                        # overrides onto dynamic/server-rendered block output
```

`REGISTRY` in `config/registry.ts` is the one place to add or change an animation — both the
inspector dropdowns and the frontend player are generated from it. Every CSS class key must
stay unique across the whole registry (see README's "AnimationConfig shape" section for why
a duplicate key silently desyncs editor and frontend).

## Known Open Issues (see README's "Next Steps" for full detail)

- `kenburns-*` transforms the whole block wrapper, not just an inner image layer.
- `ping`'s timeline doesn't loop cleanly (visible jump on `repeat: -1`).

## Related Documentation

- **wp_root docs:** `../../../CLAUDE.md` and `AGENTS.md`
- **Deployment:** `../../../.deploy/DEV_DEPLOY.md`
- **Design docs:** `docs/jul5-code-review.md` (2026-07-05 review), `docs/stagger-and-css-utilities-plan.md`
