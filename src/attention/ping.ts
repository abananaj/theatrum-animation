import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const ping: Record<string, AnimationConfig> = {
	"ping": {
		name: "ping",
		duration: 1000,
		ease: "power1.out",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.fromTo(el,
				{ scale: 0.2, opacity: 0.8 },
				{ scale: 1.2, opacity: 0, duration: 0.8, ease: "power1.out" }
			).to(el, { scale: 2.2, duration: 0.2, ease: "power1.in" })
			return tl
		},
	},
}

export default ping
