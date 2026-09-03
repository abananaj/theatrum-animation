import type gsap from 'gsap';

// GSAP shorthands that all resolve to the `transform` CSS property.
const TRANSFORM_KEYS = new Set([
	'x',
	'y',
	'z',
	'xPercent',
	'yPercent',
	'scale',
	'scaleX',
	'scaleY',
	'rotation',
	'rotationX',
	'rotationY',
	'rotationZ',
	'rotate',
	'skewX',
	'skewY',
	'perspective',
	'transformPerspective',
]);

/**
 * Builds a `clearProps` list limited to properties the tween actually animated (GSAP's `clearProps: "all"` would also strip WP block-support inline styles like padding/border).
 * `.has-parallax` cover blocks need the inline transform left in place — removing it snaps `background-attachment: fixed` relative to the viewport right when the entrance animation ends, so we skip clearing transform there.
 * @param vars
 * @param el
 */
export function clearPropsFor(vars: gsap.TweenVars, el?: Element): string {
	const props = new Set<string>();
	for (const key of Object.keys(vars)) {
		props.add(TRANSFORM_KEYS.has(key) ? 'transform' : key);
	}
	if (el?.classList.contains('has-parallax')) {
		props.delete('transform');
	}
	return [...props].join(',');
}

/**
 * z-translation is a no-op without perspective on the element; inject `transformPerspective` for tweens animating `z` so the fwd/bck variants actually move in depth.
 * @param vars
 */
export function withPerspective(vars: gsap.TweenVars): gsap.TweenVars {
	return 'z' in vars && !('transformPerspective' in vars)
		? { transformPerspective: 800, ...vars }
		: vars;
}

export interface AnimationConfig {
	name: string;
	duration: number;
	ease: string;
	from?: gsap.TweenVars;
	to?: gsap.TweenVars;
	repeat?: number;
	yoyo?: boolean;
	/** Looping/multi-step animations build their own timeline at native pace; duration/delay overrides apply via timeScale()/delay() (ease can't be overridden per-step, so the inspector hides ease controls for timeline animations). */
	timeline?: (el: Element) => gsap.core.Timeline;
}
