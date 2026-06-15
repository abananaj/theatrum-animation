import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.in" }

const flipOut: Record<string, AnimationConfig> = {
	"flip-out-hor-top":    { ...defaults, name: "flip-out-hor-top",    to: { rotateX:  70, opacity: 0 } },
	"flip-out-hor-bottom": { ...defaults, name: "flip-out-hor-bottom", to: { rotateX: -70, opacity: 0 } },
	"flip-out-ver-left":   { ...defaults, name: "flip-out-ver-left",   to: { rotateY: -70, opacity: 0 } },
	"flip-out-diag-1-tr":  { ...defaults, name: "flip-out-diag-1-tr",  to: { rotateX:  50, rotateY:  50, opacity: 0 } },
	"flip-out-diag-1-bl":  { ...defaults, name: "flip-out-diag-1-bl",  to: { rotateX: -50, rotateY: -50, opacity: 0 } },
	"flip-out-diag-2-br":  { ...defaults, name: "flip-out-diag-2-br",  to: { rotateX: -50, rotateY:  50, opacity: 0 } },
	"flip-out-diag-2-tl":  { ...defaults, name: "flip-out-diag-2-tl",  to: { rotateX:  50, rotateY: -50, opacity: 0 } },
}

export default flipOut
