# theatrum-animation — Block Animation System

> First draft. Component deep-dive; project-level story lives in the [root case study](../../../CASE_STUDY.md).

A GSAP-backed animation library any block can use from the inspector.
82 TypeScript animation definitions, no code required to apply one.

---

## Goal

- Let editors animate any block without writing CSS or JavaScript.
- Get real motion control — timing, easing, scroll triggers, stagger — not the two or three canned effects a page builder offers.
- Have animations preview correctly **in the editor canvas**, not just on the front end.

---

## Timeline

43 commits, 2026-05-11 → 2026-08-31.

- **May** — Init, build setup.
- **Jun** — The pivotal month. CSS keyframes converted to TypeScript definitions, then **migrated wholesale onto a GSAP `AnimationConfig` engine**; the inspector UI built; editor-canvas animation fixed along with a global scope-pollution bug.
- **Jul** — ScrollTrigger and stagger implemented; popup conflict resolved; a code-review round.
- **Aug** — Stagger fixes and inspector repositioning; background-size bug; scrollbar support; fade removed from slide-ins; ScrollTrigger boundaries refreshed on window load; custom ScrollTrigger points; `tm-` → `tma-` CSS prefix rename; standards tooling.

---

## Structure

`src/` — TypeScript, one file per animation

| Category | Count | Examples |
|---|---|---|
| `entrance/` | 16 | fade/slide/scale in |
| `exit/` | 17 | fade/slide/scale out |
| `attention/` | 12 | bounce, shake, pulsate, heartbeat, jello, wobble, flicker, ping |
| `basic/` | 20 | flip, rotate, scale, shadow, slide, swing families |
| `text/` | 8 | text-specific reveals |
| `background/` | 3 | pan, Ken Burns |

- `engine.ts` — the GSAP runtime; reads data attributes off the DOM and builds timelines
- `stagger.ts` — sequenced animation across a block's children
- `config/` — shared timing and easing definitions
- `block-editor/` — inspector controls and canvas preview

---

## Highlights

**Keyframes → GSAP**

- The first version was CSS keyframes. It couldn't do scroll triggers, couldn't stagger, and couldn't be composed.
- Rewritten onto GSAP with a shared `AnimationConfig` shape, so all 82 definitions are the same kind of object and the engine handles them uniformly.

**Data-attribute driven**

- The block writes `data-*` attributes; the engine reads the DOM and builds the timeline.
- No per-block JavaScript, no registration step. Adding an animation is adding a file.

**ScrollTrigger**

- Custom trigger points, and a `ScrollTrigger.refresh()` on window load — without it, boundaries computed before images loaded were wrong on every image-heavy page.

**Editor canvas preview**

- Gutenberg renders in an iframe. Animations that work on the front end silently do nothing in the editor unless you handle that — fixed in June, alongside a global scope-pollution bug the same work surfaced.

---

## Results

> **TODO:**
> - Which animations are actually in use on the live site
> - Performance impact — GSAP bundle size, any measured effect
> - A recording of the inspector workflow
