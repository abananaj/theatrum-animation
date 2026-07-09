# theatrum-animation

> WordPress plugin — adds GSAP animations to any block via the block inspector, triggered on scroll, load, or hover.
> **Updated: 2026-07-05**, post code review. See `docs/jul5-code-review.md` for the full review.

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

Every CSS class key must be unique across the whole `REGISTRY` — `flattenConfigs()` (frontend) is last-category-wins and `buildClassIndex()` (inspector) is first-category-wins, so a duplicate key makes the frontend play one config while the inspector shows another. This bit us once: `attention`'s looping scale animations share visual names with `basic`'s one-shot scale animations, so attention's classes are namespaced `attn-scale-up-*` / `attn-scale-down-*`.

**Dynamic blocks limitation:** `blocks.getSaveContent.extraProps` only writes `data-animation-*` overrides into statically-saved block HTML. Server-rendered blocks (most theatrum-blocks query/meta blocks) keep the animation class — so the animation still plays — but lose any custom Duration/Delay/Ease override, falling back to the animation's default timing. Fixing this needs a `render_block` PHP filter mapping the block's attributes onto the rendered wrapper; not yet implemented.

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
| **Ease — Power** (`power1`–`power4`, `back`) | After a variant/animation is applied, and only for one-shot tweens (hidden for `timeline`-based animations, which have no single ease to override) |
| **Ease — Direction** (`in`, `out`, `inOut`) | Same as above |
| **Preview Animation** button | After a variant/animation is applied |
| **Reset Animation** button | Any animation is active |

Easing composed as `power1.out`, written to `data-animation-ease` on save. Duration/delay written to `data-animation-duration` / `data-animation-delay`. For `timeline`-based animations, Duration rescales the timeline's playback speed (`timeScale()`) and Delay restarts it with a `delay()`; there's no per-step ease to override.

Undo/redo sync is implemented (`useEffect([className])` + a `suppressSync` ref in `withAnimationInspector`) — the ref is only raised when a handler's className write actually changes the value, so a no-op write (e.g. picking a category with no class yet applied) can't latch it and swallow the next real external change.

### Triggers

The **Category** dropdown groups its options under three trigger headers (disabled
rows, version-safe vs `<optgroup>`); the trigger is implied by which group you pick —
there is no separate trigger field.

| Trigger | Categories | Frontend behavior | Saved? |
|---|---|---|---|
| **On Scroll** | Entrance, Text, Basic | one-shot when the block scrolls into view (`ScrollTrigger` top 85%, once) | nothing |
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

2. **Dynamic blocks don't get duration/delay/ease/trigger overrides** — server-rendered blocks keep the animation class but lose `data-animation-*` attributes (see Architecture section above), including `data-animation-trigger`, so a dynamic block set to **On Load** falls back to its category default (scroll). Needs a `render_block` PHP filter.

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
| `theatrum-animation.php` | Plugin init, asset enqueue |
| `src/index.ts` | Frontend entry, `initializeAnimations()`, MutationObserver |
| `src/config/registry.ts` | `REGISTRY` — single source of truth; `flattenConfigs()`, `buildClassIndex()` |
| `src/config/animationConfigs.ts` | `AnimationConfig` interface |
| `src/config/scrollTrigger.ts` | ScrollTrigger defaults |
| `src/block-editor/inspector.tsx` | Block editor HOC + all controls |
| `vite.config.js` | Frontend build config |
| `vite.config.editor.js` | Editor build config |
| `docs/inspector-animation-options.md` | Diagnosis doc for inspector panel scope — resolved, kept for history |
| `docs/jul5-code-review.md` | 2026-07-05 code review — source of the fixes in Next Steps above |
| `animista/` | Original CSS keyframe sources (pre-migration, stale) |
