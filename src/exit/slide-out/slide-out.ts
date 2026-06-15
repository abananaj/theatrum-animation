import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 800, ease: "power2.in" }

const slideOut: Record<string, AnimationConfig> = {
	"slide-out-top":    { ...defaults, name: "slide-out-top",    to: { y: -1000, opacity: 0 } },
	"slide-out-right":  { ...defaults, name: "slide-out-right",  to: { x:  1000, opacity: 0 } },
	"slide-out-bottom": { ...defaults, name: "slide-out-bottom", to: { y:  1000, opacity: 0 } },
	"slide-out-left":   { ...defaults, name: "slide-out-left",   to: { x: -1000, opacity: 0 } },
	"slide-out-tl":     { ...defaults, name: "slide-out-tl",     to: { x: -1000, y: -1000, opacity: 0 } },
	"slide-out-tr":     { ...defaults, name: "slide-out-tr",     to: { x:  1000, y: -1000, opacity: 0 } },
	"slide-out-bl":     { ...defaults, name: "slide-out-bl",     to: { x: -1000, y:  1000, opacity: 0 } },
	"slide-out-br":     { ...defaults, name: "slide-out-br",     to: { x:  1000, y:  1000, opacity: 0 } },
}

export default slideOut
