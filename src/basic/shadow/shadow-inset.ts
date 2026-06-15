import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power1.out" }

const shadowInset: Record<string, AnimationConfig> = {
	"shadow-inset-center": { ...defaults, name: "shadow-inset-center", to: { boxShadow: "inset 0 0 14px 0 rgba(0,0,0,.5)" } },
	"shadow-inset-top":    { ...defaults, name: "shadow-inset-top",    to: { boxShadow: "inset 0 6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-right":  { ...defaults, name: "shadow-inset-right",  to: { boxShadow: "inset -6px 0 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-bottom": { ...defaults, name: "shadow-inset-bottom", to: { boxShadow: "inset 0 -6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-left":   { ...defaults, name: "shadow-inset-left",   to: { boxShadow: "inset 6px 0 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-tl":     { ...defaults, name: "shadow-inset-tl",     to: { boxShadow: "inset 6px 6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-tr":     { ...defaults, name: "shadow-inset-tr",     to: { boxShadow: "inset -6px 6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-bl":     { ...defaults, name: "shadow-inset-bl",     to: { boxShadow: "inset 6px -6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-br":     { ...defaults, name: "shadow-inset-br",     to: { boxShadow: "inset -6px -6px 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-lr":     { ...defaults, name: "shadow-inset-lr",     to: { boxShadow: "inset -6px 0 14px -6px rgba(0,0,0,.5), inset 6px 0 14px -6px rgba(0,0,0,.5)" } },
	"shadow-inset-tb":     { ...defaults, name: "shadow-inset-tb",     to: { boxShadow: "inset 0 -6px 14px -6px rgba(0,0,0,.5), inset 0 6px 14px -6px rgba(0,0,0,.5)" } },
}

export default shadowInset
