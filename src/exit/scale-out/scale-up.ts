import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power2.out" }

const scaleUp: Record<string, AnimationConfig> = {
	"scale-up-center":     { ...defaults, name: "scale-up-center",     from: { scale: 0.5 } },
	"scale-up-top":        { ...defaults, name: "scale-up-top",        from: { scale: 0.5, transformOrigin: "50% 0" } },
	"scale-up-right":      { ...defaults, name: "scale-up-right",      from: { scale: 0.5, transformOrigin: "100% 50%" } },
	"scale-up-bottom":     { ...defaults, name: "scale-up-bottom",     from: { scale: 0.5, transformOrigin: "50% 100%" } },
	"scale-up-left":       { ...defaults, name: "scale-up-left",       from: { scale: 0.5, transformOrigin: "0 50%" } },
	"scale-up-tl":         { ...defaults, name: "scale-up-tl",         from: { scale: 0.5, transformOrigin: "0 0" } },
	"scale-up-tr":         { ...defaults, name: "scale-up-tr",         from: { scale: 0.5, transformOrigin: "100% 0" } },
	"scale-up-bl":         { ...defaults, name: "scale-up-bl",         from: { scale: 0.5, transformOrigin: "0 100%" } },
	"scale-up-br":         { ...defaults, name: "scale-up-br",         from: { scale: 0.5, transformOrigin: "100% 100%" } },
	"scale-up-hor-center": { ...defaults, name: "scale-up-hor-center", from: { scaleX: 0.4 } },
	"scale-up-hor-left":   { ...defaults, name: "scale-up-hor-left",   from: { scaleX: 0.4, transformOrigin: "0 0" } },
	"scale-up-hor-right":  { ...defaults, name: "scale-up-hor-right",  from: { scaleX: 0.4, transformOrigin: "100% 100%" } },
	"scale-up-ver-center": { ...defaults, name: "scale-up-ver-center", from: { scaleY: 0.4 } },
	"scale-up-ver-top":    { ...defaults, name: "scale-up-ver-top",    from: { scaleY: 0.4, transformOrigin: "100% 0" } },
	"scale-up-ver-bottom": { ...defaults, name: "scale-up-ver-bottom", from: { scaleY: 0.4, transformOrigin: "0 100%" } },
}

export default scaleUp
