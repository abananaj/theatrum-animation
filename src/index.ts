import gsap from "gsap"
import { type AnimationConfig, flattenConfigs } from "./config/registry"
import { clearPropsFor, withPerspective } from "./config/animationConfigs"
import { getScrollTrigger } from "./config/scrollTrigger"

export type { AnimationConfig }

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = flattenConfigs()

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

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

function animateElement(el: Element): void {
	const animationType = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))
	if (!animationType) return
	const config = ANIMATION_CONFIGS[animationType]
	const { duration, ease, delay } = applyOverrides(el, config)
	const hasRepeat = config.repeat !== undefined

	// Looping / multi-step animations manage their own timeline. Honor the
	// user's duration by rescaling playback speed, and delay by restarting
	// with the delay included. (Ease can't apply to a multi-step timeline.)
	if (config.timeline) {
		const tl = config.timeline(el)
		const speed = duration > 0 ? config.duration / 1000 / duration : 1
		if (speed !== 1) tl.timeScale(speed)
		if (delay > 0) {
			tl.delay(delay)
			tl.restart(true)
		}
		return
	}

	// One-shot tweens: gate on viewport entry so an entrance never finishes
	// (or plays) before the user has scrolled it into view.
	const scrollTrigger = getScrollTrigger(el)

	if (config.from) {
		gsap.from(el, {
			...withPerspective(config.from),
			duration,
			delay,
			ease,
			scrollTrigger,
			...(hasRepeat
				? { repeat: config.repeat, yoyo: config.yoyo }
				: { clearProps: clearPropsFor(config.from) }),
		})
	} else if (config.to) {
		gsap.to(el, {
			...withPerspective(config.to),
			duration,
			delay,
			ease,
			scrollTrigger,
			...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
		})
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
