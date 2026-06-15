import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const flickerIn: Record<string, AnimationConfig> = {
	"flicker-in-1": {
		name: "flicker-in-1",
		duration: 2500,
		ease: "none",
		timeline: (el) => {
			const dur = 2.5
			const tl = gsap.timeline()
			const steps: [number, number][] = [
				[0, 0],
				[0.101 * dur, 1], [0.102 * dur, 0],
				[0.201 * dur, 1], [0.206 * dur, 0],
				[0.301 * dur, 1], [0.306 * dur, 0],
				[0.451 * dur, 1], [0.551 * dur, 0],
				[0.571 * dur, 1], [0.601 * dur, 0],
				[0.651 * dur, 1], [0.751 * dur, 0],
				[0.771 * dur, 1], [0.851 * dur, 0],
				[0.861 * dur, 1], [dur, 1],
			]
			steps.forEach(([t, op]) => tl.set(el, { opacity: op }, t))
			return tl
		},
	},

	"flicker-in-2": {
		name: "flicker-in-2",
		duration: 2500,
		ease: "none",
		timeline: (el) => {
			const dur = 2.5
			const s1 = "0 0 30px rgba(255,255,255,.25)"
			const s2 = "0 0 30px rgba(255,255,255,.45), 0 0 60px rgba(255,255,255,.25)"
			const s3 = "0 0 30px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.3)"
			const s4 = "0 0 30px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.3), 0 0 100px rgba(255,255,255,.1)"
			const s5 = "0 0 30px rgba(255,255,255,.6), 0 0 60px rgba(255,255,255,.4), 0 0 110px rgba(255,255,255,.2), 0 0 100px rgba(255,255,255,.1)"
			const s6 = "0 0 30px rgba(255,255,255,.6), 0 0 60px rgba(255,255,255,.45), 0 0 110px rgba(255,255,255,.25), 0 0 100px rgba(255,255,255,.1)"
			const tl = gsap.timeline()
			const steps: [number, number, string][] = [
				[0, 0, "none"],
				[0.101 * dur, 1, "none"],   [0.102 * dur, 0, "none"],
				[0.201 * dur, 1, s1],       [0.206 * dur, 0, "none"],
				[0.301 * dur, 1, s2],       [0.306 * dur, 0, "none"],
				[0.451 * dur, 1, s2],       [0.551 * dur, 0, "none"],
				[0.571 * dur, 1, s3],       [0.601 * dur, 0, "none"],
				[0.651 * dur, 1, s4],       [0.751 * dur, 0, "none"],
				[0.771 * dur, 1, s5],       [0.851 * dur, 0, "none"],
				[0.861 * dur, 1, s6],       [dur, 1, s6],
			]
			steps.forEach(([t, op, shadow]) => tl.set(el, { opacity: op, boxShadow: shadow }, t))
			return tl
		},
	},
}

export default flickerIn
