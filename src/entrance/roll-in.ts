import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 800, ease: "power4.out" }

const rollIn: Record<string, AnimationConfig> = {
	"roll-in-left":          { ...defaults, name: "roll-in-left",          from: { x: -800,  rotation: -540, opacity: 0 } },
	"roll-in-right":         { ...defaults, name: "roll-in-right",         from: { x:  800,  rotation:  540, opacity: 0 } },
	"roll-in-top":           { ...defaults, name: "roll-in-top",           from: { y: -800,  rotation: -540, opacity: 0 } },
	"roll-in-bottom":        { ...defaults, name: "roll-in-bottom",        from: { y:  800,  rotation:  540, opacity: 0 } },
	"roll-in-blurred-left":  { ...defaults, name: "roll-in-blurred-left",  from: { x: -1000, rotation: -720, filter: "blur(50px)", opacity: 0 } },
	"roll-in-blurred-right": { ...defaults, name: "roll-in-blurred-right", from: { x:  1000, rotation:  720, filter: "blur(50px)", opacity: 0 } },
	"roll-in-blurred-top":   { ...defaults, name: "roll-in-blurred-top",   from: { y: -800,  rotation: -720, filter: "blur(50px)", opacity: 0 } },
	"roll-in-blurred-bottom":{ ...defaults, name: "roll-in-blurred-bottom",from: { y:  800,  rotation:  720, filter: "blur(50px)", opacity: 0 } },
}

export default rollIn
