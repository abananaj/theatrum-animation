import gsap from "gsap"
import { type AnimationConfig, flattenConfigs } from "./config/registry"
import { clearPropsFor } from "./config/animationConfigs"
import { getScrollTrigger } from "./config/scrollTrigger"

export type { AnimationConfig }

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = flattenConfigs()

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

/** Read per-element overrides written by the block inspector (data-animation-*). */
function applyOverrides(el: Element, config: AnimationConfig): { duration: number; ease: string; delay: number } {
	let duration = config.duration
	let ease = config.ease
	let delay = 0

	const customDuration = el.getAttribute("data-animation-duration")
	if (customDuration) duration = parseInt(customDuration, 10)

	const customDelay = el.getAttribute("data-animation-delay")
	if (customDelay) delay = parseInt(customDelay, 10)

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

	// Looping / multi-step animations manage their own timeline; play them as-is.
	if (config.timeline) {
		config.timeline(el, duration)
		return
	}

	// One-shot tweens: gate on viewport entry so an entrance never finishes
	// (or plays) before the user has scrolled it into view.
	const scrollTrigger = getScrollTrigger(el)

	if (config.from) {
		gsap.from(el, {
			...config.from,
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
			...config.to,
			duration,
			delay,
			ease,
			scrollTrigger,
			...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
		})
	}
}

export function initializeAnimations(): void {
	document.querySelectorAll(selector).forEach(animateElement)

	const animationKeys = Object.keys(ANIMATION_CONFIGS)

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target instanceof Element) {
				const oldClasses = new Set((mutation.oldValue ?? "").split(" "))
				const newlyAdded = animationKeys.find(
					k => mutation.target instanceof Element && mutation.target.classList.contains(k) && !oldClasses.has(k)
				)
				if (newlyAdded) animateElement(mutation.target as Element)
				continue
			}
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue
				if (animationKeys.some(k => node.classList.contains(k))) {
					animateElement(node)
				}
				node.querySelectorAll(selector).forEach(animateElement)
			}
		}
	}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true })
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeAnimations)
} else {
	initializeAnimations()
}
