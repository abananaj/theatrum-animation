import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 600, ease: "power1.inOut" }

const rotate: Record<string, AnimationConfig> = {
	"rotate-center":   { ...defaults, name: "rotate-center",   to: { rotation: 360 } },
	"rotate-top":      { ...defaults, name: "rotate-top",      to: { rotation: 360, transformOrigin: "50% 0" } },
	"rotate-right":    { ...defaults, name: "rotate-right",    to: { rotation: 360, transformOrigin: "100% 50%" } },
	"rotate-bottom":   { ...defaults, name: "rotate-bottom",   to: { rotation: 360, transformOrigin: "50% 100%" } },
	"rotate-left":     { ...defaults, name: "rotate-left",     to: { rotation: 360, transformOrigin: "0 50%" } },
	"rotate-tl":       { ...defaults, name: "rotate-tl",       to: { rotation: 360, transformOrigin: "0 0" } },
	"rotate-tr":       { ...defaults, name: "rotate-tr",       to: { rotation: 360, transformOrigin: "100% 0" } },
	"rotate-bl":       { ...defaults, name: "rotate-bl",       to: { rotation: 360, transformOrigin: "0 100%" } },
	"rotate-br":       { ...defaults, name: "rotate-br",       to: { rotation: 360, transformOrigin: "100% 100%" } },
	"rotate-hor-center":  { ...defaults, name: "rotate-hor-center",  to: { rotateX: -360 } },
	"rotate-hor-top":     { ...defaults, name: "rotate-hor-top",     to: { rotateX: -360, transformOrigin: "50% 0" } },
	"rotate-hor-bottom":  { ...defaults, name: "rotate-hor-bottom",  to: { rotateX:  360, transformOrigin: "50% 100%" } },
	"rotate-vert-center": { ...defaults, name: "rotate-vert-center", to: { rotateY:  360 } },
	"rotate-vert-left":   { ...defaults, name: "rotate-vert-left",   to: { rotateY:  360, transformOrigin: "0 50%" } },
	"rotate-vert-right":  { ...defaults, name: "rotate-vert-right",  to: { rotateY: -360, transformOrigin: "100% 50%" } },
	"rotate-diagonal-1":  { ...defaults, name: "rotate-diagonal-1",  to: { rotateX: -360, rotateY: -360 } },
	"rotate-diagonal-2":  { ...defaults, name: "rotate-diagonal-2",  to: { rotateX:  360, rotateY: -360 } },
	"rotate-diagonal-tr": { ...defaults, name: "rotate-diagonal-tr", to: { rotateX: -360, rotateY: -360, transformOrigin: "100% 0" } },
	"rotate-diagonal-bl": { ...defaults, name: "rotate-diagonal-bl", to: { rotateX:  360, rotateY:  360, transformOrigin: "0 100%" } },
	"rotate-diagonal-tl": { ...defaults, name: "rotate-diagonal-tl", to: { rotateX:  360, rotateY: -360, transformOrigin: "0 0" } },
	"rotate-diagonal-br": { ...defaults, name: "rotate-diagonal-br", to: { rotateX: -360, rotateY:  360, transformOrigin: "100% 100%" } },
}

export default rotate
