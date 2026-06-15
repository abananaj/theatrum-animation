import type { AnimationConfig } from "../../config/animationConfigs"

const slideIn: Record<string, AnimationConfig> = {
	"slide-in-top": {
		name: "slide-in-top",
		duration: 800,
		ease: "power2.out",
		from: { y: -100, opacity: 0 },
	},
	"slide-in-right": {
		name: "slide-in-right",
		duration: 800,
		ease: "power2.out",
		from: { x: 100, opacity: 0 },
	},
	"slide-in-bottom": {
		name: "slide-in-bottom",
		duration: 800,
		ease: "power2.out",
		from: { y: 100, opacity: 0 },
	},
	"slide-in-left": {
		name: "slide-in-left",
		duration: 800,
		ease: "power2.out",
		from: { x: -100, opacity: 0 },
	},
	"slide-in-bl": {
		name: "slide-in-bl",
		duration: 800,
		ease: "power2.out",
		from: { x: -100, y: 100, opacity: 0 },
	},
	"slide-in-br": {
		name: "slide-in-br",
		duration: 800,
		ease: "power2.out",
		from: { x: 100, y: 100, opacity: 0 },
	},
	"slide-in-tl": {
		name: "slide-in-tl",
		duration: 800,
		ease: "power2.out",
		from: { x: -100, y: -100, opacity: 0 },
	},
	"slide-in-tr": {
		name: "slide-in-tr",
		duration: 800,
		ease: "power2.out",
		from: { x: 100, y: -100, opacity: 0 },
	},
}

export default slideIn
