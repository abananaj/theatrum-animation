import gsap from "gsap"
import { type AnimationConfig, type TriggerId, flattenConfigs, flattenTriggers } from "./config/registry"
import { clearPropsFor, withPerspective } from "./config/animationConfigs"
import { getScrollTrigger, onScrollIntoView } from "./config/scrollTrigger"

export type { AnimationConfig }

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = flattenConfigs()
const DEFAULT_TRIGGER: Record<string, TriggerId> = flattenTriggers()

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

// Elements already wired up — the MutationObserver can re-visit a node (e.g. via
// a parent's querySelectorAll), and hover listeners must not be bound twice.
const processed = new WeakSet<Element>()

/** Read per-element overrides written by the block inspector (data-animation-*). */
function applyOverrides(el: Element, config: AnimationConfig): { duration: number; ease: string; delay: number } {
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

type Timing = { duration: number; ease: string; delay: number }

/** data-animation-trigger override, else the animation's category default. */
function resolveTrigger(el: Element, cls: string): TriggerId {
	const attr = el.getAttribute("data-animation-trigger")
	if (attr === "scroll" || attr === "load" || attr === "hover") return attr
	return DEFAULT_TRIGGER[cls] ?? "scroll"
}

/** Run a one-shot from/to tween. With a scrollTrigger it gates on view; without, it plays now. */
function playOneShot(el: Element, config: AnimationConfig, timing: Timing, scrollTrigger?: object): void {
	const { duration, ease, delay } = timing
	const hasRepeat = config.repeat !== undefined
	if (config.from) {
		gsap.from(el, {
			...withPerspective(config.from),
			duration, delay, ease,
			...(scrollTrigger ? { scrollTrigger } : {}),
			...(hasRepeat
				? { repeat: config.repeat, yoyo: config.yoyo }
				: { clearProps: clearPropsFor(config.from) }),
		})
	} else if (config.to) {
		gsap.to(el, {
			...withPerspective(config.to),
			duration, delay, ease,
			...(scrollTrigger ? { scrollTrigger } : {}),
			...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
		})
	}
}

/**
 * Build a config's animation paused, for triggers that decide when to play
 * (scroll-timeline, hover). `timeline()` creates its own timeline; from/to
 * become paused tweens (from-values still render immediately so the element
 * sits in its pre-animation state until played).
 */
function buildPaused(el: Element, config: AnimationConfig, timing: Timing): gsap.core.Timeline | gsap.core.Tween {
	const { duration, ease, delay } = timing
	const hasRepeat = config.repeat !== undefined
	if (config.timeline) {
		const tl = config.timeline(el)
		const speed = duration > 0 ? config.duration / 1000 / duration : 1
		if (speed !== 1) tl.timeScale(speed)
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

/** On Scroll: fire once when the element scrolls into view. */
function playOnScroll(el: Element, config: AnimationConfig, timing: Timing): void {
	if (config.timeline) {
		// Timelines can't take the integrated scrollTrigger var — build paused, play on entry.
		const tl = buildPaused(el, config, timing)
		onScrollIntoView(el, () => tl.play())
		return
	}
	playOneShot(el, config, timing, getScrollTrigger(el))
}

/** On Load: fire immediately on page load, regardless of scroll position. */
function playOnLoad(el: Element, config: AnimationConfig, timing: Timing): void {
	if (config.timeline) {
		// Honor duration via playback speed, delay by restarting with the delay included.
		const tl = config.timeline(el)
		const speed = timing.duration > 0 ? config.duration / 1000 / timing.duration : 1
		if (speed !== 1) tl.timeScale(speed)
		if (timing.delay > 0) {
			tl.delay(timing.delay)
			tl.restart(true)
		}
		return
	}
	playOneShot(el, config, timing)
}

/** On Hover: play while hovered, pause on leave. Touch has no hover → tap-to-toggle. */
function playOnHover(el: Element, config: AnimationConfig, timing: Timing): void {
	const anim = buildPaused(el, config, timing)
	if (window.matchMedia("(hover: hover)").matches) {
		el.addEventListener("mouseenter", () => anim.play())
		el.addEventListener("mouseleave", () => anim.pause())
	} else {
		el.addEventListener("click", () => {
			if (anim.paused()) anim.play()
			else anim.pause()
		})
	}
}

function animateElement(el: Element): void {
	if (processed.has(el)) return
	const cls = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))
	if (!cls) return
	processed.add(el)

	const config = ANIMATION_CONFIGS[cls]
	const timing = applyOverrides(el, config)

	switch (resolveTrigger(el, cls)) {
		case "load":  return playOnLoad(el, config, timing)
		case "hover": return playOnHover(el, config, timing)
		default:      return playOnScroll(el, config, timing)
	}
}

export function initializeAnimations(): void {
	// WCAG 2.3.3 / 2.2.2: honor the OS-level reduced-motion preference. Safe to
	// skip entirely — pre-animation states are applied by GSAP itself (from-
	// tweens), so untweened elements simply render in their final state.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

	document.querySelectorAll(selector).forEach(animateElement)

	const animationKeys = Object.keys(ANIMATION_CONFIGS)

	// Animation classes are server-rendered, so only watch for inserted nodes
	// (e.g. lazy-loaded content) — observing class-attribute flips would fire
	// on every unrelated UI toggle on the page.
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue
				if (animationKeys.some(k => node.classList.contains(k))) {
					animateElement(node)
				}
				node.querySelectorAll(selector).forEach(animateElement)
			}
		}
	}).observe(document.body, { childList: true, subtree: true })
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeAnimations)
} else {
	initializeAnimations()
}
