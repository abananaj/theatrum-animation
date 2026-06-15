import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 800, ease: "power2.in" }

const slideOutElliptic: Record<string, AnimationConfig> = {
	"slide-out-elliptic-top-fwd":    { ...defaults, name: "slide-out-elliptic-top-fwd",    to: { y: -600, rotateX:  20, scale: 6,   transformOrigin: "50% 200%",  opacity: 0 } },
	"slide-out-elliptic-top-bck":    { ...defaults, name: "slide-out-elliptic-top-bck",    to: { y: -600, rotateX: -30, scale: 0,   transformOrigin: "50% 100%" } },
	"slide-out-elliptic-right-fwd":  { ...defaults, name: "slide-out-elliptic-right-fwd",  to: { x:  1000, rotateY:  20, scale: 6,  transformOrigin: "-100% 50%", opacity: 0 } },
	"slide-out-elliptic-right-bck":  { ...defaults, name: "slide-out-elliptic-right-bck",  to: { x:  1000, rotateY: -30, scale: 0,  transformOrigin: "-100% 50%" } },
	"slide-out-elliptic-bottom-fwd": { ...defaults, name: "slide-out-elliptic-bottom-fwd", to: { y:  600, rotateX: -20, scale: 6,   transformOrigin: "50% -100%", opacity: 0 } },
	"slide-out-elliptic-bottom-bck": { ...defaults, name: "slide-out-elliptic-bottom-bck", to: { y:  600, rotateX:  30, scale: 0,   transformOrigin: "50% 100%" } },
	"slide-out-elliptic-left-fwd":   { ...defaults, name: "slide-out-elliptic-left-fwd",   to: { x: -1000, rotateY: -20, scale: 6,  transformOrigin: "200% 50%", opacity: 0 } },
	"slide-out-elliptic-left-bck":   { ...defaults, name: "slide-out-elliptic-left-bck",   to: { x: -1000, rotateY:  30, scale: 0,  transformOrigin: "-100% 50%" } },
}

export default slideOutElliptic
