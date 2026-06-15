import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.inOut" }

const swingBottom: Record<string, AnimationConfig> = {
	"swing-bottom-fwd":       { ...defaults, name: "swing-bottom-fwd",       to: { rotateX: -180, transformOrigin: "bottom" } },
	"swing-bottom-bck":       { ...defaults, name: "swing-bottom-bck",       to: { rotateX:  180, transformOrigin: "bottom" } },
	"swing-bottom-left-fwd":  { ...defaults, name: "swing-bottom-left-fwd",  to: { rotateX: -90, rotateY:  90, transformOrigin: "0 100%" } },
	"swing-bottom-left-bck":  { ...defaults, name: "swing-bottom-left-bck",  to: { rotateX:  90, rotateY:  90, transformOrigin: "0 100%" } },
	"swing-bottom-right-fwd": { ...defaults, name: "swing-bottom-right-fwd", to: { rotateX:  90, rotateY: -90, transformOrigin: "100% 100%" } },
	"swing-bottom-right-bck": { ...defaults, name: "swing-bottom-right-bck", to: { rotateX: -90, rotateY:  90, transformOrigin: "100% 100%" } },
}

export default swingBottom
