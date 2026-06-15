import gsap from "gsap"
import type { AnimationConfig } from "../config/animationConfigs"

function makeSlit(name: string, axis: "rotateY" | "rotateX" | "diag1" | "diag2"): AnimationConfig {
	return {
		name,
		duration: 1000,
		ease: "power1.in",
		timeline: (el) => {
			const tl = gsap.timeline()
			if (axis === "rotateY") {
				tl.to(el, { z: -160, rotateY: 87, duration: 0.54, ease: "power1.in" })
				  .to(el, { z: -800, rotateY: 90, opacity: 0, duration: 0.46, ease: "power2.in" })
			} else if (axis === "rotateX") {
				tl.to(el, { z: -160, rotateX: 87, duration: 0.54, ease: "power1.in" })
				  .to(el, { z: -800, rotateX: 90, opacity: 0, duration: 0.46, ease: "power2.in" })
			} else if (axis === "diag1") {
				tl.to(el, { z: -160, rotateX: 60, rotateY: 60, duration: 0.54, ease: "power1.in" })
				  .to(el, { z: -800, rotateX: 63, rotateY: 63, opacity: 0, duration: 0.46, ease: "power2.in" })
			} else {
				tl.to(el, { z: -160, rotateX: -60, rotateY: 60, duration: 0.54, ease: "power1.in" })
				  .to(el, { z: -800, rotateX: -63, rotateY: 63, opacity: 0, duration: 0.46, ease: "power2.in" })
			}
			return tl
		},
	}
}

const slitOut: Record<string, AnimationConfig> = {
	"slit-out-vertical":    makeSlit("slit-out-vertical",    "rotateY"),
	"slit-out-horizontal":  makeSlit("slit-out-horizontal",  "rotateX"),
	"slit-out-diagonal-1":  makeSlit("slit-out-diagonal-1",  "diag1"),
	"slit-out-diagonal-2":  makeSlit("slit-out-diagonal-2",  "diag2"),
}

export default slitOut
