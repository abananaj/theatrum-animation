import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const heartbeat: Record<string, AnimationConfig> = {
	"heartbeat": {
		name: "heartbeat",
		duration: 1300,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.to(el, { scale: 0.91, duration: 0.13, ease: "power1.out" })
			  .to(el, { scale: 0.98, duration: 0.091, ease: "power1.in" })
			  .to(el, { scale: 0.87, duration: 0.208, ease: "power1.in" })
			  .to(el, { scale: 1.0,  duration: 0.156, ease: "power1.out" })
			  .to(el, { scale: 1.0,  duration: 0.715 })
			return tl
		},
	},
}

export default heartbeat
