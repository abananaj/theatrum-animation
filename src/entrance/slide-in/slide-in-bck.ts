import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.out" }

const slideInBck: Record<string, AnimationConfig> = {
	"slide-in-bck-center": { ...defaults, name: "slide-in-bck-center", from: { z:  600, opacity: 0 } },
	"slide-in-bck-top":    { ...defaults, name: "slide-in-bck-top",    from: { z:  700, y: -300, opacity: 0 } },
	"slide-in-bck-right":  { ...defaults, name: "slide-in-bck-right",  from: { z:  700, x:  400, opacity: 0 } },
	"slide-in-bck-bottom": { ...defaults, name: "slide-in-bck-bottom", from: { z:  700, y:  300, opacity: 0 } },
	"slide-in-bck-left":   { ...defaults, name: "slide-in-bck-left",   from: { z:  700, x: -400, opacity: 0 } },
	"slide-in-bck-tr":     { ...defaults, name: "slide-in-bck-tr",     from: { z:  700, y: -300, x:  400, opacity: 0 } },
	"slide-in-bck-br":     { ...defaults, name: "slide-in-bck-br",     from: { z:  700, y:  300, x:  400, opacity: 0 } },
	"slide-in-bck-bl":     { ...defaults, name: "slide-in-bck-bl",     from: { z:  700, y:  300, x: -400, opacity: 0 } },
	"slide-in-bck-tl":     { ...defaults, name: "slide-in-bck-tl",     from: { z:  700, y: -300, x: -400, opacity: 0 } },
}

export default slideInBck
