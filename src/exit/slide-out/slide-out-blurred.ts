import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 800, ease: "power2.in" }

const slideOutBlurred: Record<string, AnimationConfig> = {
	"slide-out-blurred-top":    { ...defaults, name: "slide-out-blurred-top",    to: { y: -1000, scaleY: 2, scaleX: 0.2, transformOrigin: "50% 0",    filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-bottom": { ...defaults, name: "slide-out-blurred-bottom", to: { y:  1000, scaleY: 2, scaleX: 0.2, transformOrigin: "50% 100%", filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-left":   { ...defaults, name: "slide-out-blurred-left",   to: { x: -1000, scaleX: 2, scaleY: 0.2, transformOrigin: "100% 50%", filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-right":  { ...defaults, name: "slide-out-blurred-right",  to: { x:  1000, scaleX: 2, scaleY: 0.2, transformOrigin: "0 50%",    filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-tl":     { ...defaults, name: "slide-out-blurred-tl",     to: { x: -1000, y: -1000, skewX:  80, skewY:  10, transformOrigin: "100% 0",    filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-tr":     { ...defaults, name: "slide-out-blurred-tr",     to: { x:  1000, y: -1000, skewX: -80, skewY: -10, transformOrigin: "0 0",       filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-bl":     { ...defaults, name: "slide-out-blurred-bl",     to: { x: -1000, y:  1000, skewX: -80, skewY: -10, transformOrigin: "100% 100%", filter: "blur(40px)", opacity: 0 } },
	"slide-out-blurred-br":     { ...defaults, name: "slide-out-blurred-br",     to: { x:  1000, y:  1000, skewX:  80, skewY:  10, transformOrigin: "0 100%",    filter: "blur(40px)", opacity: 0 } },
}

export default slideOutBlurred
