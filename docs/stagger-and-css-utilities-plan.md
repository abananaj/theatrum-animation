# Stagger entrances + starter CSS utility classes (theatrum-animation)

## Context

`theatrum-animation` is a GSAP-driven block-animation plugin: editors pick an animation from a `REGISTRY`-backed dropdown in the block inspector, which writes a CSS class onto the block plus `data-animation-*` override attributes, and a frontend script (`src/index.ts`) matches those classes and dispatches GSAP tweens on scroll/load/hover. Two gaps are being closed:

1. **No stagger support.** When several sibling blocks (e.g. cards in a Group/Columns row) each have their own entrance animation, they currently fire independently based on each element's own scroll position — there's no way to deliberately cascade their entrances. GSAP's own stagger model (`each`, `from`) is the natural fit. A throwaway, unwired prototype (`src/stagger.ts`, `src/scss/stagger.scss`) already sketched the idea but isn't real groundwork — it hardcodes a single selector and isn't imported anywhere; it will be deleted and replaced.
2. **No lightweight, JS-free motion primitives.** Every animation today — even a trivial button hover lift — goes through the full GSAP/ScrollTrigger machinery. A small set of pure-CSS utility classes (slide-in entrances, hover translate, etc.) gives editors/theme devs a zero-JS option for simple cases, and starts a motion-token foundation (`--tm-duration-*`, `--tm-ease-*`) other work can build on. Decided with the user: standalone utilities (not wired into the GSAP `REGISTRY`/inspector), prefixed **`tm-`** to guarantee no collision with existing GSAP registry class keys (`slide-in`, `fade-in`, `scale-up` etc. are already taken).

Both features ship inside `theatrum-animation` (not the theme), following existing plugin conventions: global `blocks.registerBlockType`/`getSaveContent.extraProps`/`editor.BlockEdit` filters for editor-side work, `data-*` attributes as the editor→frontend handoff, GSAP utilities reused where they already exist (`buildPaused`, `onScrollIntoView`).

---

## Feature 1: Stagger for entrance animations

**Model:** simple GSAP stagger — `each` (ms between children) + `from` (`start`/`end`/`center`/`edges`/`random`). No `amount` mode, no grid/axis options — kept intentionally simple per the request.

**Scope:** applies only to a parent block's **direct** children, and only to children whose *resolved* trigger is `scroll` or `load` (real entrance animations). Hover/attention children are excluded from the group and continue to animate independently. Static blocks only (Group, Columns, Row, etc.) — server-rendered/dynamic parent blocks don't go through `blocks.getSaveContent.extraProps`, so `data-stagger-*` would never reach them; this mirrors the plugin's existing documented gap for `data-animation-*` on dynamic blocks and is out of scope for v1 (no `render_block` filter added here).

### Editor (`src/block-editor/inspector.tsx`)

- New attribute filter `addStaggerAttributes` (parallel to `addAnimationAttributes`), registered on `blocks.registerBlockType`:
  - `staggerEach: { type: "number", default: null }`
  - `staggerFrom: { type: "string", default: null }`
