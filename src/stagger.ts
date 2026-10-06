import gsap from 'gsap';
import { onScrollIntoView } from './config/scrollTrigger';
import { BRAND_STAGGER } from './config/brand';
import {
	ANIMATION_CONFIGS,
	processed,
	applyOverrides,
	resolveAnimation,
	resolveTrigger,
	resolveTriggerPoint,
	triggeredOnArrival,
	buildPaused,
} from './engine';

type StaggerFrom = 'start' | 'end' | 'center' | 'edges' | 'random';
const STAGGER_FROM_VALUES: readonly StaggerFrom[] = [
	'start',
	'end',
	'center',
	'edges',
	'random',
];

function parseStaggerFrom(val: string | null): StaggerFrom {
	return (STAGGER_FROM_VALUES as readonly string[]).includes(val ?? '')
		? (val as StaggerFrom)
		: 'start';
}

/**
 * Find the animation class an element was given (its first matching registry key).
 * @param el
 */
function animationClassOf(el: Element): string | undefined {
	return Object.keys(ANIMATION_CONFIGS).find((k) => el.classList.contains(k));
}

/** Bind every parent carrying data-stagger-each that hasn't been processed yet. */
export function bindStaggerGroups(): void {
	document.querySelectorAll('[data-stagger-each]').forEach(bindStaggerGroup);
}

function bindStaggerGroup(parent: Element): void {
	if (processed.has(parent)) {
		return;
	}
	const each = parseInt(parent.getAttribute('data-stagger-each') ?? '', 10);
	if (Number.isNaN(each)) {
		return;
	}
	const fromMode = parseStaggerFrom(parent.getAttribute('data-stagger-from'));

	const point = resolveTriggerPoint(parent);
	const arrived = triggeredOnArrival(parent, point);

	// Hover/attention children aren't real entrances — excluded so they keep animating independently on their own trigger.
	// Static brand children (heroes, or already in view on arrival) drop out too; animateElement() leaves them in place.
	const eligible = Array.from(parent.querySelectorAll(':scope > *'))
		.map((el) => {
			const cls = animationClassOf(el);
			const resolved = cls ? resolveAnimation(el, cls) : null;
			return { el, cls: cls!, resolved: resolved! };
		})
		.filter(
			({ el, cls, resolved }) =>
				resolved &&
				resolveTrigger(el, cls) !== 'hover' &&
				!(resolved.brand && arrived)
		);

	processed.add(parent);
	if (eligible.length < 2) {
		return;
	} // nothing to stagger

	const allBrand = eligible.every(({ resolved }) => resolved.brand);
	const distribute = gsap.utils.distribute({
		each: (allBrand ? BRAND_STAGGER : each) / 1000,
		from: fromMode,
	});
	const els = eligible.map(({ el }) => el);
	const built = eligible.map(({ el, resolved }, i) => {
		const timing = applyOverrides(el, resolved.config, resolved.brand);
		timing.delay += distribute(i, el, els);
		processed.add(el);
		return buildPaused(el, resolved.config, timing);
	});

	const play = () => built.forEach((anim) => anim.play());

	// If every member is Load-triggered, play immediately; otherwise gate the whole group on the parent scrolling into view, using the parent's trigger-point override as the shared boundary.
	const allLoad = eligible.every(
		({ el, cls }) => resolveTrigger(el, cls) === 'load'
	);
	if (allLoad) {
		play();
	} else {
		onScrollIntoView(parent, play, point);
	}
}
