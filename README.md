# theatrum-animation

> WordPress plugin — adds GSAP animations to any block via the block inspector, triggered on scroll, load, or hover. Also ships a standalone, JS-free `tm-*` CSS utility layer and a GSAP-driven stagger option for cascading a parent block's entrance children.
> **Updated: 2026-07-08** — stagger + `tm-*` CSS utilities added. See `docs/stagger-and-css-utilities-plan.md` for the design. Previously updated 2026-07-05, post code review — see `docs/jul5-code-review.md`.

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
├── engine.ts                 ← shared animation state/helpers (ANIMATION_CONFIGS, buildPaused, etc.) — used by index.ts and stagger.ts
├── stagger.ts                ← bindStaggerGroups(): GSAP stagger for a parent's entrance children
├── scss/
│   └── utilities.scss        ← standalone tm-* CSS utility classes (no GSAP/JS involved)
├── config/
│   ├── animationConfigs.ts   ← AnimationConfig interface
│   ├── registry.ts           ← REGISTRY (single source of truth for editor + frontend)
│   └── scrollTrigger.ts      ← ScrollTrigger config (trigger: top {point}%, once: true — point from data-animation-trigger-point, default 85)
├── block-editor/
│   └── inspector.tsx         ← HOC: InspectorControls panel (Animation + Stagger), block filters
├── entrance/                 ← 16 animation groups
├── exit/                     ← 19 animation groups
├── attention/                ← 12 animation groups
├── text/                     ← 8 animation groups
├── background/               ← 3 animation groups
└── basic/                    ← 20 animation groups
```

**Two Vite builds:**
- `vite.config.js` → `dist/main.js` (IIFE, bundles GSAP, frontend only)
- `vite.config.editor.js` → `dist/editor.js` (IIFE, externalizes React + `@wordpress/*` incl. `@wordpress/i18n`, bundles GSAP for the Preview button; block editor panel)

**PHP hooks:**
- `wp_enqueue_scripts` → `main.js` (frontend, loaded with `strategy: 'defer'`)
- `enqueue_block_editor_assets` → `editor.js` (block editor sidebar)

Frontend animations honor `prefers-reduced-motion: reduce` — `initializeAnimations()`
no-ops entirely when the user has that OS preference set (WCAG 2.3.3 / 2.2.2).

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
  timeline?: (el: Element) => gsap.core.Timeline
}
```

One-shot tweens use `from`/`to` + ScrollTrigger. Looping/multi-step animations use `timeline` and bypass ScrollTrigger (play immediately on load) — this is an intentional design decision, not a bug: entrances need a trigger point, ambient attention/background loops don't.

Every CSS class key must be unique across the whole `REGISTRY` — `flattenConfigs()` (frontend) is last-category-wins and `buildClassIndex()` (inspector) is first-category-wins, so a duplicate key makes the frontend play one config while the inspector shows another. This bit us once: it was a **three-way** `scale-up`/`scale-down` collision across `exit`, `attention`, and `basic` — attention's looping variants are now namespaced `attn-scale-up-*` / `attn-scale-down-*`, and exit's duplicate one-shot definitions were deleted outright.

**Dynamic blocks:** `blocks.getSaveContent.extraProps` only writes `data-animation-*` overrides into statically-saved block HTML — server-rendered blocks (most theatrum-blocks query/meta blocks) never pass through it. `inc/render-block.php`'s `render_block` filter closes this gap: it reads the same override attributes off `$block['attrs']`, and — gated on `WP_Block_Type::is_dynamic()` so static blocks are untouched — writes the equivalent `data-animation-*`/`data-stagger-*` attributes onto the block's outer wrapper via `WP_HTML_Tag_Processor`, matching the JS writer's value formats exactly.

**Ken Burns caveat:** `kenburns-*` configs transform the block wrapper itself, so applying it to a Cover block scales the whole block (including any overlaid text), not just the background image. A true Ken Burns effect needs the transform on an inner image layer (e.g. `.wp-block-cover__image-background`) with `overflow: hidden` on the wrapper — not yet implemented.

---

## Block Editor Panel

`src/block-editor/inspector.tsx` — fully auto-generated from `REGISTRY`:

| Control | When shown |
|---|---|
| **Category** dropdown (trigger-grouped) | Always |
| **Animation** dropdown | After category is selected |
| **Variant** dropdown | Only if animation has >1 variant |
| **Duration** (ms) | After a variant/animation is applied |
| **Delay** (ms) | After a variant/animation is applied |
| **Trigger Point** (%, 0–100) | After a variant/animation is applied, and only when the resolved trigger is **On Scroll** — meaningless for Load/Hover |
| **Ease — Power** (`power1`–`power4`, `back`) | After a variant/animation is applied, and only for one-shot tweens (hidden for `timeline`-based animations, which have no single ease to override) |
| **Ease — Direction** (`in`, `out`, `inOut`) | Same as above |
| **Preview Animation** button | After a variant/animation is applied |
| **Reset Animation** button | Any animation is active |

Easing composed as `power1.out`, written to `data-animation-ease` on save. Duration/delay written to `data-animation-duration` / `data-animation-delay`. Trigger Point written to `data-animation-trigger-point` (only when it differs from the 85% default). For `timeline`-based animations, Duration rescales the timeline's playback speed (`timeScale()`) and Delay restarts it with a `delay()`; there's no per-step ease to override.

Undo/redo sync is implemented (`useEffect([className])` + a `suppressSync` ref in `withAnimationInspector`) — the ref is only raised when a handler's className write actually changes the value, so a no-op write (e.g. picking a category with no class yet applied) can't latch it and swallow the next real external change.

### Triggers

The **Category** dropdown groups its options under three trigger headers (disabled
rows, version-safe vs `<optgroup>`); the trigger is implied by which group you pick —
there is no separate trigger field.

| Trigger | Categories | Frontend behavior | Saved? |
|---|---|---|---|
| **On Scroll** | Entrance, Text, Basic | one-shot when the block scrolls into view (`ScrollTrigger` top `{point}`%, once — default 85) | `data-animation-trigger-point` (only if not 85) |
| **On Load** | Entrance, Text, Basic | one-shot immediately on page load | `data-animation-trigger="load"` |
| **On Hover** | Attention, Background | plays while hovered, pauses on mouseleave; touch → tap-to-toggle | nothing |

Trigger is resolved on the frontend (`src/index.ts` `resolveTrigger`) as
`data-animation-trigger` attribute → else the class's **category default**
(`flattenTriggers()` in `registry.ts`, keyed off each `Category.trigger`). Because
scroll and hover come from the category default, only the Load override is ever
persisted — via the `animationTrigger` block attribute written by the inspector when
you pick an animation from the **On Load** group. The frontend dispatches per
config-shape × trigger: one-shot `from`/`to` tweens use GSAP's integrated
`scrollTrigger` for scroll or play immediately for load; `timeline`/looping configs
are built paused and played on scroll-in or on hover.

**Trigger Point:** the viewport % from the top that fires an On Scroll animation
(GSAP's `top {point}%` shorthand) is per-block, resolved by `resolveTriggerPoint()`
in `engine.ts` from `data-animation-trigger-point` (0–100, default 85 — the value
every scroll trigger used before this control existed). A stagger group's shared
boundary uses the **parent** block's own override (or 85 if unset); per-child
overrides don't affect the group.

---

## Stagger

A parent block with 2+ inner blocks gets a **Stagger** inspector panel (below the Animation panel) with two controls: **Stagger Each** (ms between children) and **Stagger From** (`Start`/`End`/`Center`/`Edges`/`Random`) — GSAP's own stagger model (`gsap.utils.distribute`), no grid/axis options. Setting Stagger Each writes `data-stagger-each`/`data-stagger-from` onto the parent's saved HTML.

**Preview Stagger** / **Reset Stagger** buttons work like the Animation panel's Preview/Reset, but Preview plays the whole child cascade at once rather than a single block: it reads the block's children (`getBlockOrder`), pulls each child's own applied animation + Duration/Delay/Ease overrides from its block attributes (the editor canvas has no `data-animation-*` to read — that's save-only — so this mirrors the same workaround the single-block Preview already uses), skips hover-triggered children, and fires all eligible children together with the same `gsap.utils.distribute()` offsets the frontend uses.

On the frontend, `src/stagger.ts`'s `bindStaggerGroups()` runs before the normal per-element sweep in `index.ts`: for each `[data-stagger-each]` parent, it collects **direct children** whose resolved trigger is `scroll` or `load` (hover/attention children are excluded and animate independently), computes each one's delay offset via `gsap.utils.distribute({ each, from })`, builds them all paused (`buildPaused()` from `engine.ts`), and plays the whole group together — gated on the parent scrolling into view via `onScrollIntoView()`, or immediately if every member is Load-triggered.

**Scope:** static and dynamic parent blocks (Group, Columns, Row, etc., plus dynamic blocks via `inc/render-block.php`, see Dynamic blocks above) — `data-stagger-*` is written either way. Direct children only, no recursion into grandchildren.

**Shared engine module:** `applyOverrides`, `resolveTrigger`, `buildPaused`, `ANIMATION_CONFIGS`, and the `processed` WeakSet moved out of `index.ts` into `src/engine.ts` so `stagger.ts` could import them without creating a circular import (`index.ts` calls `bindStaggerGroups()`, so `stagger.ts` importing back from `index.ts` would cycle). `buildPaused()` also picked up a fix while it moved: its `timeline`-based branch now calls `tl.delay(delay)`, which it previously never did — needed for stagger offsets to apply to timeline-based animations (e.g. `flicker-in`), and incidentally fixes the same silent no-op for any existing scroll/hover timeline animation's Delay override.

---

## CSS Utilities (`tm-*`)

`src/scss/utilities.scss` — a standalone, JS-free set of utility classes, separate from the GSAP `REGISTRY` (no inspector UI; apply via a block's **Additional CSS Class(es)** field). Prefixed `tm-` to avoid any collision with the GSAP registry's class keys.

- **Entrance** (fires on load/paint via `@keyframes` + `animation-fill-mode: both`, not scroll-gated): `.tm-slide-in-up`, `.tm-slide-in-down`, `.tm-slide-in-left`, `.tm-slide-in-right`, `.tm-fade-in`, `.tm-scale-in-subtle`.
- **Hover/focus** (transition-based, `:focus-visible` alongside `:hover` for keyboard parity): `.tm-hover-lift`, `.tm-hover-grow`, `.tm-hover-shadow`, `.tm-hover-brighten`, `.tm-underline-grow`.
- Motion tokens: `--tm-duration-{fast,base,slow}`, `--tm-ease-{standard,decelerate,accelerate}`.
- Respects `prefers-reduced-motion: reduce` (own `@media` block, independent of the GSAP frontend's reduced-motion gate).

**Delivery:** no separate stylesheet is enqueued. This Vite build has no HTML entry point to extract CSS against (a plain `.ts` entry → IIFE), so Vite bundles `utilities.scss` into `dist/main.js` and injects it via `document.head.appendChild(<style>)` at script execution — `dist/main.css` is never created. This is why an earlier `dist/main.css` enqueue in this plugin's history was removed as dead code (see Next Steps below). Practical trade-off: the `tm-*` classes render only once `main.js` executes (already the case for every other animation in this plugin), and there's a theoretical brief FOUC window before injection on first paint.

---

## Build & Dev

```bash
npm run start          # watch both bundles in parallel (main + editor)
npm run build          # production build (main + editor)
npm run build:editor   # editor only
npm run typecheck      # tsc --noEmit
npm run deploy         # alias for build
```

---

## Next Steps 🔧

Added 2026-08-31 (customizable trigger point + dynamic-block sync):

- ✅ Per-block **Trigger Point** override (0–100%, default 85) for the ScrollTrigger boundary — see Triggers section above
- ✅ `inc/render-block.php` `render_block` filter — dynamic/server-rendered blocks now keep their Duration/Delay/Ease/Trigger/Trigger Point/Stagger overrides (see Dynamic blocks above)

Added 2026-07-08 (stagger + CSS utilities pass):

- ✅ Stagger inspector panel + frontend `bindStaggerGroups()` — see Stagger section above
- ✅ Standalone `tm-*` CSS utility classes — see CSS Utilities section above
- ✅ `buildPaused()` timeline branch now honors `delay` (`tl.delay(delay)`) — was previously silently dropped for any scroll/hover animation using a `timeline` config

Fixed in the 2026-07-05 review pass:

- ✅ Undo/redo stale inspector state, `suppressSync` latch bug
- ✅ GSAP timeline leak on repeated Preview clicks
- ✅ `NaN` stored as duration/delay (both inspector write and frontend read)
- ✅ `fade-in-fwd`/`bck`, `tracking-in/out`, `blur-out` z-axis variants (added `transformPerspective`)
- ✅ 3-way `scale-up`/`scale-down` class collision (attention renamed to `attn-scale-*`; exit's duplicate deleted)
- ✅ `prefers-reduced-motion` support (WCAG 2.3.3 / 2.2.2)
- ✅ Timeline animations now honor Duration/Delay overrides (`timeScale()` + `delay()`); Ease controls hidden for them since a multi-step timeline has no single ease
- ✅ 4 orphaned draft files deleted; `strict: true` + `npm run typecheck` added
- ✅ `tsconfig.node.json` removed (was pointing at a nonexistent `vite.config.ts`)
- ✅ `package.json` `main` field corrected; `npm run start` added (parallel watch via `npm-run-all`)
- ✅ Dead `dist/main.css` enqueue removed; frontend script loads with `strategy: 'defer'`
- ✅ `enqueue_block_assets` canvas-preview hook removed (the iframed editor canvas never executed it; removing it also eliminates the dual-GSAP-instance risk between `main.js` and `editor.js`)
- ✅ i18n: all inspector strings wrapped in `__()`, `wp_set_script_translations()` wired up
- ✅ `attention/flicker.ts`'s `flicker-2`–`flicker-5` exceeded WCAG 2.3.1's 3-flashes/sec
  threshold while looping forever (up to 5/sec); loop duration widened per variant to
  bring all under 3/sec while preserving the flicker pattern

Remaining, in order of severity:

### 🟡 Open

1. **`ping` timeline doesn't loop cleanly** — After `opacity: 0` the element scales to `2.2` while invisible. On `repeat: -1`, GSAP resets to the `fromTo` start values (`scale: 0.2, opacity: 0.8`) — but the final `to` is outside the `fromTo` so the reset jump may be visible. Needs visual testing and likely a timeline restructure.

2. **Behavior changes from the trigger-grouping pass:**

   - **Exit category excluded from the picker** — `exit` stays in `REGISTRY` (default trigger `scroll`) so existing pages keep animating, but it's omitted from `TRIGGER_GROUPS`; an existing exit block's Category select therefore shows the placeholder (Reset still works). Add an "On Scroll → Exit (legacy)" group entry if editing old exit blocks becomes necessary.
   - **Attention & Background now trigger on hover** — they no longer auto-loop on page load. Any pre-existing use of those categories changes behavior accordingly.

3. **`kenburns-*` animates the whole block, not just a background image** — see Ken Burns caveat above.

4. **`animista/` folder** — original CSS keyframe source files, superseded by the GSAP ports. Can be deleted once confidence in the GSAP equivalents is high.

5. **`__experimentalNumberControl`** — used in `inspector.tsx`. Experimental WP component API, could change on Gutenberg upgrades. Low urgency but worth watching.

6. **No conditional/deferred-load heuristic for `main.js`** — it loads on every frontend page regardless of whether the page uses any animated blocks. `defer` is in place, but a usage-based conditional enqueue (or a `ta-` class prefix migration to reduce false-positive MutationObserver matches) is a larger, separate pass — not done in this review, since it needs a content migration.

7. **PHP dependency array hand-synced with Vite externals** — `theatrum-animation.php`'s editor script `deps` array must match `vite.config.editor.js`'s `external`/`globals`; a comment now ties them together, but a `*.asset.php` (wp-scripts convention) would prevent drift automatically.

---

## File Reference

| File | Purpose |
|---|---|
| `theatrum-animation.php` | Plugin init, asset enqueue, `register_block_type_args` attribute mirroring |
| `inc/render-block.php` | `render_block` filter — re-applies `data-animation-*`/`data-stagger-*` overrides onto dynamic/server-rendered block output |
| `src/index.ts` | Frontend entry, `initializeAnimations()`, MutationObserver |
| `src/engine.ts` | Shared animation state/helpers (`ANIMATION_CONFIGS`, `applyOverrides`, `resolveTrigger`, `buildPaused`) used by both `index.ts` and `stagger.ts` |
| `src/stagger.ts` | `bindStaggerGroups()` — GSAP stagger for a parent block's entrance children |
| `src/scss/utilities.scss` | Standalone `tm-*` CSS utility classes |
| `src/config/registry.ts` | `REGISTRY` — single source of truth; `flattenConfigs()`, `buildClassIndex()` |
| `src/config/animationConfigs.ts` | `AnimationConfig` interface |
| `src/config/scrollTrigger.ts` | ScrollTrigger config — `getScrollTrigger()`/`onScrollIntoView()` take a per-block trigger-point % |
| `src/block-editor/inspector.tsx` | Block editor HOC + all controls (Animation + Stagger panels) |
| `vite.config.js` | Frontend build config |
| `vite.config.editor.js` | Editor build config |
| `docs/inspector-animation-options.md` | Diagnosis doc for inspector panel scope — resolved, kept for history |
| `docs/jul5-code-review.md` | 2026-07-05 code review — source of the fixes in Next Steps above |
| `docs/stagger-and-css-utilities-plan.md` | Design doc for the stagger + `tm-*` CSS utilities features |
| `animista/` | Original CSS keyframe sources (pre-migration, stale) |
