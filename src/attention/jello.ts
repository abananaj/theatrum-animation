import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const jello: Record<string, AnimationConfig> = {
	"jello-horizontal": {
		name: "jello-horizontal", duration: 900, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.to(el, { scaleX: 1.25, scaleY: 0.75, duration: 0.27, ease: "power1.inOut" })
			  .to(el, { scaleX: 0.75, scaleY: 1.25, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 1.15, scaleY: 0.85, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 0.95, scaleY: 1.05, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { scaleX: 1.05, scaleY: 0.95, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 1,    scaleY: 1,    duration: 0.225, ease: "power1.inOut" })
			return tl
		},
	},
	"jello-vertical": {
		name: "jello-vertical", duration: 900, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.to(el, { scaleX: 0.75, scaleY: 1.25, duration: 0.27, ease: "power1.inOut" })
			  .to(el, { scaleX: 1.25, scaleY: 0.75, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 0.85, scaleY: 1.15, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 1.05, scaleY: 0.95, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { scaleX: 0.95, scaleY: 1.05, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { scaleX: 1,    scaleY: 1,    duration: 0.225, ease: "power1.inOut" })
			return tl
		},
	},
	"jello-diagonal-1": {
		name: "jello-diagonal-1", duration: 900, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.to(el, { skewX:  25, skewY:  25, duration: 0.27, ease: "power1.inOut" })
			  .to(el, { skewX: -15, skewY: -15, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX:  15, skewY:  15, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX:  -5, skewY:  -5, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { skewX:   5, skewY:   5, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX:   0, skewY:   0, duration: 0.225, ease: "power1.inOut" })
			return tl
		},
	},
	"jello-diagonal-2": {
		name: "jello-diagonal-2", duration: 900, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.to(el, { skewX: -25, skewY: -25, duration: 0.27, ease: "power1.inOut" })
			  .to(el, { skewX:  15, skewY:  15, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX: -15, skewY: -15, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX:   5, skewY:   5, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { skewX:  -5, skewY:  -5, duration: 0.09, ease: "power1.inOut" })
			  .to(el, { skewX:   0, skewY:   0, duration: 0.225, ease: "power1.inOut" })
			return tl
		},
	},
}

export default jello
