# AGENTS.md

Claude Code agent workflows specific to **theatrum-animation**. For site-wide agent
workflows, see [wp_root AGENTS.md](../../../AGENTS.md). For architecture, see
[CLAUDE.md](CLAUDE.md) and [README.md](README.md).

## Code Comments

One line, essential info only. No multi-line/wrapped comment blocks, no restating what the code does — if a comment needs more than one line, cut it down or drop it.

## Working in this plugin

This is the best-documented submodule in the project — `README.md`'s "Next Steps" section is
kept current as a live changelog-of-fixes, and `CHANGELOG.md` exists (unlike theatrum-admin
and theatrum-credits, this plugin has its own, so the root `/changelog` skill pulls from it
directly rather than deriving entries from `git log`).

Before changing animation behavior, read README's "AnimationConfig shape" and the paragraph
right after it about unique CSS class keys — the plugin has already been bitten once by a
class-key collision across categories (three-way `scale-up`/`scale-down` clash between exit,
attention, and basic), and a new animation with a colliding key would reintroduce that bug
silently (frontend and inspector would show different things with no error).

## Common Tasks

### Adding a new animation

1. Add the config to the appropriate category file under `src/entrance/`, `src/exit/`,
   `src/attention/`, `src/text/`, `src/background/`, or `src/basic/`
2. Register it in `src/config/registry.ts`'s `REGISTRY` — this is the single source of truth
   the inspector dropdowns and frontend player both read from
3. Confirm the CSS class key is unique across the **entire** registry, not just its own
   category (grep for it first)
4. If it's a `timeline`-based (looping) animation rather than a one-shot `from`/`to` tween,
   confirm it bypasses ScrollTrigger correctly and test Duration/Delay override behavior
   (`timeScale()`/`delay()`) — see README's AnimationConfig section
5. Run `npm run typecheck` and `npm run build`, then verify in both the inspector Preview
   button and an actual scroll/load/hover trigger on the frontend

### Reviewing changes

```bash
/code-review low
```

Check the change against README's "Next Steps" open-issues list first — a fix that touches
dynamic-block rendering, Ken Burns, or the `ping` timeline is working in an area with a
documented, unresolved limitation; read the relevant note before assuming a fresh bug.
