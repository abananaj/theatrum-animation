import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 700, ease: "power1.out" }

const fadeIn: Record<string, AnimationConfig> = {
	"fade-in":        { ...defaults, name: "fade-in",        from: { opacity: 0 } },
	"fade-in-top":    { ...defaults, name: "fade-in-top",    from: { y: -50, opacity: 0 } },
	"fade-in-bottom": { ...defaults, name: "fade-in-bottom", from: { y:  50, opacity: 0 } },
	"fade-in-left":   { ...defaults, name: "fade-in-left",   from: { x: -50, opacity: 0 } },
	"fade-in-right":  { ...defaults, name: "fade-in-right",  from: { x:  50, opacity: 0 } },
	"fade-in-tl":     { ...defaults, name: "fade-in-tl",     from: { x: -50, y: -50, opacity: 0 } },
	"fade-in-tr":     { ...defaults, name: "fade-in-tr",     from: { x:  50, y: -50, opacity: 0 } },
	"fade-in-bl":     { ...defaults, name: "fade-in-bl",     from: { x: -50, y:  50, opacity: 0 } },
	"fade-in-br":     { ...defaults, name: "fade-in-br",     from: { x:  50, y:  50, opacity: 0 } },
	"fade-in-fwd":    { ...defaults, name: "fade-in-fwd",    from: { z: -80, opacity: 0 } },
	"fade-in-bck":    { ...defaults, name: "fade-in-bck",    from: { z:  80, opacity: 0 } },
}

export default fadeIn
