import { type AnimationConfig } from "./animationConfigs"
// Entrance
import slideIn from "../entrance/slide-in/slide-in"
import slideInFwd from "../entrance/slide-in/slide-in-fwd"
import slideInBck from "../entrance/slide-in/slide-in-bck"
import slideInBlurred from "../entrance/slide-in/slide-in-blurred"
import slideInElliptic from "../entrance/slide-in/slide-in-elliptic"
import bounceIn from "../entrance/bounce-in"
import fadeIn from "../entrance/fade-in"
import flickerIn from "../entrance/flicker-in"
import puffIn from "../entrance/puff-in"
import rollIn from "../entrance/roll-in"
import scaleIn from "../entrance/scale-in"
import swingIn from "../entrance/swing-in"
import swirlIn from "../entrance/swirl-in"
import tiltIn from "../entrance/tilt-in"
import rotateIn from "../entrance/rotate-in/rotate-in"
import rotateIn2 from "../entrance/rotate-in/rotate-in-2"
// Exit
import bounceOut from "../exit/bounce-out"
import fadeOut from "../exit/fade-out"
import flickerOut from "../exit/flicker-out"
import flipOut from "../exit/flip-out"
import puffOut from "../exit/puff-out"
import rollOut from "../exit/roll-out"
import slitOut from "../exit/slit-out"
import swingOut from "../exit/swing-out"
import swirlOut from "../exit/swirl-out"
import scaleOut from "../exit/scale-out/scale-out"
import rotateOut from "../exit/rotate-out/rotate-out"
import rotateOutMax from "../exit/rotate-out/rotate-out-max"
import slideOut from "../exit/slide-out/slide-out"
import slideOutFwd from "../exit/slide-out/slide-out-fwd"
import slideOutBck from "../exit/slide-out/slide-out-bck"
import slideOutBlurred from "../exit/slide-out/slide-out-blurred"
import slideOutElliptic from "../exit/slide-out/slide-out-elliptic"
// Attention
import heartbeat from "../attention/heartbeat"
import attentionFlicker from "../attention/flicker"
import bounce from "../attention/bounce"
import blink from "../attention/blink"
import jello from "../attention/jello"
import ping from "../attention/ping"
import pulsate from "../attention/pulsate"
import attentionScaleDown from "../attention/scale-down"
import attentionScaleUp from "../attention/scale-up"
import shake from "../attention/shake"
import vibrate from "../attention/vibrate"
import wobble from "../attention/wobble"
// Text
import trackingIn from "../text/tracking-in"
import trackingOut from "../text/tracking-out"
import textShadowDrop from "../text/text-shadow-drop"
import textShadowPop from "../text/text-shadow-pop"
import textPop from "../text/text-pop"
import textFlicker from "../text/text-flicker"
import blurOut from "../text/blur-out"
import focusIn from "../text/focus-in"
// Background
import background from "../background/background"
import backgroundKenburns from "../background/background-kenburns"
import backgroundPan from "../background/background-pan"
// Basic
import swingLeft from "../basic/swing/swing-left"
import swingRight from "../basic/swing/swing-right"
import swingTop from "../basic/swing/swing-top"
import swingBottom from "../basic/swing/swing-bottom"
import slide from "../basic/slide/slide"
import slideFwd from "../basic/slide/slide-fwd"
import slideBck from "../basic/slide/slide-bck"
import slideRotate from "../basic/slide/slide-rotate"
import shadowDrop from "../basic/shadow/shadow-drop"
import shadowInset from "../basic/shadow/shadow-inset"
import shadowDropMax from "../basic/shadow/shadow-drop-max"
import shadowPop from "../basic/shadow/shadow-pop"
import basicScaleUp from "../basic/scale/scale-up"
import basicScaleDown from "../basic/scale/scale-down"
import rotate from "../basic/rotate/rotate"
import rotate90 from "../basic/rotate/rotate-90"
import rotateScale from "../basic/rotate/rotate-scale"
import flip from "../basic/flip/flip"
import flipArc from "../basic/flip/flip-arc"
import flipScale from "../basic/flip/flip-scale"

