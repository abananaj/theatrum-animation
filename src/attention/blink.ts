import type { AnimationConfig } from "../config/animationConfigs"

const blinkDefaults = { duration: 800, ease: "power1.inOut", repeat: -1, yoyo: true }

const blink: Record<string, AnimationConfig> = {
	"blink-1": { ...blinkDefaults, name: "blink-1", to: { opacity: 0 } },
	"blink-2": { ...blinkDefaults, name: "blink-2", to: { opacity: 0.2 } },
}

export default blink
