import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 800, ease: "power1.inOut", repeat: -1, yoyo: true }

// `attn-` prefix: basic/scale owns the plain `scale-up-*` classes.
const scaleUp: Record<string, AnimationConfig> = {
	"attn-scale-up-center":     { ...defaults, name: "attn-scale-up-center",     from: { scale: 0.5 } },
	"attn-scale-up-top":        { ...defaults, name: "attn-scale-up-top",        from: { scale: 0.5, transformOrigin: "50% 0" } },
	"attn-scale-up-right":      { ...defaults, name: "attn-scale-up-right",      from: { scale: 0.5, transformOrigin: "100% 50%" } },
	"attn-scale-up-bottom":     { ...defaults, name: "attn-scale-up-bottom",     from: { scale: 0.5, transformOrigin: "50% 100%" } },
	"attn-scale-up-left":       { ...defaults, name: "attn-scale-up-left",       from: { scale: 0.5, transformOrigin: "0 50%" } },
	"attn-scale-up-tl":         { ...defaults, name: "attn-scale-up-tl",         from: { scale: 0.5, transformOrigin: "0 0" } },
	"attn-scale-up-tr":         { ...defaults, name: "attn-scale-up-tr",         from: { scale: 0.5, transformOrigin: "100% 0" } },
	"attn-scale-up-bl":         { ...defaults, name: "attn-scale-up-bl",         from: { scale: 0.5, transformOrigin: "0 100%" } },
	"attn-scale-up-br":         { ...defaults, name: "attn-scale-up-br",         from: { scale: 0.5, transformOrigin: "100% 100%" } },
	"attn-scale-up-hor-center": { ...defaults, name: "attn-scale-up-hor-center", from: { scaleX: 0.4 } },
	"attn-scale-up-hor-left":   { ...defaults, name: "attn-scale-up-hor-left",   from: { scaleX: 0.4, transformOrigin: "0 0" } },
	"attn-scale-up-hor-right":  { ...defaults, name: "attn-scale-up-hor-right",  from: { scaleX: 0.4, transformOrigin: "100% 100%" } },
	"attn-scale-up-ver-center": { ...defaults, name: "attn-scale-up-ver-center", from: { scaleY: 0.4 } },
	"attn-scale-up-ver-top":    { ...defaults, name: "attn-scale-up-ver-top",    from: { scaleY: 0.4, transformOrigin: "100% 0" } },
	"attn-scale-up-ver-bottom": { ...defaults, name: "attn-scale-up-ver-bottom", from: { scaleY: 0.4, transformOrigin: "0 100%" } },
}

export default scaleUp
