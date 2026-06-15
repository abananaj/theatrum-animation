import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power1.out" }

const slideFwd: Record<string, AnimationConfig> = {
	"slide-fwd-center": { ...defaults, name: "slide-fwd-center", to: { z:  160 } },
	"slide-fwd-top":    { ...defaults, name: "slide-fwd-top",    to: { z:  160, y: -100 } },
	"slide-fwd-right":  { ...defaults, name: "slide-fwd-right",  to: { z:  160, x:  100 } },
	"slide-fwd-bottom": { ...defaults, name: "slide-fwd-bottom", to: { z:  160, y:  100 } },
	"slide-fwd-left":   { ...defaults, name: "slide-fwd-left",   to: { z:  160, x: -100 } },
	"slide-fwd-tl":     { ...defaults, name: "slide-fwd-tl",     to: { z:  160, y: -100, x: -100 } },
	"slide-fwd-tr":     { ...defaults, name: "slide-fwd-tr",     to: { z:  160, y: -100, x:  100 } },
	"slide-fwd-bl":     { ...defaults, name: "slide-fwd-bl",     to: { z:  160, y:  100, x: -100 } },
	"slide-fwd-br":     { ...defaults, name: "slide-fwd-br",     to: { z:  160, y:  100, x:  100 } },
}

export default slideFwd
