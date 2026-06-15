import gsap from "gsap"

export interface AnimationConfig {
	name: string
	duration: number
	ease: string
	from?: gsap.TweenVars
	to?: gsap.TweenVars
	repeat?: number
	yoyo?: boolean
	timeline?: (el: Element, duration: number) => gsap.core.Timeline
}

export function getAnimationData(
	element: Element,
	configs: Record<string, AnimationConfig>
): AnimationConfig | null {
	const animationType = element.getAttribute("data-animation")
	if (!animationType || !configs[animationType]) return null

	const config = { ...configs[animationType] }

	const customDuration = element.getAttribute("data-animation-duration")
	if (customDuration) config.duration = parseInt(customDuration, 10)

	const customEasing = element.getAttribute("data-animation-easing")
	if (customEasing) config.ease = customEasing

	return config
}
