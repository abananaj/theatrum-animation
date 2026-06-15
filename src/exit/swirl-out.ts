import type { AnimationConfig } from "../config/animationConfigs"

const bck = { duration: 600, ease: "back.in(1.4)" }
const fwd = { duration: 600, ease: "back.in(1.7)" }

const swirlOut: Record<string, AnimationConfig> = {
	"swirl-out-fwd":         { ...fwd, name: "swirl-out-fwd",         to: { rotation:  540, scale: 5, opacity: 0 } },
	"swirl-out-bck":         { ...bck, name: "swirl-out-bck",         to: { rotation: -540, scale: 0, opacity: 0 } },
	"swirl-out-top-fwd":     { ...fwd, name: "swirl-out-top-fwd",     to: { rotation:  540, scale: 5, transformOrigin: "50% 0",    opacity: 0 } },
	"swirl-out-top-bck":     { ...bck, name: "swirl-out-top-bck",     to: { rotation: -540, scale: 0, transformOrigin: "50% 0",    opacity: 0 } },
	"swirl-out-right-fwd":   { ...fwd, name: "swirl-out-right-fwd",   to: { rotation:  540, scale: 5, transformOrigin: "100% 50%", opacity: 0 } },
	"swirl-out-right-bck":   { ...bck, name: "swirl-out-right-bck",   to: { rotation: -540, scale: 0, transformOrigin: "100% 50%", opacity: 0 } },
	"swirl-out-left-fwd":    { ...fwd, name: "swirl-out-left-fwd",    to: { rotation:  540, scale: 5, transformOrigin: "0 50%",    opacity: 0 } },
	"swirl-out-left-bck":    { ...bck, name: "swirl-out-left-bck",    to: { rotation: -540, scale: 0, transformOrigin: "0 50%",    opacity: 0 } },
	"swirl-out-tl-fwd":      { ...fwd, name: "swirl-out-tl-fwd",      to: { rotation:  720, scale: 5, transformOrigin: "0 0",      opacity: 0 } },
	"swirl-out-tl-bck":      { ...bck, name: "swirl-out-tl-bck",      to: { rotation: -540, scale: 0, transformOrigin: "0 0",      opacity: 0 } },
	"swirl-out-tr-fwd":      { ...fwd, name: "swirl-out-tr-fwd",      to: { rotation:  540, scale: 5, transformOrigin: "100% 0",   opacity: 0 } },
	"swirl-out-tr-bck":      { ...bck, name: "swirl-out-tr-bck",      to: { rotation: -540, scale: 0, transformOrigin: "100% 0",   opacity: 0 } },
	"swirl-out-bl-fwd":      { ...fwd, name: "swirl-out-bl-fwd",      to: { rotation:  540, scale: 5, transformOrigin: "0 100%",   opacity: 0 } },
	"swirl-out-bl-bck":      { ...bck, name: "swirl-out-bl-bck",      to: { rotation: -540, scale: 0, transformOrigin: "0 100%",   opacity: 0 } },
	"swirl-out-br-fwd":      { ...fwd, name: "swirl-out-br-fwd",      to: { rotation:  540, scale: 5, transformOrigin: "100% 100%",opacity: 0 } },
	"swirl-out-br-bck":      { ...bck, name: "swirl-out-br-bck",      to: { rotation: -540, scale: 0, transformOrigin: "100% 100%",opacity: 0 } },
	"swirl-out-bottom-fwd":  { ...fwd, name: "swirl-out-bottom-fwd",  to: { rotation:  540, scale: 5, transformOrigin: "50% 100%", opacity: 0 } },
	"swirl-out-bottom-bck":  { ...bck, name: "swirl-out-bottom-bck",  to: { rotation: -540, scale: 0, transformOrigin: "50% 100%", opacity: 0 } },
}

export default swirlOut
