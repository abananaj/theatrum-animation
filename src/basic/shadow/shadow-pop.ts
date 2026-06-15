import gsap from "gsap"
import type { AnimationConfig } from "../../config/animationConfigs"

const zero = "0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e, 0 0 #3e3e3e"

function makePop(name: string, dx: number, dy: number, shadow: string): AnimationConfig {
	return {
		name,
		duration: 300,
		ease: "power1.out",
		timeline: (el) => {
			const tl = gsap.timeline()
			tl.fromTo(el,
				{ boxShadow: zero, x: 0, y: 0 },
				{ boxShadow: shadow, x: dx, y: dy, duration: 0.3, ease: "power1.out", clearProps: "all" }
			)
			return tl
		},
	}
}

const shadowPop: Record<string, AnimationConfig> = {
	"shadow-pop-tr": makePop(
		"shadow-pop-tr", -8, 8,
		"1px -1px #3e3e3e, 2px -2px #3e3e3e, 3px -3px #3e3e3e, 4px -4px #3e3e3e, 5px -5px #3e3e3e, 6px -6px #3e3e3e, 7px -7px #3e3e3e, 8px -8px #3e3e3e"
	),
	"shadow-pop-tl": makePop(
		"shadow-pop-tl", 8, 8,
		"-1px -1px #3e3e3e, -2px -2px #3e3e3e, -3px -3px #3e3e3e, -4px -4px #3e3e3e, -5px -5px #3e3e3e, -6px -6px #3e3e3e, -7px -7px #3e3e3e, -8px -8px #3e3e3e"
	),
	"shadow-pop-bl": makePop(
		"shadow-pop-bl", 8, -8,
		"-1px 1px #3e3e3e, -2px 2px #3e3e3e, -3px 3px #3e3e3e, -4px 4px #3e3e3e, -5px 5px #3e3e3e, -6px 6px #3e3e3e, -7px 7px #3e3e3e, -8px 8px #3e3e3e"
	),
	"shadow-pop-br": makePop(
		"shadow-pop-br", -8, -8,
		"1px 1px #3e3e3e, 2px 2px #3e3e3e, 3px 3px #3e3e3e, 4px 4px #3e3e3e, 5px 5px #3e3e3e, 6px 6px #3e3e3e, 7px 7px #3e3e3e, 8px 8px #3e3e3e"
	),
}

export default shadowPop
