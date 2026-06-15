import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.in" }

const swingOut: Record<string, AnimationConfig> = {
	"swing-out-top-fwd":    { ...defaults, name: "swing-out-top-fwd",    to: { rotateX:   70, transformOrigin: "top",    opacity: 0 } },
	"swing-out-top-bck":    { ...defaults, name: "swing-out-top-bck",    to: { rotateX: -100, transformOrigin: "top",    opacity: 0 } },
	"swing-out-right-fwd":  { ...defaults, name: "swing-out-right-fwd",  to: { rotateY:   70, transformOrigin: "right",  opacity: 0 } },
	"swing-out-right-bck":  { ...defaults, name: "swing-out-right-bck",  to: { rotateY: -100, transformOrigin: "right",  opacity: 0 } },
	"swing-out-left-fwd":   { ...defaults, name: "swing-out-left-fwd",   to: { rotateY:  -70, transformOrigin: "left",   opacity: 0 } },
	"swing-out-left-bck":   { ...defaults, name: "swing-out-left-bck",   to: { rotateY:  100, transformOrigin: "left",   opacity: 0 } },
	"swing-out-bottom-fwd": { ...defaults, name: "swing-out-bottom-fwd", to: { rotateX:  -70, transformOrigin: "bottom", opacity: 0 } },
	"swing-out-bottom-bck": { ...defaults, name: "swing-out-bottom-bck", to: { rotateX:  100, transformOrigin: "bottom", opacity: 0 } },
}

export default swingOut
