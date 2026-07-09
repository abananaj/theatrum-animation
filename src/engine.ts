import gsap from "gsap"
import { type AnimationConfig, type TriggerId, flattenConfigs, flattenTriggers } from "./config/registry"
import { clearPropsFor, withPerspective } from "./config/animationConfigs"

export type { AnimationConfig, TriggerId }

export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = flattenConfigs()
export const DEFAULT_TRIGGER: Record<string, TriggerId> = flattenTriggers()

// Elements already wired up — the MutationObserver can re-visit a node (e.g. via
// a parent's querySelectorAll), and hover listeners must not be bound twice.
export const processed = new WeakSet<Element>()

export type Timing = { duration: number; ease: string; delay: number }

/** Read per-element overrides written by the block inspector (data-animation-*). */
export function applyOverrides(el: Element, config: AnimationConfig): Timing {
	let duration = config.duration
	let ease = config.ease
	let delay = 0

	// Ignore malformed values (older saved content may carry "NaN").
	const customDuration = parseInt(el.getAttribute("data-animation-duration") ?? "", 10)
	if (!Number.isNaN(customDuration)) duration = customDuration

	const customDelay = parseInt(el.getAttribute("data-animation-delay") ?? "", 10)
	if (!Number.isNaN(customDelay)) delay = customDelay

	const customEase = el.getAttribute("data-animation-ease")
	if (customEase) ease = customEase

	return { duration: duration / 1000, ease, delay: delay / 1000 }
}

/** data-animation-trigger override, else the animation's category default. */
export function resolveTrigger(el: Element, cls: string): TriggerId {
	const attr = el.getAttribute("data-animation-trigger")
	if (attr === "scroll" || attr === "load" || attr === "hover") return attr
	return DEFAULT_TRIGGER[cls] ?? "scroll"
}

/**
 * Build a config's animation paused, for triggers that decide when to play
 * (scroll-timeline, hover, stagger). `timeline()` creates its own timeline; from/to
 * become paused tweens (from-values still render immediately so the element
 * sits in its pre-animation state until played).
 */
export function buildPaused(el: Element, config: AnimationConfig, timing: Timing): gsap.core.Timeline | gsap.core.Tween {
	const { duration, ease, delay } = timing
	const hasRepeat = config.repeat !== undefined
	if (config.timeline) {
		const tl = config.timeline(el)
		const speed = duration > 0 ? config.duration / 1000 / duration : 1
		if (speed !== 1) tl.timeScale(speed)
		if (delay > 0) tl.delay(delay)
		return tl.pause()
	}
	if (config.from) {
		return gsap.from(el, {
			...withPerspective(config.from),
			duration, delay, ease, paused: true,
			...(hasRepeat
				? { repeat: config.repeat, yoyo: config.yoyo }
				: { clearProps: clearPropsFor(config.from) }),
		})
	}
	return gsap.to(el, {
		...withPerspective(config.to ?? {}),
		duration, delay, ease, paused: true,
		...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
	})
}
