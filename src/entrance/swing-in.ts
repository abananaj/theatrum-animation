import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.out" }

const swingIn: Record<string, AnimationConfig> = {
	"swing-in-top-fwd":    { ...defaults, name: "swing-in-top-fwd",    from: { rotateX: -100, transformOrigin: "top",    opacity: 0 } },
	"swing-in-top-bck":    { ...defaults, name: "swing-in-top-bck",    from: { rotateX:   70, transformOrigin: "top",    opacity: 0 } },
	"swing-in-left-fwd":   { ...defaults, name: "swing-in-left-fwd",   from: { rotateY:  100, transformOrigin: "left",   opacity: 0 } },
	"swing-in-left-bck":   { ...defaults, name: "swing-in-left-bck",   from: { rotateY:  -70, transformOrigin: "left",   opacity: 0 } },
	"swing-in-right-fwd":  { ...defaults, name: "swing-in-right-fwd",  from: { rotateY: -100, transformOrigin: "right",  opacity: 0 } },
	"swing-in-right-bck":  { ...defaults, name: "swing-in-right-bck",  from: { rotateY:   70, transformOrigin: "right",  opacity: 0 } },
	"swing-in-bottom-fwd": { ...defaults, name: "swing-in-bottom-fwd", from: { rotateX:  100, transformOrigin: "bottom", opacity: 0 } },
	"swing-in-bottom-bck": { ...defaults, name: "swing-in-bottom-bck", from: { rotateX:  -70, transformOrigin: "bottom", opacity: 0 } },
}

export default swingIn
