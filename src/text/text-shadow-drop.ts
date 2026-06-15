import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 400, ease: "power1.out" }

const textShadowDrop: Record<string, AnimationConfig> = {
	"text-shadow-drop-center": { ...defaults, name: "text-shadow-drop-center", to: { textShadow: "0 0 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-top":    { ...defaults, name: "text-shadow-drop-top",    to: { textShadow: "0 -6px 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-right":  { ...defaults, name: "text-shadow-drop-right",  to: { textShadow: "6px 0 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-bottom": { ...defaults, name: "text-shadow-drop-bottom", to: { textShadow: "0 6px 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-left":   { ...defaults, name: "text-shadow-drop-left",   to: { textShadow: "-6px 0 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-tl":     { ...defaults, name: "text-shadow-drop-tl",     to: { textShadow: "-6px -6px 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-tr":     { ...defaults, name: "text-shadow-drop-tr",     to: { textShadow: "6px -6px 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-bl":     { ...defaults, name: "text-shadow-drop-bl",     to: { textShadow: "-6px 6px 18px rgba(0,0,0,.35)" } },
	"text-shadow-drop-br":     { ...defaults, name: "text-shadow-drop-br",     to: { textShadow: "6px 6px 18px rgba(0,0,0,.35)" } },
}

export default textShadowDrop
