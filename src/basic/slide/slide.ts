import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power1.out" }

const slide: Record<string, AnimationConfig> = {
	"slide-top":    { ...defaults, name: "slide-top",    to: { y: -100 } },
	"slide-right":  { ...defaults, name: "slide-right",  to: { x:  100 } },
	"slide-bottom": { ...defaults, name: "slide-bottom", to: { y:  100 } },
	"slide-left":   { ...defaults, name: "slide-left",   to: { x: -100 } },
	"slide-tl":     { ...defaults, name: "slide-tl",     to: { x: -100, y: -100 } },
	"slide-tr":     { ...defaults, name: "slide-tr",     to: { x:  100, y: -100 } },
	"slide-bl":     { ...defaults, name: "slide-bl",     to: { x: -100, y:  100 } },
	"slide-br":     { ...defaults, name: "slide-br",     to: { x:  100, y:  100 } },
}

export default slide
