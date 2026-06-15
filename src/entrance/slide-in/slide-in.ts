import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = {
	duration: 800,
	ease: "power2.out",
}

const slideIn: Record<string, AnimationConfig> = {
	"slide-in-top":    { ...defaults, name: "slide-in-top",    from: { y: -100, opacity: 0 } },
	"slide-in-right":  { ...defaults, name: "slide-in-right",  from: { x:  100, opacity: 0 } },
	"slide-in-bottom": { ...defaults, name: "slide-in-bottom", from: { y:  100, opacity: 0 } },
	"slide-in-left":   { ...defaults, name: "slide-in-left",   from: { x: -100, opacity: 0 } },
	"slide-in-bl":     { ...defaults, name: "slide-in-bl",     from: { x: -100, y:  100, opacity: 0 } },
	"slide-in-br":     { ...defaults, name: "slide-in-br",     from: { x:  100, y:  100, opacity: 0 } },
	"slide-in-tl":     { ...defaults, name: "slide-in-tl",     from: { x: -100, y: -100, opacity: 0 } },
	"slide-in-tr":     { ...defaults, name: "slide-in-tr",     from: { x:  100, y: -100, opacity: 0 } },
}

export default slideIn
