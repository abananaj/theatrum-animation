import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.in" }

const rotateOut: Record<string, AnimationConfig> = {
	"rotate-out-center": { ...defaults, name: "rotate-out-center", to: { rotation: -360, opacity: 0 } },
	"rotate-out-top":    { ...defaults, name: "rotate-out-top",    to: { rotation: -360, transformOrigin: "top",          opacity: 0 } },
	"rotate-out-right":  { ...defaults, name: "rotate-out-right",  to: { rotation: -360, transformOrigin: "right",        opacity: 0 } },
	"rotate-out-bottom": { ...defaults, name: "rotate-out-bottom", to: { rotation: -360, transformOrigin: "bottom",       opacity: 0 } },
	"rotate-out-left":   { ...defaults, name: "rotate-out-left",   to: { rotation: -360, transformOrigin: "left",         opacity: 0 } },
	"rotate-out-tl":     { ...defaults, name: "rotate-out-tl",     to: { rotation: -360, transformOrigin: "top left",     opacity: 0 } },
	"rotate-out-tr":     { ...defaults, name: "rotate-out-tr",     to: { rotation: -360, transformOrigin: "top right",    opacity: 0 } },
	"rotate-out-bl":     { ...defaults, name: "rotate-out-bl",     to: { rotation: -360, transformOrigin: "bottom left",  opacity: 0 } },
	"rotate-out-br":     { ...defaults, name: "rotate-out-br",     to: { rotation: -360, transformOrigin: "bottom right", opacity: 0 } },
	"rotate-out-hor":    { ...defaults, name: "rotate-out-hor",    to: { rotateX:  360, opacity: 0 } },
	"rotate-out-ver":    { ...defaults, name: "rotate-out-ver",    to: { rotateY:  360, opacity: 0 } },
	"rotate-out-diag-1": { ...defaults, name: "rotate-out-diag-1", to: { rotateX:  180, rotateY:  180, opacity: 0 } },
	"rotate-out-diag-2": { ...defaults, name: "rotate-out-diag-2", to: { rotateX: -180, rotateY:  180, opacity: 0 } },
}

export default rotateOut
