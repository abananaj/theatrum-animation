import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/** `point` is the viewport % from top (0-100) that fires the trigger; 85 matches the prior fixed default. */
export function getScrollTrigger(el: Element, point = 85): ScrollTrigger.Vars {
	return {
		trigger: el,
		start: `top ${point}%`,
		once: true,
	}
}

/** Fires `cb` once when `el` scrolls into view — for timeline animations, which can't take the integrated `scrollTrigger` tween var, so they're built paused and played on entry at the same threshold. */
export function onScrollIntoView(el: Element, cb: () => void, point = 85): void {
	ScrollTrigger.create({ trigger: el, start: `top ${point}%`, once: true, onEnter: cb })
}
