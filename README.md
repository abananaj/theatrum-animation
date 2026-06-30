# theatrum-animation

> WordPress plugin — adds scroll-triggered GSAP animations to any block via the block inspector.
> **Snapshot: June 2026 — pre-refactor archive.**

---

## Overview

| | |
|---|---|
| **Plugin file** | `theatrum-animation.php` |
| **Build** | Vite (two configs) — `dist/main.js` (frontend) + `dist/editor.js` (block editor) |
| **Animation engine** | [GSAP 3](https://gsap.com/) + ScrollTrigger |
| **Editor integration** | WordPress block filter (`editor.BlockEdit` HOC) |
| **CSS class model** | Animation applied as a CSS class on the block wrapper (e.g. `slide-in-top`, `fade-in`, `heartbeat`) |

---

## Architecture

```
src/
├── index.ts                  ← frontend entry: init + MutationObserver
├── config/
│   ├── animationConfigs.ts   ← AnimationConfig interface
│   ├── registry.ts           ← REGISTRY (single source of truth for editor + frontend)
│   └── scrollTrigger.ts      ← ScrollTrigger config (trigger: top 85%, once: true)
├── block-editor/
│   └── inspector.tsx         ← HOC: InspectorControls panel, block filters
├── entrance/                 ← 16 animation groups
├── exit/                     ← 19 animation groups
├── attention/                ← 12 animation groups
├── text/                     ← 8 animation groups
├── background/               ← 3 animation groups
└── basic/                    ← 20 animation groups
```

**Two Vite builds:**
- `vite.config.js` → `dist/main.js` (IIFE, bundles GSAP, frontend + editor canvas)
- `vite.config.editor.js` → `dist/editor.js` (IIFE, externalizes React + `@wordpress/*`, block editor panel)

**PHP hooks:**
- `wp_enqueue_scripts` → `main.js` (frontend)
- `enqueue_block_editor_assets` → `editor.js` (block editor sidebar)
- `enqueue_block_assets` (admin only) → `main.js` again (editor canvas preview)

---

## Animation Categories

~60 animations across 6 categories, all driven by `REGISTRY` in `config/registry.ts`.

| Category | Count | Notes |
|---|---|---|
| 🚪 **Entrance** | 16 groups | slide-in, fade-in, rotate-in, bounce-in, flicker-in, puff-in, roll-in, scale-in, swing-in, swirl-in, tilt-in + variants |
| 🚶 **Exit** | 19 groups | slide-out, fade-out, rotate-out, bounce-out, flip-out, puff-out, slit-out, swing-out, swirl-out + variants |
| ⚠️ **Attention** | 12 groups | heartbeat, shake, vibrate, wobble, jello, ping, pulsate, blink, bounce, flicker, scale-up/down |
| ⌨️ **Text** | 8 groups | tracking-in/out, text-shadow-drop/pop, text-pop, text-flicker, blur-out, focus-in |
| 🖼️ **Background** | 3 groups | color-change (2x–5x), kenburns (8 directions), bg-pan (6 directions) |
| ✨ **Basic** | 20 groups | swing, slide, shadow-drop/pop/inset, scale, rotate, flip + variants |

### AnimationConfig shape

```ts
interface AnimationConfig {
  name: string
  duration: number   // ms
  ease: string       // GSAP ease string
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  repeat?: number
  yoyo?: boolean
  timeline?: (el: Element, duration: number) => gsap.core.Timeline
}
```

One-shot tweens use `from`/`to` + ScrollTrigger. Looping/multi-step animations use `timeline` and bypass ScrollTrigger (play immediately on load).

---

## Block Editor Panel

`src/block-editor/inspector.tsx` — fully auto-generated from `REGISTRY`:

| Control | When shown |
|---|---|
| **Category** dropdown | Always |
| **Animation** dropdown | After category is selected |
| **Variant** dropdown | Only if animation has >1 variant |
| **Duration** (ms) | After a variant/animation is applied |
| **Delay** (ms) | After a variant/animation is applied |
| **Ease — Power** (`power1`–`power4`, `back`) | After a variant/animation is applied |
| **Ease — Direction** (`in`, `out`, `inOut`) | After a variant/animation is applied |
| **Preview Animation** button | After a variant/animation is applied |
| **Reset Animation** button | Any animation is active |

Easing composed as `power1.out`, written to `data-animation-ease` on save. Duration/delay written to `data-animation-duration` / `data-animation-delay`.

Undo/redo sync: **not yet implemented** — see Bug #4 in Next Steps.

---

## Build & Dev

```bash
npm run build          # production build (main + editor)
npm run build:editor   # editor only
npm run build:watch    # one-shot main build, then watch editor only
npm run deploy         # alias for build
```

> ⚠️ No `npm run start` — see [Next Steps](#next-steps).

---

## Next Steps 🔧

Issues in order of severity:

### 🔴 Bugs

1. **Undo/redo leaves stale inspector state** — `uiCategory`/`uiAnimation` are `useState` values initialised once. When WordPress undo reverts `className` externally, the state isn't reset, so the Category and Animation dropdowns — and the "Reset Animation" button — remain visible as if an animation is active when none is. Fix: add a `useEffect([className])` that clears both state values when `parsed.category` is empty, gated on a `suppressSync` ref to skip self-initiated writes.

2. **GSAP timeline leak on repeated Preview clicks** — `gsap.killTweensOf(blockEl)` kills child tweens but leaves the `Timeline` container alive in GSAP's root scheduler. For animations that use `repeat: -1` timelines (`heartbeat`, `jello`, all `color-change` and `bg-pan` variants), each click of "Preview Animation" adds another orphaned infinite-repeat container running on every animation frame. Fix: store the returned timeline in a `useRef` and call `timelineRef.current?.kill()` before creating a new one.

3. **`NaN` stored as duration/delay** — `parseInt(val, 10)` returns `NaN` for intermediate `NumberControl` states (`-`, `5e`, `1.`). `NaN != null` is `true`, so `data-animation-duration="NaN"` gets written to the block HTML. On the frontend GSAP receives `duration: NaN`, treats it as `0`, and the animation snaps to its final state instantly with no visible transition. Fix: `const n = parseInt(val, 10); value: !isNaN(n) ? n : null`.

4. **`fade-in-fwd` / `fade-in-bck` broken** — `from: { z: -80 }` animates `z-index`, not 3D depth. GSAP needs `perspective` on the parent and `transformPerspective` on the element for z-axis motion. These variants appear to do nothing visually. Fix: use `transformPerspective` + `z` or switch to `scale` equivalents.

2. **`ping` timeline doesn't loop cleanly** — After `opacity: 0` the element scales to `2.2` while invisible. On `repeat: -1`, GSAP resets to the `fromTo` start values (`scale: 0.2, opacity: 0.8`) — but the final `to` is outside the `fromTo` so the reset jump may be visible. Needs testing and likely a timeline restructure.

3. **`build:watch` only watches editor** — `"build:watch": "vite build && vite build --config vite.config.editor.js --watch"` does a one-time build of `main.js`, then only watches `editor.js`. Changes to `src/index.ts` or any animation config won't hot-reload. Needs two parallel watch processes (e.g. `vite build --watch & vite build --config vite.config.editor.js --watch`).

### 🟡 Tech Debt

4. **Orphaned draft files** — `src/block-editor/RadioControlDirection.js`, `SelectControlEase.js`, `SelectControlEntrance.js`, `SelectControlEntrance.tsx` are leftover early drafts, not imported anywhere. `SelectControlEntrance.tsx` is a superseded implementation. Contains invalid TypeScript (`useState<string[""]>`). Delete all four.

5. **`tsconfig.node.json` misconfigured** — `"include": ["vite.config.ts"]` but config files are `.js`. No actual type-checking of vite configs.

6. **CSS class collisions break attention scale animations** — All 30 `scale-down-*` and `scale-up-*` class names exist verbatim in both `attention/` (looping, `repeat: -1, yoyo: true`) and `basic/scale/` (one-shot). `CLASS_INDEX` uses earliest-wins so the inspector labels say "Attention", but `flattenConfigs` uses last-wins (basic overwrites) so both the Preview button and the live frontend play the basic one-shot config. The looping attention behaviour is permanently inaccessible. Fix: rename attention classes (e.g. `attn-scale-down-*`) or remove the duplicates from one category.

7. **`animista/` folder** — Original CSS keyframe source files still present. These were the input for the GSAP migration. Can be deleted once you're confident in the GSAP equivalents.

8. **`package.json` `main` field** — Points to `dist/index.js` but output is `dist/main.js`. Harmless for a WP plugin but misleading.

9. **No `npm run start`** — CLAUDE.md convention for all plugins. Alias `build:watch` or add a proper parallel-watch script.

10. **`__experimentalNumberControl`** — Used in `inspector.tsx:4`. Experimental WP component API, could change on Gutenberg updates. Low urgency but worth watching.

11. **`stripAnimationClasses` O(n) array scan** — Uses `ALL_ANIMATION_CLASSES.includes(c)` (100+ entries scanned per token) when `CLASS_INDEX` is already available for O(1) `in` lookup. Replace with `!(c in CLASS_INDEX)` and remove the `ALL_ANIMATION_CLASSES` constant.

12. **Category dropdown snaps back one frame on change** — `activeCategory = parsed.category || uiCategory` means the old committed category wins for one render frame when the user picks a new one while a class is already applied (parsed.category is non-empty until setAttributes propagates). A single controlled state with a `useEffect` sync would eliminate the `||` fallback.

13. **Looping animations skip ScrollTrigger** — `timeline`-based animations (attention, background) start immediately on page load regardless of scroll position. May be intentional but worth documenting explicitly as a design decision.

---

## File Reference

| File | Purpose |
|---|---|
| `theatrum-animation.php` | Plugin init, asset enqueue |
| `src/index.ts` | Frontend entry, `initializeAnimations()`, MutationObserver |
| `src/config/registry.ts` | `REGISTRY` — single source of truth; `flattenConfigs()`, `buildClassIndex()` |
| `src/config/animationConfigs.ts` | `AnimationConfig` interface |
| `src/config/scrollTrigger.ts` | ScrollTrigger defaults |
| `src/block-editor/inspector.tsx` | Block editor HOC + all controls |
| `vite.config.js` | Frontend build config |
| `vite.config.editor.js` | Editor build config |
| `docs/inspector-animation-options.md` | Diagnosis doc for inspector panel scope |
| `animista/` | Original CSS keyframe sources (pre-migration, stale) |
