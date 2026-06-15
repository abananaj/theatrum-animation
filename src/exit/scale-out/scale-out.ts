import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.in" }

const scaleOut: Record<string, AnimationConfig> = {
	"scale-out-center":     { ...defaults, name: "scale-out-center",     to: { scale: 0 } },
	"scale-out-top":        { ...defaults, name: "scale-out-top",        to: { scale: 0, transformOrigin: "50% 0" } },
	"scale-out-right":      { ...defaults, name: "scale-out-right",      to: { scale: 0, transformOrigin: "100% 50%" } },
	"scale-out-bottom":     { ...defaults, name: "scale-out-bottom",     to: { scale: 0, transformOrigin: "50% 100%" } },
	"scale-out-left":       { ...defaults, name: "scale-out-left",       to: { scale: 0, transformOrigin: "0 50%" } },
	"scale-out-tl":         { ...defaults, name: "scale-out-tl",         to: { scale: 0, transformOrigin: "0 0" } },
	"scale-out-tr":         { ...defaults, name: "scale-out-tr",         to: { scale: 0, transformOrigin: "100% 0" } },
	"scale-out-bl":         { ...defaults, name: "scale-out-bl",         to: { scale: 0, transformOrigin: "0 100%" } },
	"scale-out-br":         { ...defaults, name: "scale-out-br",         to: { scale: 0, transformOrigin: "100% 100%" } },
	"scale-out-horizontal": { ...defaults, name: "scale-out-horizontal", to: { scaleX: 0 } },
	"scale-out-vertical":   { ...defaults, name: "scale-out-vertical",   to: { scaleY: 0 } },
	"scale-out-ver-top":    { ...defaults, name: "scale-out-ver-top",    to: { scaleY: 0, transformOrigin: "100% 0" } },
	"scale-out-ver-bottom": { ...defaults, name: "scale-out-ver-bottom", to: { scaleY: 0, transformOrigin: "0 100%" } },
	"scale-out-hor-right":  { ...defaults, name: "scale-out-hor-right",  to: { scaleX: 0, transformOrigin: "100% 100%" } },
	"scale-out-hor-left":   { ...defaults, name: "scale-out-hor-left",   to: { scaleX: 0, transformOrigin: "0 0" } },
}

export default scaleOut
