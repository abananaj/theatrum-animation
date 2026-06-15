import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power1.out" }

const shadowDrop: Record<string, AnimationConfig> = {
	"shadow-drop-center": { ...defaults, name: "shadow-drop-center", to: { boxShadow: "0 0 20px 0 rgba(0,0,0,.35)" } },
	"shadow-drop-top":    { ...defaults, name: "shadow-drop-top",    to: { boxShadow: "0 -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-right":  { ...defaults, name: "shadow-drop-right",  to: { boxShadow: "12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-bottom": { ...defaults, name: "shadow-drop-bottom", to: { boxShadow: "0 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-left":   { ...defaults, name: "shadow-drop-left",   to: { boxShadow: "-12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-tl":     { ...defaults, name: "shadow-drop-tl",     to: { boxShadow: "-12px -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-tr":     { ...defaults, name: "shadow-drop-tr",     to: { boxShadow: "12px -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-bl":     { ...defaults, name: "shadow-drop-bl",     to: { boxShadow: "-12px 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-br":     { ...defaults, name: "shadow-drop-br",     to: { boxShadow: "12px 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-lr":     { ...defaults, name: "shadow-drop-lr",     to: { boxShadow: "-12px 0 20px -12px rgba(0,0,0,.35), 12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-tb":     { ...defaults, name: "shadow-drop-tb",     to: { boxShadow: "0 -12px 20px -12px rgba(0,0,0,.35), 0 12px 20px -12px rgba(0,0,0,.35)" } },
}

export default shadowDrop
