import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.in" }

const rotateOutMax: Record<string, AnimationConfig> = {
	"rotate-out-2-cw":      { ...defaults, name: "rotate-out-2-cw",      to: { rotation:  45, opacity: 0 } },
	"rotate-out-2-tr-cw":   { ...defaults, name: "rotate-out-2-tr-cw",   to: { rotation:  45, transformOrigin: "100% 0",    opacity: 0 } },
	"rotate-out-2-tl-cw":   { ...defaults, name: "rotate-out-2-tl-cw",   to: { rotation:  45, transformOrigin: "0 0",       opacity: 0 } },
	"rotate-out-2-br-cw":   { ...defaults, name: "rotate-out-2-br-cw",   to: { rotation:  45, transformOrigin: "100% 100%", opacity: 0 } },
	"rotate-out-2-bl-cw":   { ...defaults, name: "rotate-out-2-bl-cw",   to: { rotation:  45, transformOrigin: "0 100%",    opacity: 0 } },
	"rotate-out-2-fwd":     { ...defaults, name: "rotate-out-2-fwd",     to: { rotation:  45, z:  180, opacity: 0 } },
	"rotate-out-2-ccw":     { ...defaults, name: "rotate-out-2-ccw",     to: { rotation: -45, opacity: 0 } },
	"rotate-out-2-tr-ccw":  { ...defaults, name: "rotate-out-2-tr-ccw",  to: { rotation: -45, transformOrigin: "100% 0",    opacity: 0 } },
	"rotate-out-2-tl-ccw":  { ...defaults, name: "rotate-out-2-tl-ccw",  to: { rotation: -45, transformOrigin: "0 0",       opacity: 0 } },
	"rotate-out-2-br-ccw":  { ...defaults, name: "rotate-out-2-br-ccw",  to: { rotation: -45, transformOrigin: "100% 100%", opacity: 0 } },
	"rotate-out-2-bl-ccw":  { ...defaults, name: "rotate-out-2-bl-ccw",  to: { rotation: -45, transformOrigin: "0 100%",    opacity: 0 } },
	"rotate-out-2-bck":     { ...defaults, name: "rotate-out-2-bck",     to: { rotation: -45, z: -180, opacity: 0 } },
}

export default rotateOutMax
