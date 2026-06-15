import gsap from "gsap"
import { type AnimationConfig } from "./config/animationConfigs"
// Entrance
import slideIn from "./entrance/slide-in/slide-in"
import slideInFwd from "./entrance/slide-in/slide-in-fwd"
import slideInBck from "./entrance/slide-in/slide-in-bck"
import slideInBlurred from "./entrance/slide-in/slide-in-blurred"
import slideInElliptic from "./entrance/slide-in/slide-in-elliptic"
import bounceIn from "./entrance/bounce-in"
import fadeIn from "./entrance/fade-in"
import flickerIn from "./entrance/flicker-in"
import puffIn from "./entrance/puff-in"
import rollIn from "./entrance/roll-in"
import scaleIn from "./entrance/scale-in"
import swingIn from "./entrance/swing-in"
import swirlIn from "./entrance/swirl-in"
import tiltIn from "./entrance/tilt-in"
import rotateIn from "./entrance/rotate-in/rotate-in"
import rotateIn2 from "./entrance/rotate-in/rotate-in-2"
// Exit
import bounceOut from "./exit/bounce-out"
import fadeOut from "./exit/fade-out"
import flickerOut from "./exit/flicker-out"
import flipOut from "./exit/flip-out"
import puffOut from "./exit/puff-out"
import rollOut from "./exit/roll-out"
import slitOut from "./exit/slit-out"
import swingOut from "./exit/swing-out"
import swirlOut from "./exit/swirl-out"
import scaleOut from "./exit/scale-out/scale-out"
import scaleOutDown from "./exit/scale-out/scale-down"
import scaleOutUp from "./exit/scale-out/scale-up"
import rotateOut from "./exit/rotate-out/rotate-out"
import rotateOutMax from "./exit/rotate-out/rotate-out-max"
import slideOut from "./exit/slide-out/slide-out"
import slideOutFwd from "./exit/slide-out/slide-out-fwd"
import slideOutBck from "./exit/slide-out/slide-out-bck"
import slideOutBlurred from "./exit/slide-out/slide-out-blurred"
import slideOutElliptic from "./exit/slide-out/slide-out-elliptic"
// Attention
import heartbeat from "./attention/heartbeat"
import attentionFlicker from "./attention/flicker"
import bounce from "./attention/bounce"
import blink from "./attention/blink"
import jello from "./attention/jello"
import ping from "./attention/ping"
import pulsate from "./attention/pulsate"
import attentionScaleDown from "./attention/scale-down"
import attentionScaleUp from "./attention/scale-up"
import shake from "./attention/shake"
import vibrate from "./attention/vibrate"
import wobble from "./attention/wobble"
// Text
import trackingIn from "./text/tracking-in"
import trackingOut from "./text/tracking-out"
import textShadowDrop from "./text/text-shadow-drop"
import textShadowPop from "./text/text-shadow-pop"
import textPop from "./text/text-pop"
import textFlicker from "./text/text-flicker"
import blurOut from "./text/blur-out"
import focusIn from "./text/focus-in"
// Background
import background from "./background/background"
import backgroundKenburns from "./background/background-kenburns"
import backgroundPan from "./background/background-pan"
// Basic
import swingLeft from "./basic/swing/swing-left"
import swingRight from "./basic/swing/swing-right"
import swingTop from "./basic/swing/swing-top"
import swingBottom from "./basic/swing/swing-bottom"
import slide from "./basic/slide/slide"
import slideFwd from "./basic/slide/slide-fwd"
import slideBck from "./basic/slide/slide-bck"
import slideRotate from "./basic/slide/slide-rotate"
import shadowDrop from "./basic/shadow/shadow-drop"
import shadowInset from "./basic/shadow/shadow-inset"
import shadowDropMax from "./basic/shadow/shadow-drop-max"
import shadowPop from "./basic/shadow/shadow-pop"
import basicScaleUp from "./basic/scale/scale-up"
import basicScaleDown from "./basic/scale/scale-down"
import rotate from "./basic/rotate/rotate"
import rotate90 from "./basic/rotate/rotate-90"
import rotateScale from "./basic/rotate/rotate-scale"
import flip from "./basic/flip/flip"
import flipArc from "./basic/flip/flip-arc"
import flipScale from "./basic/flip/flip-scale"

export type { AnimationConfig }

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
	// Entrance
	...slideIn, ...slideInFwd, ...slideInBck, ...slideInBlurred, ...slideInElliptic,
	...bounceIn, ...fadeIn, ...flickerIn, ...puffIn, ...rollIn,
	...scaleIn, ...swingIn, ...swirlIn, ...tiltIn, ...rotateIn, ...rotateIn2,
	// Exit
	...bounceOut, ...fadeOut, ...flickerOut, ...flipOut, ...puffOut,
	...rollOut, ...slitOut, ...swingOut, ...swirlOut,
	...scaleOut, ...scaleOutDown, ...scaleOutUp,
	...rotateOut, ...rotateOutMax,
	...slideOut, ...slideOutFwd, ...slideOutBck, ...slideOutBlurred, ...slideOutElliptic,
	// Attention (spread after exit — attention wins on conflicts)
	...heartbeat, ...attentionFlicker, ...bounce, ...blink, ...jello,
	...ping, ...pulsate, ...attentionScaleDown, ...attentionScaleUp,
	...shake, ...vibrate, ...wobble,
	// Text
	...trackingIn, ...trackingOut, ...textShadowDrop, ...textShadowPop,
	...textPop, ...textFlicker, ...blurOut, ...focusIn,
	// Background
	...background, ...backgroundKenburns, ...backgroundPan,
	// Basic (one-shot transitions)
	...swingLeft, ...swingRight, ...swingTop, ...swingBottom,
	...slide, ...slideFwd, ...slideBck, ...slideRotate,
	...shadowDrop, ...shadowInset, ...shadowDropMax, ...shadowPop,
	...basicScaleUp, ...basicScaleDown,
	...rotate, ...rotate90, ...rotateScale,
	...flip, ...flipArc, ...flipScale,
}

const selector = Object.keys(ANIMATION_CONFIGS).map(k => `.${k}`).join(",")

function animateElement(el: Element): void {
	const animationType = Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))
	if (!animationType) return
	const config = ANIMATION_CONFIGS[animationType]
	const duration = config.duration / 1000
	const hasRepeat = config.repeat !== undefined

	if (config.timeline) {
		config.timeline(el, duration)
		return
	}

	if (config.from) {
		gsap.from(el, {
			...config.from,
			duration,
			ease: config.ease,
			...(hasRepeat
				? { repeat: config.repeat, yoyo: config.yoyo }
				: { clearProps: "all" }),
		})
	} else if (config.to) {
		gsap.to(el, {
			...config.to,
			duration,
			ease: config.ease,
			...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
		})
	}
}

export function initializeAnimations(): void {
	document.querySelectorAll(selector).forEach(animateElement)

	const animationKeys = Object.keys(ANIMATION_CONFIGS)

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target instanceof Element) {
				const oldClasses = new Set((mutation.oldValue ?? "").split(" "))
				const newlyAdded = animationKeys.find(
					k => mutation.target instanceof Element && mutation.target.classList.contains(k) && !oldClasses.has(k)
				)
				if (newlyAdded) animateElement(mutation.target as Element)
				continue
			}
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue
				if (animationKeys.some(k => node.classList.contains(k))) {
					animateElement(node)
				}
				node.querySelectorAll(selector).forEach(animateElement)
			}
		}
	}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true })
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeAnimations)
} else {
	initializeAnimations()
}
