import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power2.in" }

const scaleDown: Record<string, AnimationConfig> = {
	"scale-down-center":     { ...defaults, name: "scale-down-center",     to: { scale: 0.5 } },
	"scale-down-top":        { ...defaults, name: "scale-down-top",        to: { scale: 0.5, transformOrigin: "50% 0" } },
	"scale-down-right":      { ...defaults, name: "scale-down-right",      to: { scale: 0.5, transformOrigin: "100% 50%" } },
	"scale-down-bottom":     { ...defaults, name: "scale-down-bottom",     to: { scale: 0.5, transformOrigin: "50% 100%" } },
	"scale-down-left":       { ...defaults, name: "scale-down-left",       to: { scale: 0.5, transformOrigin: "0 50%" } },
	"scale-down-tl":         { ...defaults, name: "scale-down-tl",         to: { scale: 0.5, transformOrigin: "0 0" } },
	"scale-down-tr":         { ...defaults, name: "scale-down-tr",         to: { scale: 0.5, transformOrigin: "100% 0" } },
	"scale-down-bl":         { ...defaults, name: "scale-down-bl",         to: { scale: 0.5, transformOrigin: "0 100%" } },
	"scale-down-br":         { ...defaults, name: "scale-down-br",         to: { scale: 0.5, transformOrigin: "100% 100%" } },
	"scale-down-hor-center": { ...defaults, name: "scale-down-hor-center", to: { scaleX: 0.3 } },
	"scale-down-hor-left":   { ...defaults, name: "scale-down-hor-left",   to: { scaleX: 0.3, transformOrigin: "0 0" } },
	"scale-down-hor-right":  { ...defaults, name: "scale-down-hor-right",  to: { scaleX: 0.3, transformOrigin: "100% 100%" } },
	"scale-down-ver-center": { ...defaults, name: "scale-down-ver-center", to: { scaleY: 0.3 } },
	"scale-down-ver-top":    { ...defaults, name: "scale-down-ver-top",    to: { scaleY: 0.3, transformOrigin: "100% 0" } },
	"scale-down-ver-bottom": { ...defaults, name: "scale-down-ver-bottom", to: { scaleY: 0.3, transformOrigin: "0 100%" } },
}

export default scaleDown
