import gsap from "gsap"
import { type AnimationConfig } from "./config/animationConfigs"
import slideIn from "./entrance/slide-in/slide-in"

export type { AnimationConfig }

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
	...slideIn,
}

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

function animateElement(el: Element): void {
	const animationType = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))
	if (!animationType) return
	const config = ANIMATION_CONFIGS[animationType]

	gsap.from(el, {
		...config.from,
		duration: config.duration / 1000,
		ease: config.ease,
		clearProps: "all",
	})
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

// Initialize animations when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeAnimations)
} else {
	initializeAnimations()
}
