import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.out" }

const puffIn: Record<string, AnimationConfig> = {
	"puff-in-center": { ...defaults, name: "puff-in-center", from: { scale: 2,  filter: "blur(4px)", opacity: 0 } },
	"puff-in-top":    { ...defaults, name: "puff-in-top",    from: { scale: 2,  filter: "blur(4px)", transformOrigin: "50% 0",    opacity: 0 } },
	"puff-in-bottom": { ...defaults, name: "puff-in-bottom", from: { scale: 2,  filter: "blur(4px)", transformOrigin: "50% 100%", opacity: 0 } },
	"puff-in-left":   { ...defaults, name: "puff-in-left",   from: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 50%",    opacity: 0 } },
	"puff-in-right":  { ...defaults, name: "puff-in-right",  from: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 50%", opacity: 0 } },
	"puff-in-tl":     { ...defaults, name: "puff-in-tl",     from: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 0",      opacity: 0 } },
	"puff-in-tr":     { ...defaults, name: "puff-in-tr",     from: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 0",   opacity: 0 } },
	"puff-in-bl":     { ...defaults, name: "puff-in-bl",     from: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 100%",   opacity: 0 } },
	"puff-in-br":     { ...defaults, name: "puff-in-br",     from: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 100%",opacity: 0 } },
	"puff-in-ver":    { ...defaults, name: "puff-in-ver",    from: { scaleY: 2, filter: "blur(4px)", opacity: 0 } },
	"puff-in-hor":    { ...defaults, name: "puff-in-hor",    from: { scaleX: 2, filter: "blur(4px)", opacity: 0 } },
}

export default puffIn
