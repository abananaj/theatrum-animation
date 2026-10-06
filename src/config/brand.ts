import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import type { AnimationConfig } from './animationConfigs';

gsap.registerPlugin(CustomEase);

/** Brand motions every aliased class plays as; `static` means no animation at all. */
export type BrandRole = 'enter' | 'rule' | 'static';

// Effects aliased to brand motions (runtime only — saved content keeps its old classes until the content migration).
const ALIASED_EFFECTS = new Set([
	'slide-in',
	'slide-fade-in',
	'slide-in-fwd',
	'slide-in-bck',
	'slide-in-blurred',
	'slide-in-elliptic',
	'fade-in',
	'scale-in',
	'tracking-in',
]);

// Photo/media blocks — exempt from aliasing.
const MEDIA =
	'.wp-block-image, .wp-block-post-featured-image, .wp-block-theatrum-meta-image, .wp-block-video, .wp-block-embed, img, video';

// Page headers stay put whatever their children carry; a cover itself never transforms (it breaks parallax), though its children may animate.
const STATIC_SCOPE = '.ct-page-header';
const STATIC_SELF = '.wp-block-cover';

/** House stagger interval (ms) for groups whose children are all brand motions. */
export const BRAND_STAGGER = 70;

/**
 * Brand role for an element's animation class, or null when its effect isn't aliased (it plays its own config).
 * @param el
 * @param cls
 * @param effectId
 */
export function brandRole(
	el: Element,
	cls: string,
	effectId: string
): BrandRole | null {
	// Photo effects are hand-picked per image — they play their own config, never an alias.
	if (!ALIASED_EFFECTS.has(effectId) || el.matches(MEDIA)) {
		return null;
	}
	if (
		cls.startsWith('scale-in-ver') ||
		el.matches(STATIC_SELF) ||
		el.closest(STATIC_SCOPE)
	) {
		return 'static';
	}
	if (cls.startsWith('scale-in-hor')) {
		return 'rule';
	}
	return 'enter';
}

/**
 * Reads a theme.json motion token (`--wp--custom--motion--*`); empty when the theme isn't active.
 * @param name
 */
function token(name: string): string {
	return getComputedStyle(document.body)
		.getPropertyValue(`--wp--custom--motion--${name}`)
		.trim();
}

/**
 * "600ms" / "0.6s" → 600; fallback when the token is missing or unparseable.
 * @param value
 * @param fallback
 */
function toMs(value: string, fallback: number): number {
	const n = parseFloat(value);
	if (Number.isNaN(n)) {
		return fallback;
	}
	return value.endsWith('ms') ? n : n * 1000;
}

/** theme.json's power-3 curve as a GSAP ease, so tweens and CSS transitions share one curve; power3.out without the theme. */
function brandEase(): string {
	const bezier = token('ease--power-3').match(/cubic-bezier\(([^)]+)\)/);
	if (!bezier) {
		return 'power3.out';
	}
	const [x1, y1, x2, y2] = bezier[1].split(',').map((n) => n.trim());
	CustomEase.create('ct-brand', `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
	return 'ct-brand';
}

let configs: Record<Exclude<BrandRole, 'static'>, AnimationConfig> | null =
	null;

/** Brand motion configs, built once from the theme's motion tokens (slow-4 travel, slow-3 rule wipe). */
export function brandConfigs(): Record<
	Exclude<BrandRole, 'static'>,
	AnimationConfig
> {
	if (configs) {
		return configs;
	}
	const ease = brandEase();
	const duration = toMs(token('duration--slow-4'), 600);
	const ruleDuration = toMs(token('duration--slow-3'), 500);
	configs = {
		enter: { name: 'ct-enter', duration, ease, from: { x: -32, autoAlpha: 0 } },
		// Wipes in left→right with clip-path, so text isn't squashed the way scaleX would.
		rule: {
			name: 'ct-rule',
			duration: ruleDuration,
			ease,
			timeline: (el) =>
				gsap.timeline().fromTo(
					el,
					{ clipPath: 'inset(0% 100% 0% 0%)' },
					{
						clipPath: 'inset(0% 0% 0% 0%)',
						duration: ruleDuration / 1000,
						ease,
						clearProps: 'clipPath',
					}
				),
		},
	};
	return configs;
}
