import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 800, ease: "power2.out" }

const slideInBlurred: Record<string, AnimationConfig> = {
	"slide-in-blurred-top":    { ...defaults, name: "slide-in-blurred-top",    from: { y: -1000, scaleY: 2.5, scaleX: 0.2, transformOrigin: "50% 0",    filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-tr":     { ...defaults, name: "slide-in-blurred-tr",     from: { x:  1000, y: -1000, skewX: -80, skewY: -10, transformOrigin: "0 0",      filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-right":  { ...defaults, name: "slide-in-blurred-right",  from: { x:  1000, scaleX: 2.5, scaleY: 0.2, transformOrigin: "0 50%",    filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-br":     { ...defaults, name: "slide-in-blurred-br",     from: { x:  1000, y:  1000, skewX:  80, skewY:  10, transformOrigin: "0 100%",   filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-bottom": { ...defaults, name: "slide-in-blurred-bottom", from: { y:  1000, scaleY: 2.5, scaleX: 0.2, transformOrigin: "50% 100%", filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-bl":     { ...defaults, name: "slide-in-blurred-bl",     from: { x: -1000, y:  1000, skewX: -80, skewY: -10, transformOrigin: "100% 100%",filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-left":   { ...defaults, name: "slide-in-blurred-left",   from: { x: -1000, scaleX: 2.5, scaleY: 0.2, transformOrigin: "100% 50%", filter: "blur(40px)", opacity: 0 } },
	"slide-in-blurred-tl":     { ...defaults, name: "slide-in-blurred-tl",     from: { x: -1000, y: -1000, skewX:  80, skewY:  10, transformOrigin: "100% 0",   filter: "blur(40px)", opacity: 0 } },
}

export default slideInBlurred
