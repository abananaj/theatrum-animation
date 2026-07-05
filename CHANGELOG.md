# Changelog

All notable changes to this plugin are documented here, following
[Keep a Changelog](https://keepachangelog.com/) format. This plugin follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- `prefers-reduced-motion` now disables all frontend animations (WCAG 2.3.3 / 2.2.2).
- Three-way `scale-up`/`scale-down` class collision between Exit, Attention, and Basic
  categories — Attention's looping variants renamed to `attn-scale-*`; Exit's duplicate
  one-shot definitions deleted.
- `NaN` could be written to `data-animation-duration`/`-delay` from intermediate
  inspector input; guarded on both the inspector write and the frontend read.
- Editor "Preview Animation" leaked a live GSAP timeline on every click for
  looping animations; now killed and replaced via a ref.
- `z`-axis animations (`fade-in-fwd`/`bck`, `tracking-in`/`out`, `blur-out` variants)
  were visually inert without `transformPerspective`; added.
- `suppressSync` ref in the inspector could latch permanently on a no-op className
  write, silently breaking undo/redo sync afterward.
- Timeline-based animations (heartbeat, ping, color-change, bg-pan) now honor the
  inspector's Duration/Delay overrides via `timeScale()`/`delay()`; Ease controls
  are hidden for them since a multi-step timeline has no single ease to override.
- Removed the `enqueue_block_assets` canvas-preview script enqueue — dead in the
  iframed block editor canvas, and its removal also eliminates a dual-GSAP-instance
  conflict with the editor bundle.
- Fixed a bad relative import path in `src/entrance/fade-in.ts`.
- Fixed an invalid 3-argument `gsap.set()` call in `flip-scale.ts`.
- `attention/flicker.ts`'s `flicker-2`–`flicker-5` variants exceeded WCAG 2.3.1's
  3-flashes/sec general threshold while looping indefinitely (up to 5/sec); loop
  duration widened per variant to bring all under 3/sec (pattern shape preserved).

### Changed
- Frontend script now loads with `strategy: 'defer'`.
- Frontend `MutationObserver` no longer watches class-attribute mutations across
  the whole document — only inserted nodes — since animation classes are
  server-rendered and class-flip watching was needlessly broad.
- Inspector strings wrapped in `__()`; `wp_set_script_translations()` wired up.

### Removed
- Dead `dist/main.css` enqueue (no CSS is ever produced by the build).
- Four orphaned draft files under `src/block-editor/` never imported anywhere.
- `tsconfig.node.json`, which referenced a nonexistent `vite.config.ts`.

### Added
- `strict: true` in `tsconfig.json` and an `npm run typecheck` script.
- `npm run start` — parallel watch of both the frontend and editor bundles.
