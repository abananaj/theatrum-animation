import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power1.in" }

const slideBck: Record<string, AnimationConfig> = {
	"slide-bck-center": { ...defaults, name: "slide-bck-center", to: { z: -400 } },
	"slide-bck-top":    { ...defaults, name: "slide-bck-top",    to: { z: -400, y: -200 } },
	"slide-bck-right":  { ...defaults, name: "slide-bck-right",  to: { z: -400, x:  200 } },
	"slide-bck-bottom": { ...defaults, name: "slide-bck-bottom", to: { z: -400, y:  200 } },
	"slide-bck-left":   { ...defaults, name: "slide-bck-left",   to: { z: -400, x: -200 } },
	"slide-bck-tl":     { ...defaults, name: "slide-bck-tl",     to: { z: -400, y: -200, x: -200 } },
	"slide-bck-tr":     { ...defaults, name: "slide-bck-tr",     to: { z: -400, y: -200, x:  200 } },
	"slide-bck-bl":     { ...defaults, name: "slide-bck-bl",     to: { z: -400, y:  200, x: -200 } },
	"slide-bck-br":     { ...defaults, name: "slide-bck-br",     to: { z: -400, y:  200, x:  200 } },
}

export default slideBck
