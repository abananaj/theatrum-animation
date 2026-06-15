import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.inOut" }

const swingTop: Record<string, AnimationConfig> = {
	"swing-top-fwd":       { ...defaults, name: "swing-top-fwd",       to: { rotateX:  180, transformOrigin: "top" } },
	"swing-top-bck":       { ...defaults, name: "swing-top-bck",       to: { rotateX: -180, transformOrigin: "top" } },
	"swing-top-left-fwd":  { ...defaults, name: "swing-top-left-fwd",  to: { rotateX: -90, rotateY:  90, transformOrigin: "0 0" } },
	"swing-top-left-bck":  { ...defaults, name: "swing-top-left-bck",  to: { rotateX:  90, rotateY: -90, transformOrigin: "0 0" } },
	"swing-top-right-fwd": { ...defaults, name: "swing-top-right-fwd", to: { rotateX:  90, rotateY:  90, transformOrigin: "100% 0" } },
	"swing-top-right-bck": { ...defaults, name: "swing-top-right-bck", to: { rotateX: -90, rotateY:  90, transformOrigin: "100% 0" } },
}

export default swingTop
