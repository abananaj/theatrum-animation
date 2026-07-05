import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 800, ease: "power1.inOut", repeat: -1, yoyo: true }

// `attn-` prefix: basic/scale owns the plain `scale-down-*` classes.
const scaleDown: Record<string, AnimationConfig> = {
	"attn-scale-down-center":     { ...defaults, name: "attn-scale-down-center",     to: { scale: 0.5 } },
	"attn-scale-down-top":        { ...defaults, name: "attn-scale-down-top",        to: { scale: 0.5, transformOrigin: "50% 0" } },
	"attn-scale-down-right":      { ...defaults, name: "attn-scale-down-right",      to: { scale: 0.5, transformOrigin: "100% 50%" } },
	"attn-scale-down-bottom":     { ...defaults, name: "attn-scale-down-bottom",     to: { scale: 0.5, transformOrigin: "50% 100%" } },
	"attn-scale-down-left":       { ...defaults, name: "attn-scale-down-left",       to: { scale: 0.5, transformOrigin: "0 50%" } },
	"attn-scale-down-tl":         { ...defaults, name: "attn-scale-down-tl",         to: { scale: 0.5, transformOrigin: "0 0" } },
	"attn-scale-down-tr":         { ...defaults, name: "attn-scale-down-tr",         to: { scale: 0.5, transformOrigin: "100% 0" } },
	"attn-scale-down-bl":         { ...defaults, name: "attn-scale-down-bl",         to: { scale: 0.5, transformOrigin: "0 100%" } },
	"attn-scale-down-br":         { ...defaults, name: "attn-scale-down-br",         to: { scale: 0.5, transformOrigin: "100% 100%" } },
	"attn-scale-down-hor-center": { ...defaults, name: "attn-scale-down-hor-center", to: { scaleX: 0.3 } },
	"attn-scale-down-hor-left":   { ...defaults, name: "attn-scale-down-hor-left",   to: { scaleX: 0.3, transformOrigin: "0 0" } },
	"attn-scale-down-hor-right":  { ...defaults, name: "attn-scale-down-hor-right",  to: { scaleX: 0.3, transformOrigin: "100% 100%" } },
	"attn-scale-down-ver-center": { ...defaults, name: "attn-scale-down-ver-center", to: { scaleY: 0.3 } },
	"attn-scale-down-ver-top":    { ...defaults, name: "attn-scale-down-ver-top",    to: { scaleY: 0.3, transformOrigin: "100% 0" } },
	"attn-scale-down-ver-bottom": { ...defaults, name: "attn-scale-down-ver-bottom", to: { scaleY: 0.3, transformOrigin: "0 100%" } },
}

export default scaleDown
