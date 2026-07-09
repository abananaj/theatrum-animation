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
- New `PanelBody title="Stagger"` in the same `InspectorControls`, rendered only when the block currently has more than one inner block: `useSelect(select => select("core/block-editor").getBlock(clientId)?.innerBlocks?.length ?? 0, [clientId]) > 1`. Import `useSelect` from `@wordpress/data`. Controls: `NumberControl` for Stagger Each (ms), `SelectControl` for Stagger From (Start/End/Center/Edges/Random). Clearing the number field back to empty is the "disable" path — no separate enable toggle, matching how Duration/Delay already work.
- `@wordpress/data` needs to be a real dependency: add to `package.json` devDependencies, add `"@wordpress/data": "wp.data"` to `output.globals` in `vite.config.editor.js` (already covered by the `/^@wordpress\//` external regex, just needs the global mapping), and add `'wp-data'` to the `deps` array in `theatrum_animation_enqueue_editor_scripts()` in `theatrum-animation.php`.

### Frontend — new module `src/stagger.ts` (replaces the deleted stub)

Exports `bindStaggerGroups(): void`, imported and called from `src/index.ts` **before** its existing `document.querySelectorAll(selector).forEach(animateElement)` sweep (and before the equivalent line inside the `MutationObserver` callback, for lazily-inserted content) — so staggered children are already in the shared `processed` WeakSet and the normal per-element sweep silently skips them via its existing guard.

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

This reuses `buildPaused` (already handles both one-shot tweens and `timeline` configs) and `onScrollIntoView` (already used for timeline-based scroll entrances) from the existing codebase — no new GSAP plumbing, just new orchestration around it. `ANIMATION_CONFIGS`, `applyOverrides`, `resolveTrigger`, `processed`, `buildPaused` currently live in `src/index.ts`; either export them from `index.ts` for `stagger.ts` to import, or move the shared bits `stagger.ts` needs into a small shared module — pick whichever keeps `index.ts` cleanest when actually writing the code.

**Delete** `src/stagger.ts`'s current throwaway content (replaced by the above) and `src/scss/stagger.scss` (unused demo classes, superseded by Feature 2's real utility file).

### Known edge cases to test, not to over-engineer for
- Nested stagger groups (a stagger parent whose direct child is itself a stagger parent): binding runs in document order (top-down), so the outer group's `processed.add(parent)` happens before its children are visited — should self-resolve, but verify manually rather than adding recursion-guard code preemptively.
- Undo/redo: the new attributes are plain `setAttributes` calls with no derived UI state (unlike the existing animation `className` logic), so no `suppressSync`-style guard should be needed — confirm the Stagger panel doesn't flicker when undo changes inner-block count across the `> 1` visibility threshold.

---

## Feature 2: Starter `tm-` CSS utility classes

**New file:** `src/scss/utilities.scss` — imported from `src/index.ts` (`import "./scss/utilities.scss"`) so Vite's existing `cssCodeSplit: true` config in `vite.config.js` emits it as a CSS asset alongside `dist/main.js`. **Verify the actual emitted filename during implementation** (expect `dist/main.css`, confirm via `npm run build`) before wiring the PHP enqueue path.

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

**PHP:** new `theatrum_animation_enqueue_styles()` in `theatrum-animation.php`, hooked to `wp_enqueue_scripts` (same `file_exists`/`filemtime` cache-busting pattern as the existing script enqueue):
```php
function theatrum_animation_enqueue_styles() {
  $style_path = plugin_dir_path(__FILE__) . 'dist/main.css';
  if (file_exists($style_path)) {
    wp_enqueue_style('theatrum-animation', plugin_dir_url(__FILE__) . 'dist/main.css', [], filemtime($style_path));
  }
}
add_action('wp_enqueue_scripts', 'theatrum_animation_enqueue_styles');
```

---

## Critical files

- `src/index.ts` — wire `bindStaggerGroups()` call + `import "./scss/utilities.scss"`
- `src/stagger.ts` — replace stub with real stagger-binding module
- `src/scss/utilities.scss` — new, Feature 2's classes/tokens
- `src/scss/stagger.scss` — delete
- `src/block-editor/inspector.tsx` — new Stagger `PanelBody` + attribute/save-props filters
- `src/config/scrollTrigger.ts` — reused as-is (`onScrollIntoView`)
- `theatrum-animation.php` — new style enqueue; `wp-data` added to editor script deps
- `vite.config.editor.js` — `wp.data` global mapping
- `package.json` — `@wordpress/data` devDependency

## Verification

1. `npm run build`; confirm the CSS asset's actual filename in `dist/` and adjust the PHP path if it differs from `dist/main.css`.
2. **Stagger, editor:** add a Group block with 3+ children, give each a scroll-trigger entrance animation via the existing Animation panel, confirm the new Stagger panel only appears once ≥2 inner blocks exist, set Stagger Each = 150ms / From = Start, save, reload the editor and confirm attributes persist; test undo/redo across an inner-block add/remove that crosses the `>1` threshold.
3. **Stagger, frontend:** load the page, scroll the Group into view, confirm children cascade in with increasing delay; try `From = random/center/edges` for order variation; add one hover-triggered child to the same group and confirm it's excluded and animates independently; test a lazily-inserted stagger group (if the site has infinite scroll/AJAX content) to confirm the `MutationObserver` path binds it correctly.
4. **CSS utilities:** apply `tm-hover-lift` via a block's Additional CSS Class(es) field on a Button, verify hover *and* keyboard-focus lift; apply `tm-fade-in`/`tm-slide-in-up` to an above-the-fold element and confirm it animates on load.
5. **Reduced motion:** enable OS-level `prefers-reduced-motion: reduce`; confirm both the GSAP stagger group and all `tm-*` utilities no-op/skip their animation cleanly.
