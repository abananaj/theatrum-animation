import type { AnimationConfig } from "../config/animationConfigs"

const shadow = "0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc, 0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc, 0 9px 0 #ccc, 0 50px 30px rgba(0,0,0,.3)"
const defaults = { duration: 500, ease: "power1.out" }

const textPop: Record<string, AnimationConfig> = {
	"text-pop-up-top":    { ...defaults, name: "text-pop-up-top",    to: { y: -50, textShadow: shadow } },
	"text-pop-up-right":  { ...defaults, name: "text-pop-up-right",  to: { x:  50, textShadow: shadow } },
	"text-pop-up-bottom": { ...defaults, name: "text-pop-up-bottom", to: { y:  50, textShadow: shadow } },
	"text-pop-up-left":   { ...defaults, name: "text-pop-up-left",   to: { x: -50, textShadow: shadow } },
	"text-pop-up-tl":     { ...defaults, name: "text-pop-up-tl",     to: { x: -50, y: -50, textShadow: shadow } },
	"text-pop-up-tr":     { ...defaults, name: "text-pop-up-tr",     to: { x:  50, y: -50, textShadow: shadow } },
	"text-pop-up-bl":     { ...defaults, name: "text-pop-up-bl",     to: { x: -50, y:  50, textShadow: shadow } },
	"text-pop-up-br":     { ...defaults, name: "text-pop-up-br",     to: { x:  50, y:  50, textShadow: shadow } },
}

export default textPop
