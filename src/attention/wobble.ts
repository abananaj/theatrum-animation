import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makeWobble(
	name: string,
	axis: "x" | "y",
	rotDir: 1 | -1
): AnimationConfig {
	return {
		name, duration: 900, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const prop = axis === "x" ? "x" : "y"
			tl.to(el, { [prop]: -30, rotation: rotDir * -6, duration: 0.135, ease: "power1.out" })
			  .to(el, { [prop]:  15, rotation: rotDir *  6, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { [prop]: -15, rotation: rotDir * -3.6, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { [prop]:   9, rotation: rotDir *  2.4, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { [prop]:  -6, rotation: rotDir * -1.2, duration: 0.135, ease: "power1.inOut" })
			  .to(el, { [prop]:   0, rotation: 0,             duration: 0.225, ease: "power1.in" })
			return tl
		},
	}
}

const wobble: Record<string, AnimationConfig> = {
	"wobble-hor-bottom": makeWobble("wobble-hor-bottom", "x", -1),
	"wobble-hor-top":    makeWobble("wobble-hor-top",    "x",  1),
	"wobble-ver-left":   makeWobble("wobble-ver-left",   "y", -1),
	"wobble-ver-right":  makeWobble("wobble-ver-right",  "y",  1),
}

export default wobble
