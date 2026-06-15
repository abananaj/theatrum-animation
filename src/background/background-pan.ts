import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makePan(name: string, fromPos: string, toPos: string): AnimationConfig {
	return {
		name, duration: 12000, ease: "linear",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.fromTo(el,
				{ backgroundPosition: fromPos },
				{ backgroundPosition: toPos, duration: 12, ease: "linear" }
			)
			return tl
		},
	}
}

const backgroundPan: Record<string, AnimationConfig> = {
	"bg-pan-left":   makePan("bg-pan-left",   "100% 50%", "0% 50%"),
	"bg-pan-right":  makePan("bg-pan-right",  "0% 50%",   "100% 50%"),
	"bg-pan-top":    makePan("bg-pan-top",    "50% 100%", "50% 0%"),
	"bg-pan-bottom": makePan("bg-pan-bottom", "50% 0%",   "50% 100%"),
	"bg-pan-tl":     makePan("bg-pan-tl",     "100% 100%","0% 0%"),
	"bg-pan-tr":     makePan("bg-pan-tr",     "0% 100%",  "100% 0%"),
	"bg-pan-bl":     makePan("bg-pan-bl",     "100% 0%",  "0% 100%"),
	"bg-pan-br":     makePan("bg-pan-br",     "0% 0%",    "100% 100%"),
}

export default backgroundPan
