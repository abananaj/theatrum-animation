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
