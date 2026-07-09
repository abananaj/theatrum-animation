import gsap from "gsap"
import { type AnimationConfig } from "./config/registry"
import { clearPropsFor, withPerspective } from "./config/animationConfigs"
import { getScrollTrigger, onScrollIntoView } from "./config/scrollTrigger"
import { ANIMATION_CONFIGS, processed, applyOverrides, resolveTrigger, buildPaused, type Timing } from "./engine"
import { bindStaggerGroups } from "./stagger"
import "./scss/utilities.scss"

export type { AnimationConfig }

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

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

	bindStaggerGroups()
	document.querySelectorAll(selector).forEach(animateElement)

	const animationKeys = Object.keys(ANIMATION_CONFIGS)

	// Animation classes are server-rendered, so only watch for inserted nodes
	// (e.g. lazy-loaded content) — observing class-attribute flips would fire
	// on every unrelated UI toggle on the page.
	new MutationObserver((mutations) => {
		bindStaggerGroups()
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
