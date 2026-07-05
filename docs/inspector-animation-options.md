# Inspector Panel — Why Only "Entrance → Slide In" Shows

**Date:** 2026-06-19
**Status:** ✅ Resolved — implemented as "Approach 1" on 2026-07-05. The inspector panel
(`src/block-editor/inspector.tsx`) is now fully auto-derived from `REGISTRY`
(`src/config/registry.ts`) — all 6 categories and every animation/variant are exposed.
This document is kept for historical context only; see `README.md` for current architecture.

## Summary

The README describes the full intended feature set (6 categories, ~60 animations),
but the block editor inspector panel only exposes **Entrance → Slide In → 8 directions**.

**The frontend is fully built; only the editor UI is incomplete.**

- `src/index.ts` already imports and registers ~60 animations across all 6 categories
  (Entrance, Exit, Attention, Text, Background, Basic), keyed by CSS class name
  (`slide-in-top`, `fade-in`, `rotate-in-center`, `heartbeat`, etc.).
- These all animate correctly on the frontend — add a class like `fade-in-tl` or
  `heartbeat` manually and it works.
- `src/block-editor/inspector.tsx` is a partial implementation. Its dropdown option
  registries are hardcoded to one category / one animation / slide-in directions.

## Where the limitation lives (`src/block-editor/inspector.tsx`)

| Location | Current state | Needs |
|----------|---------------|-------|
| `CATEGORY_OPTIONS` (line ~15) | only `entrance` | all 6 categories |
| `ANIMATION_OPTIONS` (line ~20) | only `slide-in` | every animation per category |
| `DIRECTION_OPTIONS` (line ~27) | only `slide-in` | per-animation variant lists |
| `ALL_ANIMATION_CLASSES` (line ~11) | built only from slide-in directions | every animation's class keys |
| `parseAnimationClass` / `stripAnimationClasses` (lines ~59–71) | only recognize `slide-in-*` | handle all classes |

> The last two are easy to forget: if you only expand the dropdowns but not these,
> the new animations won't save/parse correctly.

## Source of truth for dropdown `value`s

The config object **keys** are the actual CSS class names (direction baked in):

- `entrance/slide-in/slide-in.ts` → `slide-in-top`, `slide-in-tr`, `slide-in-right`, …
- `entrance/fade-in.ts` → `fade-in`, `fade-in-top`, `fade-in-fwd`, `fade-in-bck`, …
- `entrance/rotate-in/rotate-in.ts` → `rotate-in-center`, `rotate-in-hor`, `rotate-in-ver`, `rotate-in-diag-1`, …

## Key design nuance: "direction" is not uniform

The variant set differs per animation, so the panel can't use one shared direction list:

- `slide-in` → 8 compass directions
- `fade-in` → 8 directions **+** `fwd` / `bck`
- `rotate-in` → directions **+** `hor` / `ver` / `diag-1` / `diag-2`
- attention animations (`heartbeat`, `shake`, …) → **no** direction

Whatever gets built needs per-animation variant lists (or auto-derivation from the
config keys), not a single global direction dropdown.

## Two implementation approaches considered

1. **Auto-derive from configs** — generate the Category/Animation/Variant dropdowns
   from the actual config keys. Single source of truth; new animations appear
   automatically; no drift between frontend and editor.
2. **Hardcode full option trees** — manually expand the three registries to cover
   everything that exists today. Simpler diff, but must be hand-updated as configs change.

Nothing is broken — the rest of the inspector just hasn't been built yet.
