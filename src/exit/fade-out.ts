import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power1.in" }

const fadeOut: Record<string, AnimationConfig> = {
	"fade-out-top":    { ...defaults, name: "fade-out-top",    to: { y:  -50, opacity: 0 } },
	"fade-out-right":  { ...defaults, name: "fade-out-right",  to: { x:   50, opacity: 0 } },
	"fade-out-bottom": { ...defaults, name: "fade-out-bottom", to: { y:   50, opacity: 0 } },
	"fade-out-left":   { ...defaults, name: "fade-out-left",   to: { x:  -50, opacity: 0 } },
	"fade-out-tl":     { ...defaults, name: "fade-out-tl",     to: { x:  -50, y:  -50, opacity: 0 } },
	"fade-out-tr":     { ...defaults, name: "fade-out-tr",     to: { x:   50, y:  -50, opacity: 0 } },
	"fade-out-bl":     { ...defaults, name: "fade-out-bl",     to: { x:  -50, y:   50, opacity: 0 } },
	"fade-out-br":     { ...defaults, name: "fade-out-br",     to: { x:   50, y:   50, opacity: 0 } },
	"fade-out-fwd":    { ...defaults, name: "fade-out-fwd",    to: { z:   80, opacity: 0 } },
	"fade-out-bck":    { ...defaults, name: "fade-out-bck",    to: { z:  -80, opacity: 0 } },
}

export default fadeOut
