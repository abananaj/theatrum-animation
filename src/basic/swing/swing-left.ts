import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.inOut" }

const swingLeft: Record<string, AnimationConfig> = {
	"swing-left-fwd": { ...defaults, name: "swing-left-fwd", to: { rotateY: -180, transformOrigin: "left bottom" } },
	"swing-left-bck": { ...defaults, name: "swing-left-bck", to: { rotateY:  180, transformOrigin: "left bottom" } },
}

export default swingLeft
