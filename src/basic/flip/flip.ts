import type { AnimationConfig } from "../../config/animationConfigs"

const defaults = { duration: 500, ease: "power1.inOut" }

const flip: Record<string, AnimationConfig> = {
	"flip-horizontal-top":    { ...defaults, name: "flip-horizontal-top",    to: { rotateX:  180 } },
	"flip-horizontal-bottom": { ...defaults, name: "flip-horizontal-bottom", to: { rotateX: -180 } },
	"flip-horizontal-fwd":    { ...defaults, name: "flip-horizontal-fwd",    to: { z:  160, rotateX: -180 } },
	"flip-horizontal-bck":    { ...defaults, name: "flip-horizontal-bck",    to: { z: -260, rotateX:  180 } },
	"flip-vertical-right":    { ...defaults, name: "flip-vertical-right",    to: { rotateY:  180 } },
	"flip-vertical-left":     { ...defaults, name: "flip-vertical-left",     to: { rotateY: -180 } },
	"flip-vertical-fwd":      { ...defaults, name: "flip-vertical-fwd",      to: { z:  160, rotateY:  180 } },
	"flip-vertical-bck":      { ...defaults, name: "flip-vertical-bck",      to: { z: -260, rotateY: -180 } },
	"flip-diagonal-1-tr":     { ...defaults, name: "flip-diagonal-1-tr",     to: { rotateX:  90, rotateY:  90 } },
	"flip-diagonal-1-bl":     { ...defaults, name: "flip-diagonal-1-bl",     to: { rotateX: -90, rotateY: -90 } },
	"flip-diagonal-1-fwd":    { ...defaults, name: "flip-diagonal-1-fwd",    to: { z:  160, rotateX:  90, rotateY:  90 } },
	"flip-diagonal-1-bck":    { ...defaults, name: "flip-diagonal-1-bck",    to: { z: -260, rotateX: -90, rotateY: -90 } },
	"flip-diagonal-2-tl":     { ...defaults, name: "flip-diagonal-2-tl",     to: { rotateX: -90, rotateY:  90 } },
	"flip-diagonal-2-br":     { ...defaults, name: "flip-diagonal-2-br",     to: { rotateX:  90, rotateY: -90 } },
	"flip-diagonal-2-fwd":    { ...defaults, name: "flip-diagonal-2-fwd",    to: { z:  160, rotateX:  90, rotateY: -90 } },
	"flip-diagonal-2-bck":    { ...defaults, name: "flip-diagonal-2-bck",    to: { z: -260, rotateX: -90, rotateY:  90 } },
}

export default flip
