import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 400, ease: "power1.inOut" }

const rotate90: Record<string, AnimationConfig> = {
	"rotate-90-cw":             { ...defaults, name: "rotate-90-cw",             to: { rotation:  90 } },
	"rotate-90-ccw":            { ...defaults, name: "rotate-90-ccw",            to: { rotation: -90 } },
	"rotate-90-top-cw":         { ...defaults, name: "rotate-90-top-cw",         to: { rotation:  90, transformOrigin: "50% 0" } },
	"rotate-90-top-ccw":        { ...defaults, name: "rotate-90-top-ccw",        to: { rotation: -90, transformOrigin: "50% 0" } },
	"rotate-90-right-cw":       { ...defaults, name: "rotate-90-right-cw",       to: { rotation:  90, transformOrigin: "100% 50%" } },
	"rotate-90-right-ccw":      { ...defaults, name: "rotate-90-right-ccw",      to: { rotation: -90, transformOrigin: "100% 50%" } },
	"rotate-90-bottom-cw":      { ...defaults, name: "rotate-90-bottom-cw",      to: { rotation:  90, transformOrigin: "50% 100%" } },
	"rotate-90-bottom-ccw":     { ...defaults, name: "rotate-90-bottom-ccw",     to: { rotation: -90, transformOrigin: "50% 100%" } },
	"rotate-90-left-cw":        { ...defaults, name: "rotate-90-left-cw",        to: { rotation:  90, transformOrigin: "0 50%" } },
	"rotate-90-left-ccw":       { ...defaults, name: "rotate-90-left-ccw",       to: { rotation: -90, transformOrigin: "0 50%" } },
	"rotate-90-tr-cw":          { ...defaults, name: "rotate-90-tr-cw",          to: { rotation:  90, transformOrigin: "100% 0" } },
	"rotate-90-tr-ccw":         { ...defaults, name: "rotate-90-tr-ccw",         to: { rotation: -90, transformOrigin: "100% 0" } },
	"rotate-90-tl-cw":          { ...defaults, name: "rotate-90-tl-cw",          to: { rotation:  90, transformOrigin: "0 0" } },
	"rotate-90-tl-ccw":         { ...defaults, name: "rotate-90-tl-ccw",         to: { rotation: -90, transformOrigin: "0 0" } },
	"rotate-90-br-cw":          { ...defaults, name: "rotate-90-br-cw",          to: { rotation:  90, transformOrigin: "100% 100%" } },
	"rotate-90-br-ccw":         { ...defaults, name: "rotate-90-br-ccw",         to: { rotation: -90, transformOrigin: "100% 100%" } },
	"rotate-90-bl-cw":          { ...defaults, name: "rotate-90-bl-cw",          to: { rotation:  90, transformOrigin: "0 100%" } },
	"rotate-90-bl-ccw":         { ...defaults, name: "rotate-90-bl-ccw",         to: { rotation: -90, transformOrigin: "0 100%" } },
	"rotate-90-horizontal-fwd": { ...defaults, name: "rotate-90-horizontal-fwd", to: { rotateX:  90 } },
	"rotate-90-horizontal-bck": { ...defaults, name: "rotate-90-horizontal-bck", to: { rotateX: -90 } },
	"rotate-90-vertical-fwd":   { ...defaults, name: "rotate-90-vertical-fwd",   to: { rotateY:  90 } },
	"rotate-90-vertical-bck":   { ...defaults, name: "rotate-90-vertical-bck",   to: { rotateY: -90 } },
}

export default rotate90
