import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.in" }

const slideOutBck: Record<string, AnimationConfig> = {
	"slide-out-bck-center": { ...defaults, name: "slide-out-bck-center", to: { z: -1100, opacity: 0 } },
	"slide-out-bck-top":    { ...defaults, name: "slide-out-bck-top",    to: { z: -1100, y: -1000, opacity: 0 } },
	"slide-out-bck-right":  { ...defaults, name: "slide-out-bck-right",  to: { z: -1100, x:  1000, opacity: 0 } },
	"slide-out-bck-bottom": { ...defaults, name: "slide-out-bck-bottom", to: { z: -1100, y:  1000, opacity: 0 } },
	"slide-out-bck-left":   { ...defaults, name: "slide-out-bck-left",   to: { z: -1100, x: -1000, opacity: 0 } },
	"slide-out-bck-tl":     { ...defaults, name: "slide-out-bck-tl",     to: { z: -1100, y: -1000, x: -1000, opacity: 0 } },
	"slide-out-bck-tr":     { ...defaults, name: "slide-out-bck-tr",     to: { z: -1100, y: -1000, x:  1000, opacity: 0 } },
	"slide-out-bck-bl":     { ...defaults, name: "slide-out-bck-bl",     to: { z: -1100, y:  1000, x: -1000, opacity: 0 } },
	"slide-out-bck-br":     { ...defaults, name: "slide-out-bck-br",     to: { z: -1100, y:  1000, x:  1000, opacity: 0 } },
}

export default slideOutBck
