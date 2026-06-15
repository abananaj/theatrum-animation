import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 800, ease: "power4.in" }

const rollOut: Record<string, AnimationConfig> = {
	"roll-out-top":           { ...defaults, name: "roll-out-top",           to: { y:  -800, rotation: -540, opacity: 0 } },
	"roll-out-right":         { ...defaults, name: "roll-out-right",         to: { x:  1000, rotation:  540, opacity: 0 } },
	"roll-out-bottom":        { ...defaults, name: "roll-out-bottom",        to: { y:   800, rotation:  540, opacity: 0 } },
	"roll-out-left":          { ...defaults, name: "roll-out-left",          to: { x: -1000, rotation: -540, opacity: 0 } },
	"roll-out-blurred-top":   { ...defaults, name: "roll-out-blurred-top",   to: { y:  -800, rotation: -720, filter: "blur(50px)", opacity: 0 } },
	"roll-out-blurred-right": { ...defaults, name: "roll-out-blurred-right", to: { x:  1000, rotation:  720, filter: "blur(50px)", opacity: 0 } },
	"roll-out-blurred-bottom":{ ...defaults, name: "roll-out-blurred-bottom",to: { y:   800, rotation:  720, filter: "blur(50px)", opacity: 0 } },
	"roll-out-blurred-left":  { ...defaults, name: "roll-out-blurred-left",  to: { x: -1000, rotation: -720, filter: "blur(50px)", opacity: 0 } },
}

export default rollOut
