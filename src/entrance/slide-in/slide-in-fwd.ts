import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.out" }

const slideInFwd: Record<string, AnimationConfig> = {
	"slide-in-fwd-center": { ...defaults, name: "slide-in-fwd-center", from: { z: -1400, opacity: 0 } },
	"slide-in-fwd-top":    { ...defaults, name: "slide-in-fwd-top",    from: { z: -1400, y: -800, opacity: 0 } },
	"slide-in-fwd-right":  { ...defaults, name: "slide-in-fwd-right",  from: { z: -1400, x:  1000, opacity: 0 } },
	"slide-in-fwd-bottom": { ...defaults, name: "slide-in-fwd-bottom", from: { z: -1400, y:  800, opacity: 0 } },
	"slide-in-fwd-left":   { ...defaults, name: "slide-in-fwd-left",   from: { z: -1400, x: -1000, opacity: 0 } },
	"slide-in-fwd-tr":     { ...defaults, name: "slide-in-fwd-tr",     from: { z: -1400, y: -800, x:  1000, opacity: 0 } },
	"slide-in-fwd-br":     { ...defaults, name: "slide-in-fwd-br",     from: { z: -1400, y:  800, x:  1000, opacity: 0 } },
	"slide-in-fwd-bl":     { ...defaults, name: "slide-in-fwd-bl",     from: { z: -1400, y:  800, x: -1000, opacity: 0 } },
	"slide-in-fwd-tl":     { ...defaults, name: "slide-in-fwd-tl",     from: { z: -1400, y: -800, x: -1000, opacity: 0 } },
}

export default slideInFwd
