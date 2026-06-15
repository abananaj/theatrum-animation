import gsap from "gsap"
import type { AnimationConfig } from "../../config/animationConfigs"

function makeFlipArc(
	name: string,
	axis: "rotateX" | "rotateY",
	translateAxis: "xPercent" | "yPercent",
	translateEnd: number,
	rotateEnd: number,
	originStart: string,
	originEnd: string,
	z?: number
): AnimationConfig {
	return {
		name,
		duration: 500,
		ease: "power1.inOut",
		timeline: (el) => {
			const tl = gsap.timeline()
			const fromVars: gsap.TweenVars = {
				[translateAxis]: 0, [axis]: 0, transformOrigin: originStart,
			}
			const toVars: gsap.TweenVars = {
				[translateAxis]: translateEnd, [axis]: rotateEnd, transformOrigin: originEnd,
				duration: 0.5, ease: "power1.inOut",
			}
			if (z !== undefined) {
				fromVars.z = 0
				toVars.z = z
			}
			tl.fromTo(el, fromVars, toVars)
			return tl
		},
	}
}

const flipArc: Record<string, AnimationConfig> = {
	"flip-2-hor-top-1":    makeFlipArc("flip-2-hor-top-1",    "rotateX", "yPercent", -100, -180, "50% 0",    "50% 100%"),
	"flip-2-hor-top-2":    makeFlipArc("flip-2-hor-top-2",    "rotateX", "yPercent", -100,  180, "50% 0",    "50% 100%"),
	"flip-2-hor-top-fwd":  makeFlipArc("flip-2-hor-top-fwd",  "rotateX", "yPercent", -100, -180, "50% 0",    "50% 100%",  160),
	"flip-2-hor-top-bck":  makeFlipArc("flip-2-hor-top-bck",  "rotateX", "yPercent", -100,  180, "50% 0",    "50% 100%", -260),
	"flip-2-hor-bottom-1": makeFlipArc("flip-2-hor-bottom-1", "rotateX", "yPercent",  100,  180, "50% 100%", "50% 0"),
	"flip-2-hor-bottom-2": makeFlipArc("flip-2-hor-bottom-2", "rotateX", "yPercent",  100, -180, "50% 100%", "50% 0"),
	"flip-2-hor-bottom-fwd":makeFlipArc("flip-2-hor-bottom-fwd","rotateX","yPercent", 100,  180, "50% 100%", "50% 0",     160),
	"flip-2-hor-bottom-bck":makeFlipArc("flip-2-hor-bottom-bck","rotateX","yPercent", 100, -180, "50% 100%", "50% 0",    -260),
	"flip-2-ver-right-1":  makeFlipArc("flip-2-ver-right-1",  "rotateY", "xPercent",  100, -180, "100% 50%", "0 50%"),
	"flip-2-ver-right-2":  makeFlipArc("flip-2-ver-right-2",  "rotateY", "xPercent",  100,  180, "100% 50%", "0 50%"),
	"flip-2-ver-right-fwd":makeFlipArc("flip-2-ver-right-fwd","rotateY", "xPercent",  100, -180, "100% 50%", "0 50%",     160),
	"flip-2-ver-right-bck":makeFlipArc("flip-2-ver-right-bck","rotateY", "xPercent",  100,  180, "100% 50%", "0 50%",    -260),
	"flip-2-ver-left-1":   makeFlipArc("flip-2-ver-left-1",   "rotateY", "xPercent", -100,  180, "0 50%",    "100% 0"),
	"flip-2-ver-left-2":   makeFlipArc("flip-2-ver-left-2",   "rotateY", "xPercent", -100, -180, "0 50%",    "100% 0"),
	"flip-2-ver-left-fwd": makeFlipArc("flip-2-ver-left-fwd", "rotateY", "xPercent", -100,  180, "0 50%",    "100% 0",    160),
	"flip-2-ver-left-bck": makeFlipArc("flip-2-ver-left-bck", "rotateY", "xPercent", -100, -180, "0 50%",    "100% 0",   -260),
}

export default flipArc
