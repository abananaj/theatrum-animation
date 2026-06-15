import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makeBounceOut(
	name: string,
	axis: "y" | "x" | "z",
	smallDir: number,
	bigDir: number,
	extraProps?: gsap.TweenVars
): AnimationConfig {
	return {
		name,
		duration: 1400,
		ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline()
			const small = { [axis]: smallDir * 0.4 }
			const mid   = { [axis]: smallDir * 0.5 }
			const large = { [axis]: smallDir }
			const reset = { [axis]: 0 }
			const exit  = { [axis]: bigDir, opacity: 0, ...extraProps }
			tl.to(el, { ...small, duration: 0.07, ease: "power1.out" })
			  .to(el, { ...reset, duration: 0.14, ease: "power1.in" })
			  .to(el, { ...mid,   duration: 0.14, ease: "power1.out" })
			  .to(el, { ...reset, duration: 0.18, ease: "power1.in" })
			  .to(el, { ...large, duration: 0.20, ease: "power1.out" })
			  .to(el, { ...reset, duration: 0.25, ease: "power1.in" })
			  .to(el, { ...exit,  duration: 0.42, ease: "power2.in" })
			return tl
		},
	}
}

const bounceOut: Record<string, AnimationConfig> = {
	"bounce-out-top":    makeBounceOut("bounce-out-top",    "y", -75,  -800),
	"bounce-out-bottom": makeBounceOut("bounce-out-bottom", "y",  75,   800),
	"bounce-out-left":   makeBounceOut("bounce-out-left",   "x", -80, -1000),
	"bounce-out-right":  makeBounceOut("bounce-out-right",  "x",  80,  1000),
	"bounce-out-fwd":    makeBounceOut("bounce-out-fwd",    "z",  150,  500),
	"bounce-out-bck":    makeBounceOut("bounce-out-bck",    "z", -200, -900, { scale: 0 }),
}

export default bounceOut
