import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power2.in" }

const slideRotate: Record<string, AnimationConfig> = {
	"slide-rotate-hor-top":    { ...defaults, name: "slide-rotate-hor-top",    to: { y: -150, rotateX: -90 } },
	"slide-rotate-hor-bottom": { ...defaults, name: "slide-rotate-hor-bottom", to: { y:  150, rotateX:  90 } },
	"slide-rotate-ver-right":  { ...defaults, name: "slide-rotate-ver-right",  to: { x:  150, rotateY: -90 } },
	"slide-rotate-ver-left":   { ...defaults, name: "slide-rotate-ver-left",   to: { x: -150, rotateY:  90 } },
	"slide-rotate-hor-t-fwd":  { ...defaults, name: "slide-rotate-hor-t-fwd",  to: { y: -150, z:  130, rotateX: -90, transformOrigin: "bottom center" } },
	"slide-rotate-hor-b-fwd":  { ...defaults, name: "slide-rotate-hor-b-fwd",  to: { y:  150, z:  130, rotateX:  90, transformOrigin: "top center" } },
	"slide-rotate-hor-t-bck":  { ...defaults, name: "slide-rotate-hor-t-bck",  to: { y: -150, z: -230, rotateX: -90, transformOrigin: "top center" } },
	"slide-rotate-hor-b-bck":  { ...defaults, name: "slide-rotate-hor-b-bck",  to: { y:  150, z: -230, rotateX:  90, transformOrigin: "bottom center" } },
	"slide-rotate-ver-r-fwd":  { ...defaults, name: "slide-rotate-ver-r-fwd",  to: { x:  150, z:  130, rotateY: -90, transformOrigin: "center left" } },
	"slide-rotate-ver-l-fwd":  { ...defaults, name: "slide-rotate-ver-l-fwd",  to: { x: -150, z:  130, rotateY:  90, transformOrigin: "center right" } },
	"slide-rotate-ver-r-bck":  { ...defaults, name: "slide-rotate-ver-r-bck",  to: { x:  150, z: -230, rotateY: -90, transformOrigin: "center right" } },
	"slide-rotate-ver-l-bck":  { ...defaults, name: "slide-rotate-ver-l-bck",  to: { x: -150, z: -230, rotateY:  90, transformOrigin: "center left" } },
}

export default slideRotate
