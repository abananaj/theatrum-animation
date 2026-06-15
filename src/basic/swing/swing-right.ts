import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.inOut" }

const swingRight: Record<string, AnimationConfig> = {
	"swing-right-fwd": { ...defaults, name: "swing-right-fwd", to: { rotateY:  180, transformOrigin: "right" } },
	"swing-right-bck": { ...defaults, name: "swing-right-bck", to: { rotateY: -180, transformOrigin: "right" } },
}

export default swingRight
