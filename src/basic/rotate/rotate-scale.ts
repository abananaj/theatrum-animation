import gsap from "gsap"
import type { AnimationConfig } from "../../config/animationConfigs"

function makeRotateScale(
	name: string,
	midScale: number,
	axis: "rotation" | "rotateX" | "rotateY",
	midAngle: number,
	endAngle: number
): AnimationConfig {
	return {
		name,
		duration: 800,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline()
			const half = 0.4
			tl.to(el, { scale: midScale, [axis]: midAngle, duration: half, ease: "power1.in" })
			  .to(el, { scale: 1, [axis]: endAngle, duration: half, ease: "power1.out", clearProps: "all" })
			return tl
		},
	}
}

function makeRotateScaleDiag(name: string, midScale: number, midX: number, midY: number): AnimationConfig {
	return {
		name,
		duration: 800,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline()
			const half = 0.4
			tl.to(el, { scale: midScale, rotateX: midX, rotateY: midY, duration: half, ease: "power1.in" })
			  .to(el, { scale: 1, rotateX: midX * 2, rotateY: midY * 2, duration: half, ease: "power1.out", clearProps: "all" })
			return tl
		},
	}
}

const rotateScale: Record<string, AnimationConfig> = {
	"rotate-scale-up":         makeRotateScale("rotate-scale-up",         2,   "rotation", 180,  360),
	"rotate-scale-down":       makeRotateScale("rotate-scale-down",       0.5, "rotation", 180,  360),
	"rotate-scale-up-ver":     makeRotateScale("rotate-scale-up-ver",     2,   "rotateY",  180,  360),
	"rotate-scale-down-ver":   makeRotateScale("rotate-scale-down-ver",   0.5, "rotateY",  180,  360),
	"rotate-scale-up-hor":     makeRotateScale("rotate-scale-up-hor",     2,   "rotateX", -180, -360),
	"rotate-scale-down-hor":   makeRotateScale("rotate-scale-down-hor",   0.5, "rotateX", -180, -360),
	"rotate-scale-up-diag-1":  makeRotateScaleDiag("rotate-scale-up-diag-1",  2,   -180, -180),
	"rotate-scale-down-diag-1":makeRotateScaleDiag("rotate-scale-down-diag-1",0.5, -180, -180),
	"rotate-scale-up-diag-2":  makeRotateScaleDiag("rotate-scale-up-diag-2",  2,    180, -180),
	"rotate-scale-down-diag-2":makeRotateScaleDiag("rotate-scale-down-diag-2",0.5,  180, -180),
}

export default rotateScale
