import type { AnimationConfig } from "../config/animationConfigs"

const fwd = { duration: 600, ease: "back.out(1.7)" }
const bck = { duration: 600, ease: "back.out(1.4)" }

const swirlIn: Record<string, AnimationConfig> = {
	"swirl-in-fwd":          { ...fwd, name: "swirl-in-fwd",          from: { rotation: -540, scale: 0, opacity: 0 } },
	"swirl-in-bck":          { ...bck, name: "swirl-in-bck",          from: { rotation:  540, scale: 5, opacity: 0 } },
	"swirl-in-top-fwd":      { ...fwd, name: "swirl-in-top-fwd",      from: { rotation: -540, scale: 0, transformOrigin: "50% 0",    opacity: 0 } },
	"swirl-in-top-bck":      { ...bck, name: "swirl-in-top-bck",      from: { rotation:  540, scale: 5, transformOrigin: "50% 0",    opacity: 0 } },
	"swirl-in-bottom-fwd":   { ...fwd, name: "swirl-in-bottom-fwd",   from: { rotation: -540, scale: 0, transformOrigin: "50% 100%", opacity: 0 } },
	"swirl-in-bottom-bck":   { ...bck, name: "swirl-in-bottom-bck",   from: { rotation:  540, scale: 5, transformOrigin: "50% 100%", opacity: 0 } },
	"swirl-in-left-fwd":     { ...fwd, name: "swirl-in-left-fwd",     from: { rotation: -540, scale: 0, transformOrigin: "0 50%",    opacity: 0 } },
	"swirl-in-left-bck":     { ...bck, name: "swirl-in-left-bck",     from: { rotation:  540, scale: 5, transformOrigin: "0 50%",    opacity: 0 } },
	"swirl-in-right-fwd":    { ...fwd, name: "swirl-in-right-fwd",    from: { rotation: -540, scale: 0, transformOrigin: "100% 50%", opacity: 0 } },
	"swirl-in-right-bck":    { ...bck, name: "swirl-in-right-bck",    from: { rotation:  540, scale: 5, transformOrigin: "100% 50%", opacity: 0 } },
	"swirl-in-tl-fwd":       { ...fwd, name: "swirl-in-tl-fwd",       from: { rotation: -540, scale: 0, transformOrigin: "0 0",      opacity: 0 } },
	"swirl-in-tl-bck":       { ...bck, name: "swirl-in-tl-bck",       from: { rotation:  540, scale: 5, transformOrigin: "0 0",      opacity: 0 } },
	"swirl-in-tr-fwd":       { ...fwd, name: "swirl-in-tr-fwd",       from: { rotation: -540, scale: 0, transformOrigin: "100% 0",   opacity: 0 } },
	"swirl-in-tr-bck":       { ...bck, name: "swirl-in-tr-bck",       from: { rotation:  540, scale: 5, transformOrigin: "100% 0",   opacity: 0 } },
	"swirl-in-bl-fwd":       { ...fwd, name: "swirl-in-bl-fwd",       from: { rotation: -540, scale: 0, transformOrigin: "0 100%",   opacity: 0 } },
	"swirl-in-bl-bck":       { ...bck, name: "swirl-in-bl-bck",       from: { rotation:  540, scale: 5, transformOrigin: "0 100%",   opacity: 0 } },
	"swirl-in-br-fwd":       { ...fwd, name: "swirl-in-br-fwd",       from: { rotation: -540, scale: 0, transformOrigin: "100% 100%",opacity: 0 } },
	"swirl-in-br-bck":       { ...bck, name: "swirl-in-br-bck",       from: { rotation:  540, scale: 5, transformOrigin: "100% 100%",opacity: 0 } },
}

export default swirlIn
