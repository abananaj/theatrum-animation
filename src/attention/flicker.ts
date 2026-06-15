import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makeFlicker(name: string, dur: number, steps: [number, number][]): AnimationConfig {
	return {
		name, duration: dur * 1000, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			steps.forEach(([t, op]) => tl.set(el, { opacity: op }, t))
			return tl
		},
	}
}

const flickerConfigs: Record<string, { dur: number; steps: [number, number][] }> = {
	"flicker-1": {
		dur: 0.8,
		steps: [
			[0, 1],
			[0.42 * 0.8, 0], [0.4301 * 0.8, 1],
			[0.48 * 0.8, 0], [0.4901 * 0.8, 1],
			[0.8, 1],
		],
	},
	"flicker-2": {
		dur: 0.8,
		steps: [
			[0, 1],
			[0.42 * 0.8, 0], [0.4301 * 0.8, 1],
			[0.46 * 0.8, 0], [0.4691 * 0.8, 1],
			[0.52 * 0.8, 0], [0.5281 * 0.8, 1],
			[0.8, 1],
		],
	},
	"flicker-3": {
		dur: 1.0,
		steps: [
			[0, 1],
			[0.33 * 1.0, 0], [0.3402 * 1.0, 1],
			[0.35 * 1.0, 0], [0.3592 * 1.0, 1],
			[0.39 * 1.0, 0], [0.3982 * 1.0, 1],
			[0.84 * 1.0, 0], [0.8492 * 1.0, 1],
			[1.0, 1],
		],
	},
	"flicker-4": {
		dur: 1.2,
		steps: [
			[0, 1],
			[0.32 * 1.2, 0], [0.3282 * 1.2, 1],
			[0.35 * 1.2, 0], [0.3572 * 1.2, 1],
			[0.37 * 1.2, 0], [0.3762 * 1.2, 1],
			[0.68 * 1.2, 0], [0.6842 * 1.2, 1],
			[0.96 * 1.2, 0], [0.9672 * 1.2, 1],
			[0.99 * 1.2, 0], [0.9962 * 1.2, 1],
			[1.2, 1],
		],
	},
	"flicker-5": {
		dur: 1.5,
		steps: [
			[0, 1],
			[0.09 * 1.5, 0], [0.0982 * 1.5, 1],
			[0.152 * 1.5, 0.7], [0.1602 * 1.5, 1],
			[0.205 * 1.5, 0.9], [0.2132 * 1.5, 1],
			[0.405 * 1.5, 0.6], [0.4142 * 1.5, 1],
			[0.602 * 1.5, 0.2], [0.614 * 1.5, 0.4], [0.614 * 1.5, 0], [0.6222 * 1.5, 1],
			[0.78 * 1.5, 0.7], [0.7882 * 1.5, 1],
			[1.5, 1],
		],
	},
}

const flicker: Record<string, AnimationConfig> = {}
for (const [key, { dur, steps }] of Object.entries(flickerConfigs)) {
	flicker[key] = makeFlicker(key, dur, steps)
}

export default flicker
