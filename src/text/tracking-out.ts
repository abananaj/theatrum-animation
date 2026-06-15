import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power1.in" }

const trackingOut: Record<string, AnimationConfig> = {
	"tracking-out-contract":           { ...defaults, name: "tracking-out-contract",           to: { letterSpacing: "-0.5em", opacity: 0 } },
	"tracking-out-expand":             { ...defaults, name: "tracking-out-expand",             to: { letterSpacing: "1em",    opacity: 0 } },
	"tracking-out-expand-fwd":         { ...defaults, name: "tracking-out-expand-fwd",         to: { letterSpacing: "1em",    z:  300, opacity: 0 } },
	"tracking-out-expand-fwd-top":     { ...defaults, name: "tracking-out-expand-fwd-top",     to: { letterSpacing: "1em",    z:  300, y: -200, opacity: 0 } },
	"tracking-out-expand-fwd-bottom":  { ...defaults, name: "tracking-out-expand-fwd-bottom",  to: { letterSpacing: "1em",    z:  300, y:  200, opacity: 0 } },
	"tracking-out-contract-bck":       { ...defaults, name: "tracking-out-contract-bck",       to: { letterSpacing: "-0.5em", z: -500, opacity: 0 } },
	"tracking-out-contract-bck-top":   { ...defaults, name: "tracking-out-contract-bck-top",   to: { letterSpacing: "-0.5em", z: -500, y: -300, opacity: 0 } },
	"tracking-out-contract-bck-bottom":{ ...defaults, name: "tracking-out-contract-bck-bottom",to: { letterSpacing: "-0.5em", z: -500, y:  300, opacity: 0 } },
}

export default trackingOut
