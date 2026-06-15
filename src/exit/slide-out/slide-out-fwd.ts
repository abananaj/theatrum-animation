import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.in" }

const slideOutFwd: Record<string, AnimationConfig> = {
	"slide-out-fwd-center": { ...defaults, name: "slide-out-fwd-center", to: { z:  600, opacity: 0 } },
	"slide-out-fwd-top":    { ...defaults, name: "slide-out-fwd-top",    to: { z:  600, y: -300, opacity: 0 } },
	"slide-out-fwd-right":  { ...defaults, name: "slide-out-fwd-right",  to: { z:  600, x:  400, opacity: 0 } },
	"slide-out-fwd-bottom": { ...defaults, name: "slide-out-fwd-bottom", to: { z:  600, y:  300, opacity: 0 } },
	"slide-out-fwd-left":   { ...defaults, name: "slide-out-fwd-left",   to: { z:  600, x: -400, opacity: 0 } },
	"slide-out-fwd-tl":     { ...defaults, name: "slide-out-fwd-tl",     to: { z:  600, y: -300, x: -400, opacity: 0 } },
	"slide-out-fwd-tr":     { ...defaults, name: "slide-out-fwd-tr",     to: { z:  600, y: -300, x:  400, opacity: 0 } },
	"slide-out-fwd-bl":     { ...defaults, name: "slide-out-fwd-bl",     to: { z:  600, y:  300, x: -400, opacity: 0 } },
	"slide-out-fwd-br":     { ...defaults, name: "slide-out-fwd-br",     to: { z:  600, y:  300, x:  400, opacity: 0 } },
}

export default slideOutFwd
