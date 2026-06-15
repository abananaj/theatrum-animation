import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 700, ease: "power1.in" }

const blurOut: Record<string, AnimationConfig> = {
	"text-blur-out":         { ...defaults, name: "text-blur-out",         to: { filter: "blur(12px)", opacity: 0 } },
	"blur-out-contract":     { ...defaults, name: "blur-out-contract",     to: { letterSpacing: "-0.5em", filter: "blur(12px)", opacity: 0 } },
	"blur-out-expand":       { ...defaults, name: "blur-out-expand",       to: { letterSpacing: "1em",    filter: "blur(12px)", opacity: 0 } },
	"blur-out-contract-bck": { ...defaults, name: "blur-out-contract-bck", to: { letterSpacing: "-0.5em", z: -500, filter: "blur(12px)", opacity: 0 } },
	"blur-out-expand-fwd":   { ...defaults, name: "blur-out-expand-fwd",   to: { letterSpacing: "1em",    z:  300, filter: "blur(12px)", opacity: 0 } },
}

export default blurOut