- New save-props filter `addStaggerSaveProps` (parallel to `addAnimationSaveProps`) on `blocks.getSaveContent.extraProps`: when `staggerEach != null`, write `data-stagger-each` and `data-stagger-from` (default `"start"` if unset) onto the block wrapper.
- New `PanelBody title="Stagger"` in the same `InspectorControls`, rendered only when the block currently has more than one inner block: `useSelect(select => select("core/block-editor").getBlockOrder(clientId).length, [clientId]) > 1`. Use `getBlockOrder` (returns child clientIds only), not `getBlock` (deep-clones the whole subtree) — this filter wraps *every* block's edit component via `editor.BlockEdit`, so the cheaper selector matters for editor performance on content-heavy pages. Import `useSelect` from `@wordpress/data`. Controls: `NumberControl` for Stagger Each (ms), `SelectControl` for Stagger From (Start/End/Center/Edges/Random). Clearing the number field back to empty is the "disable" path — no separate enable toggle, matching how Duration/Delay already work.
- **Preview Stagger** / **Reset Stagger** buttons, mirroring the Animation panel's `handlePreview`/`handleReset`. Reset just clears both attributes. Preview plays the *whole group as a cascade*, not a single block: it reads the current block's children via `wp.data.select("core/block-editor").getBlockOrder(clientId)` (imperative `select`, not `useSelect` — this only needs to run on click), then for each child reads its own applied animation class + Duration/Delay/Ease overrides straight from `getBlockAttributes(childId)` (the editor canvas never carries `data-animation-*` — that's only written into saved HTML by `getSaveContent.extraProps` — so overrides have to come from block attributes, same workaround the single-block `handlePreview` already uses). Hover-triggered children are excluded, matching the frontend's scope. Each eligible child's delay gets the same `gsap.utils.distribute({ each, from })` offset the frontend uses, then all children are fired together (no pause/play split needed since this is "play now", not scroll-gated). Kept as its own `staggerPreviewAnims` ref (array, not a single tween) with the same kill-on-unmount/kill-before-replay pattern as the Animation panel's `previewAnim` ref, since a stagger preview builds up to N animations at once.
- `@wordpress/data` needs to be a real dependency: add to `package.json` devDependencies, add `"@wordpress/data": "wp.data"` to `output.globals` in `vite.config.editor.js` (already covered by the `/^@wordpress\//` external regex, just needs the global mapping), and add `'wp-data'` to the `deps` array in `theatrum_animation_enqueue_editor_scripts()` in `theatrum-animation.php`.

### Frontend — shared engine module + new `src/stagger.ts`

**Avoiding a circular import:** `stagger.ts` needs `ANIMATION_CONFIGS`, `applyOverrides`, `resolveTrigger`, `processed`, and `buildPaused` — all currently private to `src/index.ts`. `index.ts` in turn needs to call `bindStaggerGroups()` from `stagger.ts`. Importing between the two directly would make `index.ts` → `stagger.ts` → `index.ts` a circular import, which is risky here specifically because `index.ts` executes `initializeAnimations()` as a side effect at module load (bottom of the file) — load order isn't guaranteed to resolve cleanly. Instead, extract the shared pieces into a new **`src/engine.ts`** module (no side effects, just the types/functions/state below) that both `index.ts` and `stagger.ts` import from:

- `ANIMATION_CONFIGS`, `DEFAULT_TRIGGER` (the two `flattenConfigs()`/`flattenTriggers()` results)
- `processed` (the shared `WeakSet<Element>`)
- `Timing` type, `applyOverrides()`, `resolveTrigger()`, `buildPaused()`

`index.ts` keeps `playOneShot`, `playOnScroll`, `playOnLoad`, `playOnHover`, `animateElement`, and `initializeAnimations()` (importing the above from `./engine`), and gains one new import + one new call:

```ts
import { bindStaggerGroups } from "./stagger"
import "./scss/utilities.scss"
```

`bindStaggerGroups()` is called first inside `initializeAnimations()` and first inside the `MutationObserver` callback, before the existing `document.querySelectorAll(selector).forEach(animateElement)` sweep in each — so staggered children are already in the shared `processed` WeakSet and the normal per-element sweep silently skips them via its existing guard.

**Bug fix required in `buildPaused()` (moving to `engine.ts`):** it currently destructures `delay` but only applies it on the tween branch — the `config.timeline` branch calls `tl.pause()` without ever calling `tl.delay(delay)`. This is already a latent bug today (a block's Delay override silently no-ops for any scroll/hover animation whose config uses `timeline` — e.g. `flicker-in`, `shadow-pop`, `flip-scale`, `flip-arc`, `text-shadow-pop`, `text-flicker`), and it would make the stagger feature silently fail for exactly those animations, since stagger's whole mechanism is "add the distribute() offset into `timing.delay`, then build paused." Fix by mirroring what `playOnLoad()` already does for its own timeline branch:

```ts
function buildPaused(el: Element, config: AnimationConfig, timing: Timing): gsap.core.Timeline | gsap.core.Tween {
	const { duration, ease, delay } = timing
	const hasRepeat = config.repeat !== undefined
	if (config.timeline) {
		const tl = config.timeline(el)
		const speed = duration > 0 ? config.duration / 1000 / duration : 1
		if (speed !== 1) tl.timeScale(speed)
		if (delay > 0) tl.delay(delay)   // NEW — was previously dropped
		return tl.pause()
	}
	// ...unchanged tween branch
}
```

This is a one-line, backward-compatible fix (only changes behavior when `delay > 0`, which currently produces silently-wrong behavior anyway) confirmed in scope with the user, since it touches shared code used by all existing scroll/hover timeline animations, not just the new stagger feature.

`src/stagger.ts` exports `bindStaggerGroups(): void`:

```
function bindStaggerGroups(): void {
  document.querySelectorAll("[data-stagger-each]").forEach(bindStaggerGroup)
}

function bindStaggerGroup(parent: Element): void {
  if (processed.has(parent)) return
  const each = parseInt(parent.getAttribute("data-stagger-each") ?? "", 10)
  if (Number.isNaN(each)) return
  const fromMode = parent.getAttribute("data-stagger-from") || "start"

  const children = Array.from(parent.querySelectorAll(":scope > *"))
    .filter(el => Object.keys(ANIMATION_CONFIGS).some(k => el.classList.contains(k)))

  const eligible = children.filter(el => {
    const cls = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))!
    return resolveTrigger(el, cls) !== "hover"
  })
  processed.add(parent)
  if (eligible.length < 2) return  // nothing to stagger

  const distribute = gsap.utils.distribute({ each: each / 1000, from: fromMode })
  const built = eligible.map((el, i) => {
    const cls = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))!
    const config = ANIMATION_CONFIGS[cls]
    const timing = applyOverrides(el, config)
    timing.delay += distribute(i, el, eligible)
    processed.add(el)
    return buildPaused(el, config, timing)
  })

  const play = () => built.forEach(anim => anim.play())
  const allLoad = eligible.every(el => {
    const cls = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))!
    return resolveTrigger(el, cls) === "load"
  })
  if (allLoad) play()
  else onScrollIntoView(parent, play)  // any scroll-triggered member gates the whole group on the parent
}
```

This reuses `buildPaused` (already handles both one-shot tweens and `timeline` configs, once the delay fix above lands) and `onScrollIntoView` (already used for timeline-based scroll entrances) from the existing codebase — no new GSAP plumbing beyond that one fix, just new orchestration around it. `ANIMATION_CONFIGS`, `applyOverrides`, `resolveTrigger`, `processed`, `buildPaused` are imported from `./engine` (see above) rather than from `index.ts`, to avoid the circular import.

**Delete** `src/stagger.ts`'s current throwaway content (replaced by the above) and `src/scss/stagger.scss` (unused demo classes, superseded by Feature 2's real utility file).

### Known edge cases to test, not to over-engineer for
- Nested stagger groups (a stagger parent whose direct child is itself a stagger parent): binding runs in document order (top-down), so the outer group's `processed.add(parent)` happens before its children are visited — should self-resolve, but verify manually rather than adding recursion-guard code preemptively.
- Undo/redo: the new attributes are plain `setAttributes` calls with no derived UI state (unlike the existing animation `className` logic), so no `suppressSync`-style guard should be needed — confirm the Stagger panel doesn't flicker when undo changes inner-block count across the `> 1` visibility threshold.

---

## Feature 2: Starter `tm-` CSS utility classes

**New file:** `src/scss/utilities.scss` — imported from `src/index.ts` (`import "./scss/utilities.scss"`).

**Implemented delivery mechanism (differs from the original plan):** the original assumption was that Vite's `cssCodeSplit: true` config would emit a separate `dist/main.css` asset to enqueue via `wp_enqueue_style`. In practice, this build has no HTML entry point (a plain `.ts` file compiled straight to an IIFE) for Vite to extract CSS against, so Vite falls back to its documented behavior for that situation: it bundles the CSS into `dist/main.js` and injects it via a runtime `document.head.appendChild(<style>)` call the moment the script executes — `dist/main.css` is never created. This matches the plugin's own history (see the code comment in `theatrum-animation.php` — an earlier `dist/main.css` enqueue was removed as dead code for exactly this reason). **No PHP enqueue was added for the CSS utilities** — they ship for free as part of the existing `theatrum-animation` script enqueue. Practical implications: the `tm-*` classes only render once `main.js` has executed (no-JS/blocked-JS visitors won't see them), and there's a theoretical brief FOUC window before injection on first paint — acceptable trade-offs since achieving true CSS extraction would require reworking the build to Vite `build.lib` mode, a larger, riskier change out of scope here.

**Design decision — CSS-only, no IntersectionObserver:** entrance utilities fire on load/paint via `@keyframes` + `animation-fill-mode: both`, not scroll-gated. Adding a companion observer would reintroduce the JS overhead this feature exists to avoid, and duplicates what the GSAP registry already does well. Document in the README that `tm-slide-in-*`/`tm-fade-in` are for above-the-fold/simple use — anything needing scroll-gated entrance should use the existing GSAP inspector panel instead.

**Tokens** (scoped to `:root`, freely composable across any block without a wrapper class):
```scss
:root {
  --tm-duration-fast: 150ms;
  --tm-duration-base: 300ms;
  --tm-duration-slow: 500ms;
  --tm-ease-standard: cubic-bezier(.4, 0, .2, 1);
  --tm-ease-decelerate: cubic-bezier(0, 0, .2, 1);
  --tm-ease-accelerate: cubic-bezier(.4, 0, 1, 1);
}
```

**Starter classes:**
- Entrance (on-load keyframe animations): `.tm-slide-in-up`, `.tm-slide-in-down`, `.tm-slide-in-left`, `.tm-slide-in-right`, `.tm-fade-in`, `.tm-scale-in-subtle`.
- Hover/focus (transition-based, each includes `:focus-visible` alongside `:hover` for keyboard parity): `.tm-hover-lift` (`translateY(-2px)`), `.tm-hover-grow` (slight `scale`), `.tm-hover-shadow` (elevate box-shadow), `.tm-hover-brighten` (`filter: brightness()`), `.tm-underline-grow` (for links/inline text — underline width transition).
- Closing `@media (prefers-reduced-motion: reduce)` block disabling `animation`/`transition` for every `tm-*` class, matching the reduced-motion respect the GSAP frontend already has.

**PHP:** none needed — see "Implemented delivery mechanism" above.

---

## Critical files

- `src/engine.ts` — new; `ANIMATION_CONFIGS`, `DEFAULT_TRIGGER`, `processed`, `Timing`, `applyOverrides`, `resolveTrigger`, `buildPaused` (moved out of `index.ts`), with the `buildPaused` timeline-delay fix
- `src/index.ts` — trimmed to import from `./engine`; wire `bindStaggerGroups()` call + `import "./scss/utilities.scss"`
- `src/stagger.ts` — replace stub with real stagger-binding module, imports from `./engine`
- `src/scss/utilities.scss` — new, Feature 2's classes/tokens
- `src/scss/stagger.scss` — delete
- `src/block-editor/inspector.tsx` — new Stagger `PanelBody` (using `getBlockOrder`) + attribute/save-props filters
- `src/config/scrollTrigger.ts` — reused as-is (`onScrollIntoView`)
- `theatrum-animation.php` — `wp-data` added to editor script deps (no style enqueue — see Feature 2)
- `vite.config.editor.js` — `wp.data` global mapping
- `package.json` — `@wordpress/data` devDependency

## Verification

1. `npm run build`; confirmed no separate CSS asset is emitted — `utilities.scss` is bundled into `dist/main.js` and injected via a runtime `<style>` tag (see Feature 2). No PHP path to adjust.
2. **Stagger, editor:** add a Group block with 3+ children, give each a scroll-trigger entrance animation via the existing Animation panel, confirm the new Stagger panel only appears once ≥2 inner blocks exist, set Stagger Each = 150ms / From = Start, save, reload the editor and confirm attributes persist; test undo/redo across an inner-block add/remove that crosses the `>1` threshold.
3. **Stagger, frontend:** load the page, scroll the Group into view, confirm children cascade in with increasing delay; try `From = random/center/edges` for order variation; add one hover-triggered child to the same group and confirm it's excluded and animates independently; test a lazily-inserted stagger group (if the site has infinite scroll/AJAX content) to confirm the `MutationObserver` path binds it correctly. Specifically include at least one timeline-based animation (e.g. `flicker-in`) as a stagger group member and confirm it respects its offset instead of firing simultaneously with the rest of the group (regression check for the `buildPaused` delay fix).
4. **CSS utilities:** apply `tm-hover-lift` via a block's Additional CSS Class(es) field on a Button, verify hover *and* keyboard-focus lift; apply `tm-fade-in`/`tm-slide-in-up` to an above-the-fold element and confirm it animates on load.
5. **Reduced motion:** enable OS-level `prefers-reduced-motion: reduce`; confirm both the GSAP stagger group and all `tm-*` utilities no-op/skip their animation cleanly.
