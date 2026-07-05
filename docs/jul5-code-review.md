# Code Review — theatrum-animation

**Date:** 2026-07-05
**Branch:** `fable-exp` (clean at `bc4a0de`)
**Scope:** All source (`src/`, PHP, build configs), documentation (`README.md`, `docs/`), and project hygiene.
**Review lenses:** WordPress coding standards; plus the web resources saved in Notion:

- [The Complete Guide to Using Animation in Web Design for Better UX and SEO](https://www.zachsean.com/post/the-complete-guide-to-using-animation-in-web-design-for-better-ux-and-seo) (Zach Sean) — performance ("every kilobyte should earn its keep"), Core Web Vitals, `prefers-reduced-motion`
- [Stop Describing Animations by "Feelings"](https://medium.com/@kkatanono/stop-describing-animations-with-feelings-8395bb99b160) (K. Katano) — precise, named motion vocabulary
- [6 Effective Types of Web Animation](https://design4users.com/web-animation/) (Design4Users) — animation taxonomy and restraint
- Cited within those: [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html), [NN/g Animation Usability](https://www.nngroup.com/articles/animation-usability/)

---

## Verdict

The architecture is genuinely good: `REGISTRY` as a single source of truth with the inspector auto-derived from it (the "Approach 1" the diagnosis doc recommended) is implemented and working, `clearPropsFor()` shows careful thought about WordPress block-support inline styles, and the PHP is small and correctly guarded. The code is **ahead of its own documentation** — two of the README's listed bugs are already fixed.

The highest-impact gaps are not in what exists but in what's missing: **no `prefers-reduced-motion` support** (an accessibility failure your own saved resources call non-negotiable), **~360 KB of JS in the admin including two separate GSAP instances**, and a **three-way CSS-class collision** on the `scale-up-*`/`scale-down-*` families that silently breaks two of the three.

---

## 1. Confirmed bugs (verified in current code)

### 1.1 🔴 `scale-down-*` / `scale-up-*` defined identically in THREE categories

The same 15 `scale-down-*` class keys exist verbatim in:

- `src/exit/scale-out/scale-down.ts` (one-shot, 400 ms, `power2.in`)
- `src/attention/scale-down.ts` (looping, 800 ms, `repeat: -1, yoyo: true`)
- `src/basic/scale/scale-down.ts` (one-shot, 400 ms — byte-identical to the exit file)

(`scale-up-*` mirrors this.) The README's tech-debt item #6 describes this as a two-way collision labeled "Attention" — it's actually worse and mislabeled:

- `flattenConfigs()` (registry.ts:224) is **last-wins** → the **basic** one-shot config always plays, on the frontend and in Preview.
- `buildClassIndex()` (registry.ts:235) is **earliest-wins** → the inspector attributes the class to **Exit** (exit precedes attention in `REGISTRY`), not "Attention" as the README says.

**User-visible failure:** pick *Basic → Scale Down → Center*, save, reload the editor — the panel now reads *Exit → Scale Out Down*. Pick *Attention → Scale Down* — you get a one-shot 400 ms shrink instead of the looping pulse, permanently.

**Fix:** namespace the class keys per category (e.g. `attn-scale-down-center`, `exit-scale-down-center`) or delete two of the three definitions. The exit and basic files are identical — at minimum one of those is pure duplication.

### 1.2 🔴 No `prefers-reduced-motion` support (WCAG 2.3.3 / 2.2.2)

`grep` finds no `prefers-reduced-motion` / `matchMedia` anywhere in `src/`. Every page with an animated block plays motion unconditionally — including infinite loops (`vibrate`, `blink`, `heartbeat`, `bg-pan`, `color-change`) that also implicate WCAG 2.2.2 (pause/stop/hide for motion lasting >5 s).

WCAG's guidance (fetched during this review): decorative animations layered onto scrolling — exactly what ScrollTrigger entrances are — must be disableable; the primary technique is honoring the OS-level reduced-motion preference. The Zach Sean article recounts real users experiencing dizziness from scroll-triggered effects.

**Fix (small):** early-exit in `initializeAnimations()` (src/index.ts:70):

```ts
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
```

Better: use `gsap.matchMedia()` so reduced-motion users still get instant opacity-only reveals (elements animated with `gsap.from({opacity: 0, …})` must not be left invisible — a plain `return` before any tween runs is safe because `from`-tweens never apply their start state; just don't ship a CSS "hidden until animated" state later without revisiting this).

### 1.3 🔴 GSAP bundled twice; two independent GSAP instances in the admin

`vite.config.editor.js:24` externalizes only `react` and `@wordpress/*` — `inspector.tsx` imports `gsap`, so it's bundled into `dist/editor.js` (161 KB; the inspector alone would be ~15 KB). Meanwhile `theatrum-animation.php:62-75` also enqueues `dist/main.js` (200 KB, its own GSAP+ScrollTrigger) into the admin.

Consequences:

- ~360 KB of plugin JS on every editor screen; GSAP shipped twice.
- Two **separate GSAP runtimes**. `gsap.killTweensOf(blockEl)` in `handlePreview` (inspector.tsx:242) only kills tweens created by *editor.js's* GSAP. In a non-iframed editor (classic meta boxes, plugins forcing non-iframe), `main.js`'s MutationObserver also animates blocks — those tweens are invisible to the preview's kill call, so the two instances can fight over the same element's transform.

**Fix:** have one bundle own GSAP. Simplest: expose GSAP from `main.js` (it's already an IIFE with `name: "TheatrumAnimation"`) and mark `gsap` external in the editor build mapped to that global; add `theatrum-animation-canvas` to the editor script's dependency array in PHP.

### 1.4 🟠 `NaN` can still be written to `data-animation-duration` / `-delay`

README bug #3 is only half-fixed. inspector.tsx:298-302 guards `val !== "" && val != null`, but `parseInt("-", 10)`, `parseInt("e5", 10)`, etc. are `NaN`, and `NaN != null` → `data-animation-duration="NaN"` is saved; the frontend (`src/index.ts:19`) does `parseInt` with no `isNaN` guard, GSAP gets `duration: NaN`, and the animation snaps with no transition.

**Fix (both ends):**
- Inspector: `const n = parseInt(val, 10); setAttributes({ animationDuration: Number.isNaN(n) ? null : n })`
- Frontend `applyOverrides`: ignore the attribute when `Number.isNaN(parsed)` (defends existing saved content).

### 1.5 🟠 Preview leaks infinite-repeat timelines (README bug #2 — still present)

`handlePreview` (inspector.tsx:242-247) calls `gsap.killTweensOf(blockEl)` then `config.timeline(blockEl, duration)`. `killTweensOf` kills the child tweens but not the timeline container; each click on a `repeat: -1` animation (heartbeat, jello, ping, all color-change/bg-pan) adds another live container to GSAP's root ticker. The README's own fix is right: keep the returned timeline in a `useRef` and `.kill()` it before creating a new one (also kill it on unmount via `useEffect` cleanup).

### 1.6 🟠 `z`-axis animations do nothing — wider than the README says

README bug #4 flags `fade-in-fwd`/`fade-in-bck` (`src/entrance/fade-in.ts:15-16`, `from: { z: ±80 }`). Confirmed still present — GSAP z-translation is visually inert without `transformPerspective` on the element (or `perspective` on the parent). But the same pattern is also in the **text** category: `tracking-in-contract-bck*` and `tracking-in-expand-fwd*` (`src/text/tracking-in.ts:8-13`, `z: 400` / `z: -700`), and likely `tracking-out`/`blur-out` mirrors. All of these silently degrade to their non-z portion.

**Fix:** add `transformPerspective: 800` (or similar) to every config that animates `z`, or replace z with `scale` equivalents.

### 1.7 🟡 `suppressSync` ref can latch and swallow a real external change (new finding)

All four handlers set `suppressSync.current = true` before `setAttributes` (inspector.tsx:184-219). The `useEffect([className])` (line 167) resets it — but only if `className` actually changes. If a handler produces an identical `className` (e.g. picking a Category when no animation class was applied: `stripAnimationClasses` of a class-free string is a no-op), the effect never fires, the flag stays `true`, and the **next genuine external change** (undo/redo, a class typed in the Advanced panel) is incorrectly treated as self-initiated — recreating the exact stale-dropdown bug the mechanism was built to fix, one step later.

**Fix:** only set the flag when the new `className` differs from the current one, or reset the flag in a `useEffect` with no deps after every commit.

### 1.8 🟡 Duration/delay/ease overrides silently ignored for timeline animations

`animateElement` (src/index.ts:38-41) computes overrides, then calls `config.timeline(el, duration)` — but every timeline implementation ignores the parameter: `heartbeat.ts`, `background.ts`, `background-pan.ts` hardcode second values; `ping.ts` doesn't even declare it. `delay` and `ease` aren't passed at all. A user setting Duration/Delay/Ease on heartbeat or bg-pan in the inspector sees no effect on the frontend. Either honor the parameter (e.g. `tl.timeScale(configDuration / userDuration)` + `tl.delay(delay)`) or hide those controls for timeline-based animations so the UI doesn't lie.

### 1.9 🟡 `data-animation-*` never reaches dynamic blocks

`blocks.getSaveContent.extraProps` (inspector.tsx:121) only affects statically-saved block HTML. Server-rendered blocks (most of **theatrum-blocks**' query/meta blocks, per the family architecture) keep the animation *class* (className attribute survives) but lose duration/delay/ease overrides. Worth a documented limitation at minimum; the full fix is a `render_block` PHP filter that maps the attributes onto the wrapper.

### 1.10 🟡 `ping` loop reset jump (README bug — unverified visually, code unchanged)

`src/attention/ping.ts` still ends its cycle at `scale: 2.2` (invisible) before the `repeat: -1` snaps back to the `fromTo` start. The README's diagnosis stands; needs a visual test.

---

## 2. Performance (Core Web Vitals lens)

- **`main.js` (200 KB) loads on every front-end page** unconditionally (`theatrum-animation.php:45`), animations present or not. The Zach Sean article's rule — "every kilobyte should earn its keep" — argues for conditional enqueue. Detecting usage is admittedly awkward (classes, not blocks), but even a cheap heuristic (post-content regex against a cached class list, or an option toggled per-post on save) would spare most pages. At minimum add `defer` via `wp_script_add_data` / the `strategy` arg (WP 6.3+): `array('strategy' => 'defer')`.
- **MutationObserver watches the entire `document.body` subtree with `attributes: true`** (src/index.ts:93). Every class flip anywhere on the page (menu toggles, sliders, LiteSpeed lazy-load swaps) runs the callback. Fine on most pages; on the admin copy (see 1.3) it observes the whole wp-admin DOM. Consider scoping to the content area or dropping attribute observation on the frontend where classes are server-rendered anyway.
- **Generic class names risk false positives.** The selector matches bare classes like `slide-top`, `bounce-left`, `blink`, `rotate`, `flip` (src/basic, src/attention). Any theme/plugin markup using those names gets animated by the MutationObserver. A `ta-` prefix (one-time content migration) would make matches unambiguous — same argument as the motion-vocabulary article makes for naming: precision removes ambiguity.
- **`enqueue_block_assets` canvas copy** (`theatrum-animation.php:62-75`): in the iframed post editor (WP 6.3+, all-v3 blocks) scripts enqueued this way don't execute inside the canvas iframe, so this 200 KB likely never does the job it was added for ("editor canvas preview" per README) — the Preview button already handles the iframe explicitly via `contentDocument`. Verify in your editor; if the canvas is iframed, this hook can probably be deleted outright, which also dissolves finding 1.3's dual-instance risk.

---

## 3. Accessibility summary

| Issue | Guideline | Status |
|---|---|---|
| No reduced-motion handling | WCAG 2.3.3 (AAA), broadly treated as baseline practice | ❌ missing (see 1.2) |
| Infinite loops with no pause mechanism | WCAG 2.2.2 (A) — pause/stop/hide for >5 s motion | ❌ missing |
| Flashing animations (`flicker`, `blink`, `text-flicker`) | WCAG 2.3.1 — three flashes threshold | ⚠️ review the actual flash rates; keep below 3/s |
| Scroll entrances hiding content from keyboard/AT users | — | ✅ OK — `gsap.from` never leaves elements hidden if JS fails, since the pre-animation state is applied by JS itself |

---

## 4. Documentation review

The README is unusually good — honest, specific, and it correctly predicted most of what this review confirmed. But it has drifted from the code, in both directions:

| README claim | Reality |
|---|---|
| Bug #1: undo/redo leaves stale inspector state | **Already fixed** — the `useEffect([className])` + `suppressSync` mechanism it prescribes exists at inspector.tsx:163-174 (modulo finding 1.7) |
| Bug #3: `NaN` stored | **Half-fixed** — empty-string guarded; `parseInt` NaN path remains (finding 1.4) |
| Tech debt #11: `ALL_ANIMATION_CLASSES` O(n) scan | **Already fixed** — `stripAnimationClasses` uses `CLASS_INDEX`, the constant is gone |
| Tech debt #6: collision labeled "Attention", two-way | Collision is **three-way** (exit too) and the index labels it **Exit** (finding 1.1) |
| Tech debt #13: "looping animations skip ScrollTrigger (attention, background)" | Only **timeline-based** ones skip it. Tween-based loopers (`kenburns-*`, `bounce-*`, attention `scale-*`) go through ScrollTrigger with `once: true` |
| "No `npm run start`" (#9), `main` field (#8), `tsconfig.node.json` (#5), orphaned drafts (#4/#7 numbering) | All still true and outstanding |

Other documentation issues:

- **README "Next Steps" numbering is broken**: the Bugs list runs 1, 2, 3, 4, 2, 3 and Tech Debt restarts at 4. If this list is being used as a work queue (it reads like one), the duplicate numbers will cause confusion — e.g. "fix Bug #2" is ambiguous between the timeline leak and the ping loop.
- **`docs/inspector-animation-options.md` is fully obsolete.** It documents (as "Status: Diagnosis only") a hardcoded, entrance-only inspector; the shipped inspector is the auto-derived "Approach 1" it recommended. Add a resolution header ("Resolved — implemented as Approach 1 on <date>") or delete it; as-is, a newcomer reading `docs/` first would conclude the panel is unbuilt.
- **README header says "Snapshot: June 2026 — pre-refactor archive"** while the branch has active July commits. Either the snapshot line or the doc is stale; clarify which.
- **Missing plugin-level CHANGELOG.md** — the wp_root CLAUDE.md aggregates changelogs from submodules; this plugin has none to aggregate.
- Suggestion inspired by the motion-vocabulary article: the README's category table lists names only. A generated reference table of **class → default duration/ease/loop behavior** would give designers the exact "0.6s, ease-out" vocabulary the article advocates, and could be auto-emitted from `REGISTRY` at build time so it can't drift.

---

## 5. Tech debt & standards (smaller items)

1. **Orphaned drafts confirmed dead**: `RadioControlDirection.js`, `SelectControlEase.js`, `SelectControlEntrance.js`, `SelectControlEntrance.tsx` — zero imports anywhere in `src/`. Delete (README already says so).
2. **No `strict` in tsconfig.json** and **no typecheck script** — Vite strips types without checking them, which is exactly why the invalid TS in the draft files has never errored. Add `"strict": true` and a `"typecheck": "tsc --noEmit"` script (deleting the drafts first, or they'll fail it — which is the point).
3. **`tsconfig.node.json` includes `vite.config.ts`** which doesn't exist (configs are `.js`) — still true; change to `vite.config*.js` + `checkJs`, or drop the project reference.
4. **`package.json`**: `main: "dist/index.js"` (output is `main.js`); no `npm run start` per the wp_root CLAUDE.md plugin convention; `build:watch` only watches the editor bundle (add `vite build --watch` in parallel — e.g. `npm-run-all --parallel`).
5. **`.gitignore`** lists `build` (nothing outputs there; `dist/` is the real output and is intentionally committed) — stale entry. It also ignores `animista/` — so the stale keyframe sources aren't in git; the local folder can be deleted whenever confidence in the GSAP ports allows (README #7), and the README's File Reference row for it updated.
6. **Dead CSS enqueue**: `theatrum-animation.php:36-43` enqueues `dist/main.css`, which is never produced (no CSS imports in `src/`). Harmless due to `file_exists`, but delete or document.
7. **i18n**: every inspector string ("Animation", "Category", "Duration (ms)", "Preview Animation"…) is hardcoded. The plugin declares `Text Domain: theatrum-animation` but never uses it. WP standard: `__()` from `@wordpress/i18n` + `wp_set_script_translations()`. Low priority for a single-site plugin, but it's the one clear WordPress-coding-standards violation.
8. **`__experimentalNumberControl`** (inspector.tsx:4) — still experimental API; watch on Gutenberg upgrades (README #10).
9. **Category dropdown one-frame snap-back** (README #12) — `activeCategory = parsed.category || uiCategory` (inspector.tsx:177) still present; cosmetic.
10. **`kenburns-*` semantics**: configs transform the element itself (`scale`/`x`/`y` on the block wrapper), so applying it to a cover block scales the *entire block including text*, not the background image. True Ken Burns needs the transform on an inner image layer with `overflow: hidden` on the wrapper. Worth a docs note or a targeted implementation (e.g. animate `.wp-block-cover__image-background` when present).
11. **PHP dependency array** (`theatrum-animation.php:54`) hardcodes `['react', 'wp-hooks', …]` — correct handles, but if the editor build's externals ever change, this list must be hand-synced. A `*.asset.php` (wp-scripts convention) or a comment tying it to `vite.config.editor.js` would prevent drift.

---

## 6. What's in good shape ✅

- **`REGISTRY` single-source-of-truth design** — editor options, variant labels, and frontend configs all derive from one structure; new animation files self-register in both places. This is the right architecture and it's cleanly executed.
- **`clearPropsFor()`** (animationConfigs.ts:16) — clearing only animated props instead of `clearProps: "all"` to preserve WordPress block-support inline styles is a subtle, correct decision, and the comment explains *why*.
- **Auto-derived variant labels** (`variantOptions`, common-token-prefix stripping) — clever and it eliminates a whole class of drift.
- **Undo/redo sync mechanism** exists and is mostly right (modulo 1.7) — the README just hasn't caught up.
- **PHP layer**: ABSPATH guard, `file_exists` checks, `filemtime` cache-busting, footer loading, prefixed function names — all per WP standards.
- **Preview's iframe handling** (inspector.tsx:227-231) — correctly targets the canvas iframe and scopes the selector to avoid the List View row; the comment explains the trap it avoids.
- **README animation counts** (16/19/12/8/3/20 per category) — verified accurate against `REGISTRY`.

---

## 7. Prioritized action list

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | Add `prefers-reduced-motion` gate to `initializeAnimations()` | ~5 lines | Accessibility compliance, real users |
| 2 | Resolve the 3-way `scale-*` class collision | Medium (rename or dedupe + content check) | Unbreaks attention loops, fixes editor mislabeling |
| 3 | Externalize GSAP from `editor.js` (or drop the canvas enqueue after verifying iframe behavior) | Small | −70 KB admin, kills dual-instance conflicts |
| 4 | `NaN` guards in inspector + `applyOverrides` | ~4 lines | Data integrity |
| 5 | Timeline ref + `.kill()` in `handlePreview` | Small | Editor perf/leak |
| 6 | `transformPerspective` on all `z`-animating configs (fade + text) | Small | ~10 dead variants start working |
| 7 | Delete 4 orphan drafts; add `strict` + `typecheck` script | Small | Hygiene, future safety |
| 8 | Update README Next Steps (remove fixed bugs, fix numbering); mark diagnosis doc resolved | Small | Docs trustworthy again |
| 9 | Honor or hide duration/delay/ease for timeline animations | Medium | UI honesty |
| 10 | Conditional/deferred frontend enqueue; consider `ta-` class prefix | Medium–Large | Core Web Vitals, collision safety |

---

*Generated by Claude Code review session, 2026-07-05. Sources: full read of `src/` (79 files), `theatrum-animation.php`, both Vite configs, tsconfigs, `package.json`, `.gitignore`, `README.md`, `docs/inspector-animation-options.md`; Notion pages "The Complete Guide to Using Animation in Web Design…", "Stop Describing Animations by Feelings", "6 Effective Types of Web Animation"; WCAG 2.3.3 Understanding doc; NN/g Animation Usability.*
