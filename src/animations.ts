import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export interface AnimationConfig {
	name: string
	duration: number // milliseconds — matches data-animation-duration attribute
	ease: string
	from: gsap.TweenVars
}

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
	"slide-top": {
		name: "slide-top",
		duration: 800,
		ease: "power2.out",
		from: { y: -100, opacity: 0 },
	},
	"slide-bl": {
		name: "slide-bl",
		duration: 800,
		ease: "power2.out",
		from: { x: -100, y: 100, opacity: 0 },
	},
	"slide-bottom": {
		name: "slide-bottom",
		duration: 800,
		ease: "power2.out",
		from: { y: 100, opacity: 0 },
	},
	"slide-br": {
		name: "slide-br",
		duration: 800,
		ease: "power2.out",
		from: { x: 100, y: 100, opacity: 0 },
	},
}

function getAnimationData(element: Element): AnimationConfig | null {
	const animationType = element.getAttribute("data-animation")
	if (!animationType || !ANIMATION_CONFIGS[animationType]) return null

	const config = { ...ANIMATION_CONFIGS[animationType] }

	const customDuration = element.getAttribute("data-animation-duration")
	if (customDuration) config.duration = parseInt(customDuration, 10)

	const customEasing = element.getAttribute("data-animation-easing")
	if (customEasing) config.ease = customEasing

	return config
}

export function initializeAnimations(): void {
	document.querySelectorAll("[data-animation]").forEach((el) => {
		const config = getAnimationData(el)
		if (!config) return

		gsap.from(el, {
			...config.from,
			duration: config.duration / 1000,
			ease: config.ease,
			clearProps: "all",
			scrollTrigger: {
				trigger: el,
				start: "top 85%",
				once: true,
			},
		})
	})
}
