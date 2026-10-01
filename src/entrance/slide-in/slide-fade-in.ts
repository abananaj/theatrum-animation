import type { AnimationConfig } from '../../config/animationConfigs';

// Slide In's travel paired with a fade; slide-in alone has no opacity change.
const defaults = { duration: 800, ease: 'power2.out' };

const slideFadeIn: Record<string, AnimationConfig> = {
	'slide-fade-in-top': {
		...defaults,
		name: 'slide-fade-in-top',
		from: { y: -100, opacity: 0 },
	},
	'slide-fade-in-right': {
		...defaults,
		name: 'slide-fade-in-right',
		from: { x: 100, opacity: 0 },
	},
	'slide-fade-in-bottom': {
		...defaults,
		name: 'slide-fade-in-bottom',
		from: { y: 100, opacity: 0 },
	},
	'slide-fade-in-left': {
		...defaults,
		name: 'slide-fade-in-left',
		from: { x: -100, opacity: 0 },
	},
	'slide-fade-in-bl': {
		...defaults,
		name: 'slide-fade-in-bl',
		from: { x: -100, y: 100, opacity: 0 },
	},
	'slide-fade-in-br': {
		...defaults,
		name: 'slide-fade-in-br',
		from: { x: 100, y: 100, opacity: 0 },
	},
	'slide-fade-in-tl': {
		...defaults,
		name: 'slide-fade-in-tl',
		from: { x: -100, y: -100, opacity: 0 },
	},
	'slide-fade-in-tr': {
		...defaults,
		name: 'slide-fade-in-tr',
		from: { x: 100, y: -100, opacity: 0 },
	},
};

export default slideFadeIn;
