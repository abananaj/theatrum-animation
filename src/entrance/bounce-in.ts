import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 1100, ease: "bounce.out" }

const bounceIn: Record<string, AnimationConfig> = {
	"bounce-in-top":    { ...defaults, name: "bounce-in-top",    from: { y: -500, opacity: 0 } },
	"bounce-in-right":  { ...defaults, name: "bounce-in-right",  from: { x:  600, opacity: 0 } },
	"bounce-in-bottom": { ...defaults, name: "bounce-in-bottom", from: { y:  500, opacity: 0 } },
	"bounce-in-left":   { ...defaults, name: "bounce-in-left",   from: { x: -600, opacity: 0 } },
	"bounce-in-fwd":    { ...defaults, name: "bounce-in-fwd",    from: { scale: 0, opacity: 0 } },
	"bounce-in-bck":    { ...defaults, name: "bounce-in-bck",    from: { scale: 7, opacity: 0 } },
}

export default bounceIn
