import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.out" }

const rotateIn2: Record<string, AnimationConfig> = {
	"rotate-in-2-cw":      { ...defaults, name: "rotate-in-2-cw",      from: { rotation: -45, opacity: 0 } },
	"rotate-in-2-tr-cw":   { ...defaults, name: "rotate-in-2-tr-cw",   from: { rotation: -45, transformOrigin: "100% 0",    opacity: 0 } },
	"rotate-in-2-tl-cw":   { ...defaults, name: "rotate-in-2-tl-cw",   from: { rotation: -45, transformOrigin: "0 0",       opacity: 0 } },
	"rotate-in-2-br-cw":   { ...defaults, name: "rotate-in-2-br-cw",   from: { rotation: -45, transformOrigin: "100% 100%", opacity: 0 } },
	"rotate-in-2-bl-cw":   { ...defaults, name: "rotate-in-2-bl-cw",   from: { rotation: -45, transformOrigin: "0 100%",    opacity: 0 } },
	"rotate-in-2-fwd-cw":  { ...defaults, name: "rotate-in-2-fwd-cw",  from: { rotation: -45, z: -200, opacity: 0 } },
	"rotate-in-2-bck-cw":  { ...defaults, name: "rotate-in-2-bck-cw",  from: { rotation: -45, z:  200, opacity: 0 } },
	"rotate-in-2-ccw":     { ...defaults, name: "rotate-in-2-ccw",     from: { rotation:  45, opacity: 0 } },
	"rotate-in-2-tr-ccw":  { ...defaults, name: "rotate-in-2-tr-ccw",  from: { rotation:  45, transformOrigin: "100% 0",    opacity: 0 } },
	"rotate-in-2-tl-ccw":  { ...defaults, name: "rotate-in-2-tl-ccw",  from: { rotation:  45, transformOrigin: "0 0",       opacity: 0 } },
	"rotate-in-2-br-ccw":  { ...defaults, name: "rotate-in-2-br-ccw",  from: { rotation:  45, transformOrigin: "100% 100%", opacity: 0 } },
	"rotate-in-2-bl-ccw":  { ...defaults, name: "rotate-in-2-bl-ccw",  from: { rotation:  45, transformOrigin: "0 100%",    opacity: 0 } },
	"rotate-in-2-fwd-ccw": { ...defaults, name: "rotate-in-2-fwd-ccw", from: { rotation:  45, z: -200, opacity: 0 } },
	"rotate-in-2-bck-ccw": { ...defaults, name: "rotate-in-2-bck-ccw", from: { rotation:  45, z:  200, opacity: 0 } },
}

export default rotateIn2
