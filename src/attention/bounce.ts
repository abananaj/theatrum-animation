import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 1000, ease: "bounce.out", repeat: -1, yoyo: true }

const bounce: Record<string, AnimationConfig> = {
	"bounce-top":    { ...defaults, name: "bounce-top",    from: { y: -45 } },
	"bounce-bottom": { ...defaults, name: "bounce-bottom", from: { y:  45 } },
	"bounce-left":   { ...defaults, name: "bounce-left",   from: { x: -48 } },
	"bounce-right":  { ...defaults, name: "bounce-right",  from: { x:  48 } },
}

export default bounce
