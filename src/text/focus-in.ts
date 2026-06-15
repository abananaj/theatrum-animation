import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 900, ease: "power1.out" }

const focusIn: Record<string, AnimationConfig> = {
	"text-focus-in":        { ...defaults, name: "text-focus-in",        from: { filter: "blur(12px)", opacity: 0 } },
	"focus-in-expand":      { ...defaults, name: "focus-in-expand",      from: { letterSpacing: "-0.5em", filter: "blur(12px)", opacity: 0 } },
	"focus-in-contract":    { ...defaults, name: "focus-in-contract",    from: { letterSpacing: "1em",    filter: "blur(12px)", opacity: 0 } },
	"focus-in-contract-bck":{ ...defaults, name: "focus-in-contract-bck",from: { letterSpacing: "1em",    z: 300, filter: "blur(12px)", opacity: 0 } },
	"focus-in-expand-fwd":  { ...defaults, name: "focus-in-expand-fwd",  from: { letterSpacing: "-0.5em", z: -800, filter: "blur(12px)", opacity: 0 } },
}

export default focusIn
