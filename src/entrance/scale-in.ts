import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.out" }

const scaleIn: Record<string, AnimationConfig> = {
	"scale-in-center":     { ...defaults, name: "scale-in-center",     from: { scale: 0 } },
	"scale-in-top":        { ...defaults, name: "scale-in-top",        from: { scale: 0, transformOrigin: "50% 0" } },
	"scale-in-bottom":     { ...defaults, name: "scale-in-bottom",     from: { scale: 0, transformOrigin: "50% 100%" } },
	"scale-in-left":       { ...defaults, name: "scale-in-left",       from: { scale: 0, transformOrigin: "0 50%" } },
	"scale-in-right":      { ...defaults, name: "scale-in-right",      from: { scale: 0, transformOrigin: "100% 50%" } },
	"scale-in-tl":         { ...defaults, name: "scale-in-tl",         from: { scale: 0, transformOrigin: "0 0" } },
	"scale-in-tr":         { ...defaults, name: "scale-in-tr",         from: { scale: 0, transformOrigin: "100% 0" } },
	"scale-in-bl":         { ...defaults, name: "scale-in-bl",         from: { scale: 0, transformOrigin: "0 100%" } },
	"scale-in-br":         { ...defaults, name: "scale-in-br",         from: { scale: 0, transformOrigin: "100% 100%" } },
	"scale-in-ver-top":    { ...defaults, name: "scale-in-ver-top",    from: { scaleY: 0, transformOrigin: "100% 0" } },
	"scale-in-ver-center": { ...defaults, name: "scale-in-ver-center", from: { scaleY: 0 } },
	"scale-in-ver-bottom": { ...defaults, name: "scale-in-ver-bottom", from: { scaleY: 0, transformOrigin: "0 100%" } },
	"scale-in-hor-center": { ...defaults, name: "scale-in-hor-center", from: { scaleX: 0 } },
	"scale-in-hor-left":   { ...defaults, name: "scale-in-hor-left",   from: { scaleX: 0, transformOrigin: "0 0" } },
	"scale-in-hor-right":  { ...defaults, name: "scale-in-hor-right",  from: { scaleX: 0, transformOrigin: "100% 100%" } },
}

export default scaleIn
