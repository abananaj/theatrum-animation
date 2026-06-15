import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makeShakeX(name: string): AnimationConfig {
	return {
		name, duration: 800, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.08
			tl.to(el, { x: -10, duration: d })
			  .to(el, { x:  10, duration: d })
			  .to(el, { x: -10, duration: d })
			  .to(el, { x:  10, duration: d })
			  .to(el, { x: -10, duration: d })
			  .to(el, { x:  10, duration: d })
			  .to(el, { x: -10, duration: d })
			  .to(el, { x:   8, duration: d })
			  .to(el, { x:  -8, duration: d })
			  .to(el, { x:   0, duration: d })
			return tl
		},
	}
}

function makeShakeY(name: string): AnimationConfig {
	return {
		name, duration: 800, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.08
			tl.to(el, { y:  -8, duration: d })
			  .to(el, { y:   8, duration: d })
			  .to(el, { y:  -8, duration: d })
			  .to(el, { y:   8, duration: d })
			  .to(el, { y:  -8, duration: d })
			  .to(el, { y:   8, duration: d })
			  .to(el, { y:  -8, duration: d })
			  .to(el, { y: 6.4, duration: d })
			  .to(el, { y:-6.4, duration: d })
			  .to(el, { y:   0, duration: d })
			return tl
		},
	}
}

function makeShakeRot(name: string, origin: string, large = 10): AnimationConfig {
	const small = large * 0.4
	return {
		name, duration: 800, ease: "none",
		timeline: (el) => {
			const tl = gsap.timeline({ repeat: -1 })
			const d = 0.08
			gsap.set(el, { transformOrigin: origin })
			tl.to(el, { rotation:  small * 0.2,  duration: d })
			  .to(el, { rotation: -large * 0.4,  duration: d })
			  .to(el, { rotation:  large * 0.4,  duration: d })
			  .to(el, { rotation: -large * 0.4,  duration: d })
			  .to(el, { rotation:  large * 0.4,  duration: d })
			  .to(el, { rotation: -large * 0.4,  duration: d })
			  .to(el, { rotation:  large * 0.4,  duration: d })
			  .to(el, { rotation: -small * 0.2,  duration: d })
			  .to(el, { rotation:  small * 0.2,  duration: d })
			  .to(el, { rotation:  0,             duration: d })
			return tl
		},
	}
}

const shake: Record<string, AnimationConfig> = {
	"shake-horizontal": makeShakeX("shake-horizontal"),
	"shake-vertical":   makeShakeY("shake-vertical"),
	"shake-top":        makeShakeRot("shake-top",    "50% 0",    4),
	"shake-bottom":     makeShakeRot("shake-bottom", "50% 100%", 4),
	"shake-left":       makeShakeRot("shake-left",   "0 50%",    4),
	"shake-right":      makeShakeRot("shake-right",  "100% 50%", 4),
	"shake-tl":         makeShakeRot("shake-tl",     "0 0",      4),
	"shake-tr":         makeShakeRot("shake-tr",     "100% 0",   4),
	"shake-bl":         makeShakeRot("shake-bl",     "0 100%",   4),
	"shake-br":         makeShakeRot("shake-br",     "100% 100%",4),
	"shake-lr":         makeShakeRot("shake-lr",     "50% 50%",  10),
}

export default shake
