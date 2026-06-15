import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power1.out" }

const trackingIn: Record<string, AnimationConfig> = {
	"tracking-in-expand":            { ...defaults, name: "tracking-in-expand",            from: { letterSpacing: "-0.5em", opacity: 0 } },
	"tracking-in-contract":          { ...defaults, name: "tracking-in-contract",          from: { letterSpacing: "1em",    opacity: 0 } },
	"tracking-in-contract-bck":      { ...defaults, name: "tracking-in-contract-bck",      from: { letterSpacing: "1em",    z:  400, opacity: 0 } },
	"tracking-in-contract-bck-top":  { ...defaults, name: "tracking-in-contract-bck-top",  from: { letterSpacing: "1em",    z:  400, y: -300, opacity: 0 } },
	"tracking-in-contract-bck-bottom":{ ...defaults, name: "tracking-in-contract-bck-bottom",from: { letterSpacing: "1em",  z:  400, y:  300, opacity: 0 } },
	"tracking-in-expand-fwd":        { ...defaults, name: "tracking-in-expand-fwd",        from: { letterSpacing: "-0.5em", z: -700, opacity: 0 } },
	"tracking-in-expand-fwd-top":    { ...defaults, name: "tracking-in-expand-fwd-top",    from: { letterSpacing: "-0.5em", z: -700, y: -500, opacity: 0 } },
	"tracking-in-expand-fwd-bottom": { ...defaults, name: "tracking-in-expand-fwd-bottom", from: { letterSpacing: "-0.5em", z: -700, y:  500, opacity: 0 } },
}

export default trackingIn
