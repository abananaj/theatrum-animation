import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

const background: Record<string, AnimationConfig> = {
	"color-change-2x": {
		name: "color-change-2x", duration: 5000, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1, yoyo: true })
			tl.fromTo(el, { backgroundColor: "#19dcea" }, { backgroundColor: "#b22cff", duration: 5, ease: "none" })
			return tl
		},
	},
	"color-change-3x": {
		name: "color-change-3x", duration: 5000, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.fromTo(el, { backgroundColor: "#19dcea" }, { backgroundColor: "#b22cff", duration: 2.5, ease: "none" })
			  .to(el, { backgroundColor: "#ea2222", duration: 2.5, ease: "none" })
			return tl
		},
	},
	"color-change-4x": {
		name: "color-change-4x", duration: 5000, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.fromTo(el, { backgroundColor: "#19dcea" }, { backgroundColor: "#b22cff", duration: 1.67, ease: "none" })
			  .to(el, { backgroundColor: "#ea2222", duration: 1.67, ease: "none" })
			  .to(el, { backgroundColor: "#f5be10", duration: 1.67, ease: "none" })
			return tl
		},
	},
	"color-change-5x": {
		name: "color-change-5x", duration: 5000, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			tl.fromTo(el, { backgroundColor: "#19dcea" }, { backgroundColor: "#b22cff", duration: 1.25, ease: "none" })
			  .to(el, { backgroundColor: "#ea2222", duration: 1.25, ease: "none" })
			  .to(el, { backgroundColor: "#f5be10", duration: 1.25, ease: "none" })
			  .to(el, { backgroundColor: "#3bd80d", duration: 1.25, ease: "none" })
			return tl
		},
	},
}

export default background
