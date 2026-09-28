import type { AnimationConfig } from '../config/animationConfigs';

// Subtle scale-up paired with a fade; scale-in alone starts from 0 with no opacity change.
const defaults = { duration: 600, ease: 'power2.out' };

const scaleFadeIn: Record<string, AnimationConfig> = {
	'scale-fade-in-center': {
		...defaults,
		name: 'scale-fade-in-center',
		from: { scale: 0.85, opacity: 0 },
	},
	'scale-fade-in-top': {
		...defaults,
		name: 'scale-fade-in-top',
		from: { scale: 0.85, opacity: 0, transformOrigin: '50% 0' },
	},
	'scale-fade-in-bottom': {
		...defaults,
		name: 'scale-fade-in-bottom',
		from: { scale: 0.85, opacity: 0, transformOrigin: '50% 100%' },
	},
	'scale-fade-in-left': {
		...defaults,
		name: 'scale-fade-in-left',
		from: { scale: 0.85, opacity: 0, transformOrigin: '0 50%' },
	},
	'scale-fade-in-right': {
		...defaults,
		name: 'scale-fade-in-right',
		from: { scale: 0.85, opacity: 0, transformOrigin: '100% 50%' },
	},
};

export default scaleFadeIn;
