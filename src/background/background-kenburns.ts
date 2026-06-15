import type { AnimationConfig } from "../config/animationConfigs"

const defaults = { duration: 8000, ease: "power1.inOut", repeat: -1, yoyo: true }

const backgroundKenburns: Record<string, AnimationConfig> = {
	"kenburns-top":          { ...defaults, name: "kenburns-top",          to: { scale: 1.25, y:  -15, transformOrigin: "50% 0%" } },
	"kenburns-right":        { ...defaults, name: "kenburns-right",        to: { scale: 1.25, x:   20, transformOrigin: "100% 50%" } },
	"kenburns-bottom":       { ...defaults, name: "kenburns-bottom",       to: { scale: 1.25, y:   15, transformOrigin: "50% 100%" } },
	"kenburns-left":         { ...defaults, name: "kenburns-left",         to: { scale: 1.25, x:  -20, y: 15, transformOrigin: "0 50%" } },
	"kenburns-top-right":    { ...defaults, name: "kenburns-top-right",    to: { scale: 1.25, x:   20, y: -15, transformOrigin: "100% 0%" } },
	"kenburns-top-left":     { ...defaults, name: "kenburns-top-left",     to: { scale: 1.25, x:  -20, y: -15, transformOrigin: "0 0" } },
	"kenburns-bottom-right": { ...defaults, name: "kenburns-bottom-right", to: { scale: 1.25, x:   20, y:  15, transformOrigin: "100% 100%" } },
	"kenburns-bottom-left":  { ...defaults, name: "kenburns-bottom-left",  to: { scale: 1.25, x:  -20, y:  15, transformOrigin: "0 100%" } },
}

export default backgroundKenburns
