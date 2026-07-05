import gsap from "gsap"
import type { AnimationConfig } from "../../config/animationConfigs"

function makeFlipScale(
	name: string,
	midScale: number,
	axis: "rotateX" | "rotateY",
	midAngle: number,
	endAngle: number
): AnimationConfig {
	return {
		name,
		duration: 500,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline()
			tl.to(el, { scale: midScale, [axis]: midAngle, duration: 0.25, ease: "power1.in" })
			  .to(el, { scale: 1,        [axis]: endAngle, duration: 0.25, ease: "power1.out", clearProps: "all" })
			return tl
		},
	}
}

function makeFlipScaleDiag(name: string, midScale: number, midX: number, midY: number): AnimationConfig {
	return {
		name,
		duration: 500,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline()
			tl.to(el, { scale: midScale, rotateX: midX, rotateY: midY, duration: 0.25, ease: "power1.in" })
			  .to(el, { scale: 1, rotateX: midX * 2, rotateY: midY * 2, duration: 0.25, ease: "power1.out", clearProps: "all" })
			return tl
		},
	}
}

function makeFlipScale2(
	name: string,
	axis: "rotateX" | "rotateY",
	translateAxis: "xPercent" | "yPercent",
	midTranslate: number,
	endTranslate: number,
	midAngle: number,
	endAngle: number,
	originStart: string,
	originMid: string,
	originEnd: string
): AnimationConfig {
	return {
		name,
		duration: 600,
		ease: "none",
		timeline: (el) => {
			gsap.set(el, { transformOrigin: originStart })
			const tl = gsap.timeline()
			tl.to(el, {
				scale: 2, [axis]: midAngle, [translateAxis]: midTranslate,
				transformOrigin: originMid, duration: 0.3, ease: "power1.in",
			})
			  .to(el, {
				scale: 1, [axis]: endAngle, [translateAxis]: endTranslate,
				transformOrigin: originEnd, duration: 0.3, ease: "power1.out",
			})
			return tl
		},
	}
}

const flipScale: Record<string, AnimationConfig> = {
	"flip-scale-up-hor":     makeFlipScale("flip-scale-up-hor",     2.5, "rotateX",  -90, -180),
	"flip-scale-down-hor":   makeFlipScale("flip-scale-down-hor",   0.4, "rotateX",   90,  180),
	"flip-scale-up-ver":     makeFlipScale("flip-scale-up-ver",     2.5, "rotateY",   90,  180),
	"flip-scale-down-ver":   makeFlipScale("flip-scale-down-ver",   0.4, "rotateY",  -90, -180),
	"flip-scale-up-diag-1":  makeFlipScaleDiag("flip-scale-up-diag-1",  2.5,  90,  90),
	"flip-scale-down-diag-1":makeFlipScaleDiag("flip-scale-down-diag-1",0.4, -90, -90),
	"flip-scale-up-diag-2":  makeFlipScaleDiag("flip-scale-up-diag-2",  2.5,  90, -90),
	"flip-scale-down-diag-2":makeFlipScaleDiag("flip-scale-down-diag-2",0.4, -90,  90),
	"flip-scale-2-hor-top":    makeFlipScale2("flip-scale-2-hor-top",    "rotateX", "yPercent",  -50, -100,  -90, -180, "50% 0",    "50% 50%", "50% 100%"),
	"flip-scale-2-hor-bottom": makeFlipScale2("flip-scale-2-hor-bottom", "rotateX", "yPercent",   50,  100,   90,  180, "50% 100%", "50% 50%", "50% 0"),
	"flip-scale-2-ver-right":  makeFlipScale2("flip-scale-2-ver-right",  "rotateY", "xPercent",   50,  100,  -90, -180, "100% 50%", "50% 50%", "0 50%"),
	"flip-scale-2-ver-left":   makeFlipScale2("flip-scale-2-ver-left",   "rotateY", "xPercent",  -50, -100,   90,  180, "0 50%",    "50% 50%", "100% 50%"),
}

export default flipScale