export type { AnimationConfig }

// ─── Types ───────────────────────────────────────────────────────────────────

/** One selectable animation: a human label + its variants keyed by CSS class. */
export interface AnimationGroup {
	label: string
	configs: Record<string, AnimationConfig>
}

/** One category: a human label + its animations keyed by animation id. */
export interface Category {
	label: string
	animations: Record<string, AnimationGroup>
}

// ─── The registry — single source of truth for editor + frontend ─────────────
//
// Every CSS class key must be unique across all categories. flattenConfigs()
// is last-wins and buildClassIndex() is earliest-wins, so a duplicate key means
// the frontend plays one config while the inspector attributes it to another.
// Namespace new classes when a name would collide (e.g. attention uses
// `attn-scale-*` because basic already owns `scale-*`).

export const REGISTRY: Record<string, Category> = {
	entrance: {
		label: "Entrance",
		animations: {
			"slide-in":          { label: "Slide In",            configs: slideIn },
			"slide-in-fwd":      { label: "Slide In Forward",    configs: slideInFwd },
			"slide-in-bck":      { label: "Slide In Back",       configs: slideInBck },
			"slide-in-blurred":  { label: "Slide In Blurred",    configs: slideInBlurred },
			"slide-in-elliptic": { label: "Slide In Elliptic",   configs: slideInElliptic },
			"bounce-in":         { label: "Bounce In",           configs: bounceIn },
			"fade-in":           { label: "Fade In",             configs: fadeIn },
			"flicker-in":        { label: "Flicker In",          configs: flickerIn },
			"puff-in":           { label: "Puff In",             configs: puffIn },
			"roll-in":           { label: "Roll In",             configs: rollIn },
			"scale-in":          { label: "Scale In",            configs: scaleIn },
			"swing-in":          { label: "Swing In",            configs: swingIn },
			"swirl-in":          { label: "Swirl In",            configs: swirlIn },
			"tilt-in":           { label: "Tilt In",             configs: tiltIn },
			"rotate-in":         { label: "Rotate In",           configs: rotateIn },
			"rotate-in-2":       { label: "Rotate In 2",         configs: rotateIn2 },
		},
	},
	exit: {
		label: "Exit",
		animations: {
			"bounce-out":        { label: "Bounce Out",          configs: bounceOut },
			"fade-out":          { label: "Fade Out",            configs: fadeOut },
			"flicker-out":       { label: "Flicker Out",         configs: flickerOut },
			"flip-out":          { label: "Flip Out",            configs: flipOut },
			"puff-out":          { label: "Puff Out",            configs: puffOut },
			"roll-out":          { label: "Roll Out",            configs: rollOut },
			"slit-out":          { label: "Slit Out",            configs: slitOut },
			"swing-out":         { label: "Swing Out",           configs: swingOut },
			"swirl-out":         { label: "Swirl Out",           configs: swirlOut },
			"scale-out":         { label: "Scale Out",           configs: scaleOut },
			"rotate-out":        { label: "Rotate Out",          configs: rotateOut },
			"rotate-out-max":    { label: "Rotate Out Max",      configs: rotateOutMax },
			"slide-out":         { label: "Slide Out",           configs: slideOut },
			"slide-out-fwd":     { label: "Slide Out Forward",   configs: slideOutFwd },
			"slide-out-bck":     { label: "Slide Out Back",      configs: slideOutBck },
			"slide-out-blurred": { label: "Slide Out Blurred",   configs: slideOutBlurred },
			"slide-out-elliptic":{ label: "Slide Out Elliptic",  configs: slideOutElliptic },
		},
	},
	attention: {
		label: "Attention",
		animations: {
			"heartbeat":         { label: "Heartbeat",           configs: heartbeat },
			"flicker":           { label: "Flicker",             configs: attentionFlicker },
			"bounce":            { label: "Bounce",              configs: bounce },
			"blink":             { label: "Blink",               configs: blink },
			"jello":             { label: "Jello",               configs: jello },
			"ping":              { label: "Ping",                configs: ping },
			"pulsate":           { label: "Pulsate",             configs: pulsate },
			"scale-down":        { label: "Scale Down",          configs: attentionScaleDown },
			"scale-up":          { label: "Scale Up",            configs: attentionScaleUp },
			"shake":             { label: "Shake",               configs: shake },
			"vibrate":           { label: "Vibrate",             configs: vibrate },
			"wobble":            { label: "Wobble",              configs: wobble },
		},
	},
	text: {
		label: "Text",
		animations: {
			"tracking-in":       { label: "Tracking In",         configs: trackingIn },
			"tracking-out":      { label: "Tracking Out",        configs: trackingOut },
			"text-shadow-drop":  { label: "Text Shadow Drop",    configs: textShadowDrop },
			"text-shadow-pop":   { label: "Text Shadow Pop",     configs: textShadowPop },
			"text-pop":          { label: "Text Pop",            configs: textPop },
			"text-flicker":      { label: "Text Flicker",        configs: textFlicker },
			"blur-out":          { label: "Blur Out",            configs: blurOut },
			"focus-in":          { label: "Focus In",            configs: focusIn },
		},
	},
	background: {
		label: "Background",
		animations: {
			"color-change":      { label: "Color Change",        configs: background },
			"kenburns":          { label: "Ken Burns",           configs: backgroundKenburns },
			"bg-pan":            { label: "Background Pan",       configs: backgroundPan },
		},
	},
	basic: {
		label: "Basic",
		animations: {
			"swing-left":        { label: "Swing Left",          configs: swingLeft },
			"swing-right":       { label: "Swing Right",         configs: swingRight },
			"swing-top":         { label: "Swing Top",           configs: swingTop },
			"swing-bottom":      { label: "Swing Bottom",        configs: swingBottom },
			"slide":             { label: "Slide",               configs: slide },
			"slide-fwd":         { label: "Slide Forward",       configs: slideFwd },
			"slide-bck":         { label: "Slide Back",          configs: slideBck },
			"slide-rotate":      { label: "Slide Rotate",        configs: slideRotate },
			"shadow-drop":       { label: "Shadow Drop",         configs: shadowDrop },
			"shadow-inset":      { label: "Shadow Inset",        configs: shadowInset },
			"shadow-drop-max":   { label: "Shadow Drop Max",     configs: shadowDropMax },
			"shadow-pop":        { label: "Shadow Pop",          configs: shadowPop },
			"scale-up":          { label: "Scale Up",            configs: basicScaleUp },
			"scale-down":        { label: "Scale Down",          configs: basicScaleDown },
			"rotate":            { label: "Rotate",              configs: rotate },
			"rotate-90":         { label: "Rotate 90",           configs: rotate90 },
			"rotate-scale":      { label: "Rotate Scale",        configs: rotateScale },
			"flip":              { label: "Flip",                configs: flip },
			"flip-arc":          { label: "Flip Arc",            configs: flipArc },
			"flip-scale":        { label: "Flip Scale",          configs: flipScale },
		},
	},
}

// ─── Derived lookups ─────────────────────────────────────────────────────────

/** Flat map of CSS class → AnimationConfig, in category precedence order. */
export function flattenConfigs(): Record<string, AnimationConfig> {
	const flat: Record<string, AnimationConfig> = {}
	for (const category of Object.values(REGISTRY)) {
		for (const group of Object.values(category.animations)) {
			Object.assign(flat, group.configs)
		}
	}
	return flat
}

/** Reverse lookup: CSS class → { category, animation } ids. Earliest wins. */
export function buildClassIndex(): Record<string, { category: string; animation: string }> {
	const index: Record<string, { category: string; animation: string }> = {}
	for (const [categoryId, category] of Object.entries(REGISTRY)) {
		for (const [animationId, group] of Object.entries(category.animations)) {
			for (const cls of Object.keys(group.configs)) {
				if (!(cls in index)) index[cls] = { category: categoryId, animation: animationId }
			}
		}
	}
	return index
}
