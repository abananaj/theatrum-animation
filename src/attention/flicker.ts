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

// `dur` (loop length, seconds) is tuned so each variant's flash rate stays
// under WCAG 2.3.1's general flash threshold (max 3 flashes/sec) — these loop
// forever via repeat: -1, so unlike a one-shot effect the rate must hold
// indefinitely. Widen `dur` rather than removing dips to keep the pattern.
const flickerConfigs: Record<string, { dur: number; steps: [number, number][] }> = {
	"flicker-1": {
		dur: 0.8, // 2 flashes/0.8s ≈ 2.5/sec
		steps: [
			[0, 1],
			[0.42 * 0.8, 0], [0.4301 * 0.8, 1],
			[0.48 * 0.8, 0], [0.4901 * 0.8, 1],
			[0.8, 1],
		],
	},
	"flicker-2": {
		dur: 1.1, // 3 flashes/1.1s ≈ 2.7/sec
		steps: [
			[0, 1],
			[0.42 * 1.1, 0], [0.4301 * 1.1, 1],
			[0.46 * 1.1, 0], [0.4691 * 1.1, 1],
			[0.52 * 1.1, 0], [0.5281 * 1.1, 1],
			[1.1, 1],
		],
	},
	"flicker-3": {
		dur: 1.4, // 4 flashes/1.4s ≈ 2.9/sec
		steps: [
			[0, 1],
			[0.33 * 1.4, 0], [0.3402 * 1.4, 1],
			[0.35 * 1.4, 0], [0.3592 * 1.4, 1],
			[0.39 * 1.4, 0], [0.3982 * 1.4, 1],
			[0.84 * 1.4, 0], [0.8492 * 1.4, 1],
			[1.4, 1],
		],
	},
	"flicker-4": {
		dur: 2.1, // 6 flashes/2.1s ≈ 2.9/sec
		steps: [
			[0, 1],
			[0.32 * 2.1, 0], [0.3282 * 2.1, 1],
			[0.35 * 2.1, 0], [0.3572 * 2.1, 1],
			[0.37 * 2.1, 0], [0.3762 * 2.1, 1],
			[0.68 * 2.1, 0], [0.6842 * 2.1, 1],
			[0.96 * 2.1, 0], [0.9672 * 2.1, 1],
			[0.99 * 2.1, 0], [0.9962 * 2.1, 1],
			[2.1, 1],
		],
	},
	"flicker-5": {
		dur: 2.1, // 6 flashes/2.1s ≈ 2.9/sec
		steps: [
			[0, 1],
			[0.09 * 2.1, 0], [0.0982 * 2.1, 1],
			[0.152 * 2.1, 0.7], [0.1602 * 2.1, 1],
			[0.205 * 2.1, 0.9], [0.2132 * 2.1, 1],
			[0.405 * 2.1, 0.6], [0.4142 * 2.1, 1],
			[0.602 * 2.1, 0.2], [0.614 * 2.1, 0.4], [0.614 * 2.1, 0], [0.6222 * 2.1, 1],
			[0.78 * 2.1, 0.7], [0.7882 * 2.1, 1],
			[2.1, 1],
		],
	},
}

const flicker: Record<string, AnimationConfig> = {}
for (const [key, { dur, steps }] of Object.entries(flickerConfigs)) {
	flicker[key] = makeFlicker(key, dur, steps)
}

export default flicker
