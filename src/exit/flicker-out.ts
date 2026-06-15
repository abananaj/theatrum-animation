import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const flickerOut: Record<string, AnimationConfig> = {
	"flicker-out-1": {
		name: "flicker-out-1",
		duration: 2000,
		ease: "none",
		timeline: (el) => {
			const dur = 2.0
			const tl = gsap.timeline()
			const steps: [number, number][] = [
				[0, 1],
				[0.14 * dur, 0],  [0.15 * dur, 1],
				[0.23 * dur, 0],  [0.25 * dur, 1],
				[0.35 * dur, 0],  [0.40 * dur, 1],
				[0.43 * dur, 0],  [0.45 * dur, 1],
				[0.55 * dur, 0],  [0.695 * dur, 1],
				[0.70 * dur, 0],  [0.799 * dur, 1],
				[0.80 * dur, 0],  [0.899 * dur, 1],
				[0.90 * dur, 0],  [dur, 0],
			]
			steps.forEach(([t, op]) => tl.set(el, { opacity: op }, t))
			return tl
		},
	},

	"flicker-out-2": {
		name: "flicker-out-2",
		duration: 2000,
		ease: "none",
		timeline: (el) => {
			const dur = 2.0
			const s6 = "0 0 30px rgba(255,255,255,.6), 0 0 60px rgba(255,255,255,.45), 0 0 110px rgba(255,255,255,.25), 0 0 100px rgba(255,255,255,.1)"
			const s5 = "0 0 30px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.4), 0 0 110px rgba(255,255,255,.2), 0 0 100px rgba(255,255,255,.1)"
			const s4 = "0 0 30px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.35), 0 0 100px rgba(255,255,255,.1)"
			const s3 = "0 0 30px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.35)"
			const s2 = "0 0 30px rgba(255,255,255,.45), 0 0 60px rgba(255,255,255,.25)"
			const s1 = "0 0 30px rgba(255,255,255,.25)"
			const tl = gsap.timeline()
			const steps: [number, number, string][] = [
				[0, 1, s6],
				[0.14 * dur, 0, "none"], [0.15 * dur, 1, s5],
				[0.23 * dur, 0, "none"], [0.25 * dur, 1, s4],
				[0.35 * dur, 0, "none"], [0.40 * dur, 1, s3],
				[0.43 * dur, 0, "none"], [0.45 * dur, 1, s2],
				[0.55 * dur, 0, "none"], [0.695 * dur, 1, s2],
				[0.70 * dur, 0, "none"], [0.799 * dur, 1, s1],
				[0.80 * dur, 0, "none"], [0.899 * dur, 1, "none"],
				[0.90 * dur, 0, "none"], [dur, 0, "none"],
			]
			steps.forEach(([t, op, shadow]) => tl.set(el, { opacity: op, boxShadow: shadow }, t))
			return tl
		},
	},
}

export default flickerOut
