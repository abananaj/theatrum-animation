import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const vibrate: Record<string, AnimationConfig> = {
	"vibrate-1": {
		name: "vibrate-1", duration: 300, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.06
			tl.to(el, { x: -2, y:  2, duration: d })
			  .to(el, { x: -2, y: -2, duration: d })
			  .to(el, { x:  2, y:  2, duration: d })
			  .to(el, { x:  2, y: -2, duration: d })
			  .to(el, { x:  0, y:  0, duration: d })
			return tl
		},
	},
	"vibrate-2": {
		name: "vibrate-2", duration: 300, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.06
			tl.to(el, { x:  2, y: -2, duration: d })
			  .to(el, { x:  2, y:  2, duration: d })
			  .to(el, { x: -2, y:  2, duration: d })
			  .to(el, { x: -2, y: -2, duration: d })
			  .to(el, { x:  0, y:  0, duration: d })
			return tl
		},
	},
	"vibrate-3": {
		name: "vibrate-3", duration: 500, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.05
			tl.to(el, { x: -2, y: -2, duration: d })
			  .to(el, { x:  2, y: -2, duration: d })
			  .to(el, { x: -2, y:  2, duration: d })
			  .to(el, { x:  2, y:  2, duration: d })
			  .to(el, { x: -2, y: -2, duration: d })
			  .to(el, { x:  2, y: -2, duration: d })
			  .to(el, { x: -2, y:  2, duration: d })
			  .to(el, { x: -2, y: -2, duration: d })
			  .to(el, { x:  2, y: -2, duration: d })
			  .to(el, { x:  0, y:  0, duration: d })
			return tl
		},
	},
}

export default vibrate
