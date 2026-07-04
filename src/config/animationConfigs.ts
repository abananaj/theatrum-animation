import type gsap from "gsap"

// GSAP shorthands that all resolve to the `transform` CSS property.
const TRANSFORM_KEYS = new Set([
	"x", "y", "z", "xPercent", "yPercent",
	"scale", "scaleX", "scaleY",
	"rotation", "rotationX", "rotationY", "rotationZ", "rotate",
	"skewX", "skewY", "perspective",
])

/**
 * Build a `clearProps` list limited to the properties a tween actually animated.
 * Using GSAP's `clearProps: "all"` also strips inline styles WordPress applies
 * for block supports (padding, border, etc.), so we clear only what we set.
 */
export function clearPropsFor(vars: gsap.TweenVars): string {
	const props = new Set<string>()
	for (const key of Object.keys(vars)) {
		props.add(TRANSFORM_KEYS.has(key) ? "transform" : key)
	}
	return [...props].join(",")
}

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
