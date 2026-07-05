import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const zero = "0 0 #555, 0 0 #555, 0 0 #555, 0 0 #555, 0 0 #555, 0 0 #555, 0 0 #555, 0 0 #555"

function makePop(
	name: string,
	shadow: string,
	x: number,
	y: number
): AnimationConfig {
	return {
		name, duration: 500, ease: "power1.out",
		timeline: (el) => {
			const tl = gsap.timeline()
			tl.fromTo(el,
				{ textShadow: zero, x: 0, y: 0 },
				{ textShadow: shadow, x, y, duration: 0.5, ease: "power1.out", clearProps: "all" }
			)
			return tl
		},
	}
}

const textShadowPop: Record<string, AnimationConfig> = {
	"text-shadow-pop-top":    makePop("text-shadow-pop-top",    "0 -1px #555, 0 -2px #555, 0 -3px #555, 0 -4px #555, 0 -5px #555, 0 -6px #555, 0 -7px #555, 0 -8px #555",  0,   8),
	"text-shadow-pop-right":  makePop("text-shadow-pop-right",  "1px 0 #555, 2px 0 #555, 3px 0 #555, 4px 0 #555, 5px 0 #555, 6px 0 #555, 7px 0 #555, 8px 0 #555",         -8,  0),
	"text-shadow-pop-bottom": makePop("text-shadow-pop-bottom", "0 1px #555, 0 2px #555, 0 3px #555, 0 4px #555, 0 5px #555, 0 6px #555, 0 7px #555, 0 8px #555",          0,  -8),
	"text-shadow-pop-left":   makePop("text-shadow-pop-left",   "-1px 0 #555, -2px 0 #555, -3px 0 #555, -4px 0 #555, -5px 0 #555, -6px 0 #555, -7px 0 #555, -8px 0 #555",  8,  0),
	"text-shadow-pop-tl":     makePop("text-shadow-pop-tl",     "-1px -1px #555, -2px -2px #555, -3px -3px #555, -4px -4px #555, -5px -5px #555, -6px -6px #555, -7px -7px #555, -8px -8px #555", 8, 8),
	"text-shadow-pop-tr":     makePop("text-shadow-pop-tr",     "1px -1px #555, 2px -2px #555, 3px -3px #555, 4px -4px #555, 5px -5px #555, 6px -6px #555, 7px -7px #555, 8px -8px #555",        -8, 8),
	"text-shadow-pop-bl":     makePop("text-shadow-pop-bl",     "-1px 1px #555, -2px 2px #555, -3px 3px #555, -4px 4px #555, -5px 5px #555, -6px 6px #555, -7px 7px #555, -8px 8px #555",         8,-8),
	"text-shadow-pop-br":     makePop("text-shadow-pop-br",     "1px 1px #555, 2px 2px #555, 3px 3px #555, 4px 4px #555, 5px 5px #555, 6px 6px #555, 7px 7px #555, 8px 8px #555",               -8,-8),
}

export default textShadowPop
