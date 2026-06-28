import type gsap from "gsap"

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
