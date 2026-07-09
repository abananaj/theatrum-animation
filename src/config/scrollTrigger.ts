import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function getScrollTrigger(el: Element): ScrollTrigger.Vars {
	return {
		trigger: el,
		start: "top 85%",
		once: true,
	}
}

/**
 * Fire `cb` once when `el` scrolls into view. For animations that manage their
 * own timeline (which can't take the integrated `scrollTrigger` tween var), so
 * they can be built paused and played on entry at the same threshold.
 */
export function onScrollIntoView(el: Element, cb: () => void): void {
	ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: cb })
}
