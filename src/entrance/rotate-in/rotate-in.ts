import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.out" }

const rotateIn: Record<string, AnimationConfig> = {
	"rotate-in-center": { ...defaults, name: "rotate-in-center", from: { rotation: -360, opacity: 0 } },
	"rotate-in-top":    { ...defaults, name: "rotate-in-top",    from: { rotation: -360, transformOrigin: "top",          opacity: 0 } },
	"rotate-in-right":  { ...defaults, name: "rotate-in-right",  from: { rotation: -360, transformOrigin: "right",        opacity: 0 } },
	"rotate-in-bottom": { ...defaults, name: "rotate-in-bottom", from: { rotation: -360, transformOrigin: "bottom",       opacity: 0 } },
	"rotate-in-left":   { ...defaults, name: "rotate-in-left",   from: { rotation: -360, transformOrigin: "left",         opacity: 0 } },
	"rotate-in-tr":     { ...defaults, name: "rotate-in-tr",     from: { rotation: -360, transformOrigin: "top right",    opacity: 0 } },
	"rotate-in-tl":     { ...defaults, name: "rotate-in-tl",     from: { rotation: -360, transformOrigin: "top left",     opacity: 0 } },
	"rotate-in-br":     { ...defaults, name: "rotate-in-br",     from: { rotation: -360, transformOrigin: "bottom right", opacity: 0 } },
	"rotate-in-bl":     { ...defaults, name: "rotate-in-bl",     from: { rotation: -360, transformOrigin: "bottom left",  opacity: 0 } },
	"rotate-in-hor":    { ...defaults, name: "rotate-in-hor",    from: { rotateX:  360, opacity: 0 } },
	"rotate-in-ver":    { ...defaults, name: "rotate-in-ver",    from: { rotateY: -360, opacity: 0 } },
	"rotate-in-diag-1": { ...defaults, name: "rotate-in-diag-1", from: { rotateX: -180, rotateY: -180, opacity: 0 } },
	"rotate-in-diag-2": { ...defaults, name: "rotate-in-diag-2", from: { rotateX:  180, rotateY: -180, opacity: 0 } },
}

export default rotateIn
