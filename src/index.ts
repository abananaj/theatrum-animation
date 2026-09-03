import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type AnimationConfig } from './config/registry';
import { clearPropsFor, withPerspective } from './config/animationConfigs';
import { getScrollTrigger, onScrollIntoView } from './config/scrollTrigger';
import {
	ANIMATION_CONFIGS,
	processed,
	applyOverrides,
	resolveTrigger,
	resolveTriggerPoint,
	buildPaused,
	type Timing,
} from './engine';
import { bindStaggerGroups } from './stagger';
import './scss/utilities.scss';

export type { AnimationConfig };

const selector = Object.keys(ANIMATION_CONFIGS)
	.map((k) => `.${k}`)
	.join(',');

/**
 * Run a one-shot from/to tween. With a scrollTrigger it gates on view; without, it plays now.
 * @param el
 * @param config
 * @param timing
 * @param scrollTrigger
 */
function playOneShot(
	el: Element,
	config: AnimationConfig,
	timing: Timing,
	scrollTrigger?: object
): void {
	const { duration, ease, delay } = timing;
	const hasRepeat = config.repeat !== undefined;
	if (config.from) {
		gsap.from(el, {
			...withPerspective(config.from),
			duration,
			delay,
			ease,
			...(scrollTrigger ? { scrollTrigger } : {}),
			...(hasRepeat
				? { repeat: config.repeat, yoyo: config.yoyo }
				: { clearProps: clearPropsFor(config.from, el) }),
		});
	} else if (config.to) {
		gsap.to(el, {
			...withPerspective(config.to),
			duration,
			delay,
			ease,
			...(scrollTrigger ? { scrollTrigger } : {}),
			...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
		});
	}
}

/**
 * On Scroll: fire once when the element scrolls into view.
 * @param el
 * @param config
 * @param timing
 */
function playOnScroll(
	el: Element,
	config: AnimationConfig,
	timing: Timing
): void {
	const point = resolveTriggerPoint(el);
	if (config.timeline) {
		// Timelines can't take the integrated scrollTrigger var — build paused, play on entry.
		const tl = buildPaused(el, config, timing);
		onScrollIntoView(el, () => tl.play(), point);
		return;
	}
	playOneShot(el, config, timing, getScrollTrigger(el, point));
}

/**
 * On Load: fire immediately on page load, regardless of scroll position.
 * @param el
 * @param config
 * @param timing
 */
function playOnLoad(
	el: Element,
	config: AnimationConfig,
	timing: Timing
): void {
	if (config.timeline) {
		// Honor duration via playback speed, delay by restarting with the delay included.
		const tl = config.timeline(el);
		const speed =
			timing.duration > 0 ? config.duration / 1000 / timing.duration : 1;
		if (speed !== 1) {
			tl.timeScale(speed);
		}
		if (timing.delay > 0) {
			tl.delay(timing.delay);
			tl.restart(true);
		}
		return;
	}
	playOneShot(el, config, timing);
}

/**
 * On Hover: play while hovered, pause on leave. Touch has no hover → tap-to-toggle.
 * @param el
 * @param config
 * @param timing
 */
function playOnHover(
	el: Element,
	config: AnimationConfig,
	timing: Timing
): void {
	const anim = buildPaused(el, config, timing, false);
	// Keyboard parity (WCAG 2.1.1): focus inside the element plays the same animation hover does.
	el.addEventListener('focusin', () => anim.play());
	el.addEventListener('focusout', () => anim.pause());
	if (window.matchMedia('(hover: hover)').matches) {
		el.addEventListener('mouseenter', () => anim.play());
		el.addEventListener('mouseleave', () => anim.pause());
	} else {
		el.addEventListener('click', () => {
			if (anim.paused()) {
				anim.play();
			} else {
				anim.pause();
			}
		});
	}
}

function animateElement(el: Element): void {
	if (processed.has(el)) {
		return;
	}
	const cls = Object.keys(ANIMATION_CONFIGS).find((k) =>
		el.classList.contains(k)
	);
	if (!cls) {
		return;
	}
	processed.add(el);

	const config = ANIMATION_CONFIGS[cls];
	const timing = applyOverrides(el, config);

	switch (resolveTrigger(el, cls)) {
		case 'load':
			return playOnLoad(el, config, timing);
		case 'hover':
			return playOnHover(el, config, timing);
		default:
			return playOnScroll(el, config, timing);
	}
}

export function initializeAnimations(): void {
	// WCAG 2.3.3/2.2.2: honor the OS-level reduced-motion preference. Safe to skip entirely — GSAP's from-tweens apply pre-animation states, so untweened elements just render in their final state.
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (reduced.matches) {
		return;
	}

	// Preference flipped mid-session: stop everything and reset inline styles so elements land in their final state (opting back in takes a reload).
	reduced.addEventListener('change', (e) => {
		if (!e.matches) {
			return;
		}
		ScrollTrigger.getAll().forEach((t) => t.kill());
		gsap.globalTimeline.clear();
		gsap.set(document.querySelectorAll(selector), { clearProps: 'all' });
	});

	bindStaggerGroups();
	document.querySelectorAll(selector).forEach(animateElement);

	const animationKeys = Object.keys(ANIMATION_CONFIGS);

	// Animation classes are server-rendered; only watch for inserted nodes (e.g. lazy-loaded content) — observing class-attribute flips would fire on every unrelated UI toggle.
	new MutationObserver((mutations) => {
		bindStaggerGroups();
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) {
					continue;
				}
				if (animationKeys.some((k) => node.classList.contains(k))) {
					animateElement(node);
				}
				node.querySelectorAll(selector).forEach(animateElement);
			}
		}
	}).observe(document.body, { childList: true, subtree: true });

	// Web fonts/late images can shift layout after DOMContentLoaded (when ScrollTrigger first measured each `once: true` boundary); a stale boundary means a one-shot entrance never fires `onEnter` and sticks at its from-state (e.g. scale: 0) forever.
	// window "load" fires once everything has settled, so refresh here corrects any boundary before the user scrolls that far.
	window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
	initializeAnimations();
}
