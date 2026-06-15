import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 600, ease: "power2.out" }

const tiltIn: Record<string, AnimationConfig> = {
	"tilt-in-top-1":    { ...defaults, name: "tilt-in-top-1",    from: { rotateY:  30, y: -300, skewY: -30, opacity: 0 } },
	"tilt-in-top-2":    { ...defaults, name: "tilt-in-top-2",    from: { rotateY: -30, y: -300, skewY:  30, opacity: 0 } },
	"tilt-in-bottom-1": { ...defaults, name: "tilt-in-bottom-1", from: { rotateY:  30, y:  300, skewY: -30, opacity: 0 } },
	"tilt-in-bottom-2": { ...defaults, name: "tilt-in-bottom-2", from: { rotateY: -30, y:  300, skewY:  30, opacity: 0 } },
	"tilt-in-right-1":  { ...defaults, name: "tilt-in-right-1",  from: { rotateX: -30, x:  300, skewX:  30, opacity: 0 } },
	"tilt-in-right-2":  { ...defaults, name: "tilt-in-right-2",  from: { rotateX:  30, x:  300, skewX: -30, opacity: 0 } },
	"tilt-in-left-1":   { ...defaults, name: "tilt-in-left-1",   from: { rotateX: -30, x: -300, skewX: -30, opacity: 0 } },
	"tilt-in-left-2":   { ...defaults, name: "tilt-in-left-2",   from: { rotateX:  30, x: -300, skewX:  30, opacity: 0 } },
	"tilt-in-tr":       { ...defaults, name: "tilt-in-tr",       from: { rotateY: -35, rotateX:  20, x:  250, y: -250, skewX: -12, skewY: -15, opacity: 0 } },
	"tilt-in-tl":       { ...defaults, name: "tilt-in-tl",       from: { rotateY:  35, rotateX:  20, x: -250, y: -250, skewX:  12, skewY:  15, opacity: 0 } },
	"tilt-in-br":       { ...defaults, name: "tilt-in-br",       from: { rotateY: -35, rotateX: -20, x:  250, y:  250, skewX:  12, skewY:  15, opacity: 0 } },
	"tilt-in-bl":       { ...defaults, name: "tilt-in-bl",       from: { rotateY:  35, rotateX: -20, x: -250, y:  250, skewX: -12, skewY: -15, opacity: 0 } },
	"tilt-in-fwd-tl":   { ...defaults, name: "tilt-in-fwd-tl",   from: { rotateY: -20, rotateX:  35, x: -300, y: -300, skewX:  35, skewY: -10, opacity: 0 } },
	"tilt-in-fwd-tr":   { ...defaults, name: "tilt-in-fwd-tr",   from: { rotateY:  20, rotateX:  35, x:  300, y: -300, skewX: -35, skewY:  10, opacity: 0 } },
	"tilt-in-fwd-bl":   { ...defaults, name: "tilt-in-fwd-bl",   from: { rotateY: -20, rotateX: -35, x: -300, y:  300, skewX: -35, skewY:  10, opacity: 0 } },
	"tilt-in-fwd-br":   { ...defaults, name: "tilt-in-fwd-br",   from: { rotateY:  20, rotateX: -35, x:  300, y:  300, skewX:  35, skewY: -10, opacity: 0 } },
}

export default tiltIn
