import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power2.in" }

const puffOut: Record<string, AnimationConfig> = {
	"puff-out-center": { ...defaults, name: "puff-out-center", to: { scale: 2,  filter: "blur(4px)", opacity: 0 } },
	"puff-out-top":    { ...defaults, name: "puff-out-top",    to: { scale: 2,  filter: "blur(4px)", transformOrigin: "50% 0",    opacity: 0 } },
	"puff-out-right":  { ...defaults, name: "puff-out-right",  to: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 50%", opacity: 0 } },
	"puff-out-left":   { ...defaults, name: "puff-out-left",   to: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 50%",    opacity: 0 } },
	"puff-out-tl":     { ...defaults, name: "puff-out-tl",     to: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 0",      opacity: 0 } },
	"puff-out-tr":     { ...defaults, name: "puff-out-tr",     to: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 0",   opacity: 0 } },
	"puff-out-bl":     { ...defaults, name: "puff-out-bl",     to: { scale: 2,  filter: "blur(4px)", transformOrigin: "0 100%",   opacity: 0 } },
	"puff-out-br":     { ...defaults, name: "puff-out-br",     to: { scale: 2,  filter: "blur(4px)", transformOrigin: "100% 100%",opacity: 0 } },
	"puff-out-ver":    { ...defaults, name: "puff-out-ver",    to: { scaleY: 2, filter: "blur(4px)", opacity: 0 } },
	"puff-out-hor":    { ...defaults, name: "puff-out-hor",    to: { scaleX: 2, filter: "blur(4px)", opacity: 0 } },
}

export default puffOut
