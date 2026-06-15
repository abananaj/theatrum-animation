import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power1.out" }

const shadowDropMax: Record<string, AnimationConfig> = {
	"shadow-drop-2-center": { ...defaults, name: "shadow-drop-2-center", to: { z:  50,               boxShadow: "0 0 20px 0 rgba(0,0,0,.35)" } },
	"shadow-drop-2-top":    { ...defaults, name: "shadow-drop-2-top",    to: { z:  50, y:  12,        boxShadow: "0 -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-right":  { ...defaults, name: "shadow-drop-2-right",  to: { z:  50, x: -12,        boxShadow: "12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-bottom": { ...defaults, name: "shadow-drop-2-bottom", to: { z:  50, y: -12,        boxShadow: "0 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-left":   { ...defaults, name: "shadow-drop-2-left",   to: { z:  50, x:  12,        boxShadow: "-12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-tl":     { ...defaults, name: "shadow-drop-2-tl",     to: { z:  50, x:  12, y: 12, boxShadow: "-12px -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-tr":     { ...defaults, name: "shadow-drop-2-tr",     to: { z:  50, x: -12, y: 12, boxShadow: "12px -12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-bl":     { ...defaults, name: "shadow-drop-2-bl",     to: { z:  50, x:  12, y: -12, boxShadow: "-12px 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-br":     { ...defaults, name: "shadow-drop-2-br",     to: { z:  50, x: -12, y: -12, boxShadow: "12px 12px 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-lr":     { ...defaults, name: "shadow-drop-2-lr",     to: { z:  50,               boxShadow: "-12px 0 20px -12px rgba(0,0,0,.35), 12px 0 20px -12px rgba(0,0,0,.35)" } },
	"shadow-drop-2-tb":     { ...defaults, name: "shadow-drop-2-tb",     to: { z:  50,               boxShadow: "0 -12px 20px -12px rgba(0,0,0,.35), 0 12px 20px -12px rgba(0,0,0,.35)" } },
}

export default shadowDropMax
