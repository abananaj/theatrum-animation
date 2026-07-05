import type gsap from "gsap"

// GSAP shorthands that all resolve to the `transform` CSS property.
const TRANSFORM_KEYS = new Set([
	"x", "y", "z", "xPercent", "yPercent",
	"scale", "scaleX", "scaleY",
	"rotation", "rotationX", "rotationY", "rotationZ", "rotate",
	"skewX", "skewY", "perspective", "transformPerspective",
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

/**
 * z-translation renders as no-op without a perspective on the element.
 * Inject `transformPerspective` into any tween vars that animate `z` so the
 * many fwd/bck variants actually move in depth.
 */
export function withPerspective(vars: gsap.TweenVars): gsap.TweenVars {
	return "z" in vars && !("transformPerspective" in vars)
		? { transformPerspective: 800, ...vars }
		: vars
}

export interface AnimationConfig {
	name: string
	duration: number
	ease: string
	from?: gsap.TweenVars
	to?: gsap.TweenVars
	repeat?: number
	yoyo?: boolean
	/**
	 * Looping / multi-step animations build their own timeline at the config's
	 * native pace. Duration/delay overrides are applied by the caller via
	 * timeScale()/delay(); a per-step ease can't be overridden, so the inspector
	 * hides the ease controls for timeline animations.
	 */
	timeline?: (el: Element) => gsap.core.Timeline
}
