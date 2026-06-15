import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 800, ease: "power2.out" }

const slideInElliptic: Record<string, AnimationConfig> = {
	"slide-in-elliptic-top-fwd":    { ...defaults, name: "slide-in-elliptic-top-fwd",    from: { y: -600, rotateX: -30, scale: 0,   transformOrigin: "50% 100%", opacity: 0 } },
	"slide-in-elliptic-top-bck":    { ...defaults, name: "slide-in-elliptic-top-bck",    from: { y: -600, rotateX:  30, scale: 6.5, transformOrigin: "50% 200%", opacity: 0 } },
	"slide-in-elliptic-right-fwd":  { ...defaults, name: "slide-in-elliptic-right-fwd",  from: { x:  800, rotateY: -30, scale: 0,   transformOrigin: "-100% 50%", opacity: 0 } },
	"slide-in-elliptic-right-bck":  { ...defaults, name: "slide-in-elliptic-right-bck",  from: { x:  800, rotateY:  30, scale: 6.5, transformOrigin: "-100% 50%", opacity: 0 } },
	"slide-in-elliptic-bottom-fwd": { ...defaults, name: "slide-in-elliptic-bottom-fwd", from: { y:  600, rotateX:  30, scale: 0,   transformOrigin: "50% 100%",  opacity: 0 } },
	"slide-in-elliptic-bottom-bck": { ...defaults, name: "slide-in-elliptic-bottom-bck", from: { y:  600, rotateX: -30, scale: 6.5, transformOrigin: "50% -100%", opacity: 0 } },
	"slide-in-elliptic-left-fwd":   { ...defaults, name: "slide-in-elliptic-left-fwd",   from: { x: -800, rotateY:  30, scale: 0,   transformOrigin: "-100% 50%", opacity: 0 } },
	"slide-in-elliptic-left-bck":   { ...defaults, name: "slide-in-elliptic-left-bck",   from: { x: -800, rotateY: -30, scale: 6.5, transformOrigin: "200% 50%",  opacity: 0 } },
}

export default slideInElliptic
