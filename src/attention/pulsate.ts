import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 500, ease: "power1.inOut", repeat: -1, yoyo: true }

const pulsate: Record<string, AnimationConfig> = {
	"pulsate-fwd": { ...defaults, name: "pulsate-fwd", to: { scale: 1.1 } },
	"pulsate-bck": { ...defaults, name: "pulsate-bck", to: { scale: 0.9 } },
}

export default pulsate
