import gsap from "gsap"
import { addFilter } from "@wordpress/hooks"
import { InspectorControls } from "@wordpress/block-editor"
import { PanelBody, SelectControl, __experimentalNumberControl as NumberControl, Button } from "@wordpress/components"
import { createHigherOrderComponent } from "@wordpress/compose"
import { Fragment, useState, useEffect, useRef } from "@wordpress/element"
import { REGISTRY, buildClassIndex, flattenConfigs } from "../config/registry"
import { clearPropsFor } from "../config/animationConfigs"

// ─── Derived registries (single source of truth = config/registry.ts) ──────────

/** CSS class → { category, animation } ids. */
const CLASS_INDEX = buildClassIndex()
const FLAT_CONFIGS = flattenConfigs()

const SELECT_PLACEHOLDER = { label: "— Select —", value: "" }

const CATEGORY_OPTIONS = [
	SELECT_PLACEHOLDER,
	...Object.entries(REGISTRY).map(([value, cat]) => ({ label: cat.label, value })),
]

function animationOptions(categoryId: string) {
	const category = REGISTRY[categoryId]
	if (!category) return [SELECT_PLACEHOLDER]
	return [
		SELECT_PLACEHOLDER,
		...Object.entries(category.animations).map(([value, group]) => ({ label: group.label, value })),
	]
}

/** The CSS class keys for a given category + animation, in declaration order. */
function variantClasses(categoryId: string, animationId: string): string[] {
	return Object.keys(REGISTRY[categoryId]?.animations[animationId]?.configs ?? {})
}

// ─── Auto-generated variant labels ─────────────────────────────────────────────

const TOKEN_LABELS: Record<string, string> = {
	tl: "Top Left", tr: "Top Right", bl: "Bottom Left", br: "Bottom Right",
	fwd: "Forward", bck: "Back", hor: "Horizontal", ver: "Vertical",
	cw: "CW", ccw: "CCW",
}

function humanizeTokens(tokens: string[]): string {
	return tokens
		.map((t) => TOKEN_LABELS[t] ?? t.charAt(0).toUpperCase() + t.slice(1))
		.join(" ")
}

/**
 * Build { value, label } options for an animation's variants by stripping the
 * tokens common to all of its class keys, then humanizing the remainder.
 * e.g. ["slide-in-top","slide-in-tr"] → "Top", "Top Right"
 *      ["scale-down-center","scale-down-top"] → "Center", "Top"
 */
function variantOptions(classes: string[]): { value: string; label: string }[] {
	const tokenized = classes.map((c) => c.split("-"))
	let common = tokenized[0]?.length ?? 0
	for (const tokens of tokenized) {
		let i = 0
		while (i < common && i < tokens.length && tokens[i] === tokenized[0][i]) i++
		common = i
	}
	const options = classes.map((cls, idx) => {
		const rest = tokenized[idx].slice(common)
		return { value: cls, label: rest.length ? humanizeTokens(rest) : "Default" }
	})
	return [SELECT_PLACEHOLDER, ...options]
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function parseAnimationClass(className: string): { category: string; animation: string; variant: string } {
	for (const cls of (className || "").split(" ")) {
		const hit = CLASS_INDEX[cls]
		if (hit) return { category: hit.category, animation: hit.animation, variant: cls }
	}
	return { category: "", animation: "", variant: "" }
}

function stripAnimationClasses(className: string): string[] {
	return (className || "").split(" ").filter((c) => c && !(c in CLASS_INDEX))
}

// ─── Register custom attributes on all blocks ──────────────────────────────────

function addAnimationAttributes(settings: Record<string, any>): Record<string, any> {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			animationDuration: { type: "number", default: null },
			animationDelay: { type: "number", default: null },
			animationEasePower: { type: "string", default: null },
			animationEaseDir: { type: "string", default: null },
		},
	}
}
addFilter("blocks.registerBlockType", "theatrum-animation/attributes", addAnimationAttributes)

// ─── Apply data-* attributes to saved block HTML ───────────────────────────────

function addAnimationSaveProps(
	props: Record<string, any>,
	_blockType: unknown,
	attributes: Record<string, any>
): Record<string, any> {
	const { className = "", animationDuration, animationDelay, animationEasePower, animationEaseDir } = attributes
	const hasAnimation = (className || "").split(" ").some((cls) => cls in CLASS_INDEX)
	if (!hasAnimation) return props

	const result = { ...props }
	if (animationDuration != null) result["data-animation-duration"] = animationDuration
	if (animationDelay != null) result["data-animation-delay"] = animationDelay
	if (animationEasePower != null && animationEaseDir != null) {
		result["data-animation-ease"] = `${animationEasePower}.${animationEaseDir}`
	}
	return result
}
addFilter("blocks.getSaveContent.extraProps", "theatrum-animation/save-props", addAnimationSaveProps)

// ─── Ease controls ─────────────────────────────────────────────────────────────

const EASE_POWER_OPTIONS = [
	SELECT_PLACEHOLDER,
	{ label: "Power 1", value: "power1" },
	{ label: "Power 2", value: "power2" },
	{ label: "Power 3", value: "power3" },
	{ label: "Power 4", value: "power4" },
	{ label: "Back", value: "back" },
]

const EASE_DIR_OPTIONS = [
	SELECT_PLACEHOLDER,
	{ label: "In", value: "in" },
	{ label: "Out", value: "out" },
	{ label: "In → Out", value: "inOut" },
]

// ─── Inspector panel ───────────────────────────────────────────────────────────

const withAnimationInspector = createHigherOrderComponent((BlockEdit) => {
	return (props: any) => {
		const { attributes, setAttributes } = props
		const {
			className = "",
			animationDuration = null,
			animationDelay = null,
			animationEasePower = null,
			animationEaseDir = null,
		} = attributes

		const parsed = parseAnimationClass(className)

		// Track intermediate selections before a class is committed to className
		const [uiCategory, setUiCategory] = useState(parsed.category)
		const [uiAnimation, setUiAnimation] = useState(parsed.animation)

		// Set this to true in handlers before calling setAttributes so the effect
		// below knows the className change came from us, not from an external source
		// like undo/redo. After the effect fires it resets back to false.
		const suppressSync = useRef(false)

		// When className changes externally (undo/redo), reset pending UI state so
		// the selects reflect the new reality instead of stale intermediate values.
		useEffect(() => {
			if (suppressSync.current) {
				suppressSync.current = false
				return
			}
			setUiCategory(parsed.category)
			setUiAnimation(parsed.animation)
		}, [className]) // eslint-disable-line react-hooks/exhaustive-deps

		// Committed (saved) values take precedence over pending UI state
		const activeCategory = parsed.category || uiCategory
		const activeAnimation = parsed.animation || uiAnimation
		const appliedClass = parsed.variant

		const variants = activeCategory && activeAnimation ? variantClasses(activeCategory, activeAnimation) : []
		const hasAnyAnimation = !!activeCategory || !!activeAnimation || !!appliedClass

		function handleCategoryChange(val: string) {
			suppressSync.current = true
			setUiCategory(val)
			setUiAnimation("")
			setAttributes({ className: stripAnimationClasses(className).join(" ") })
		}

		function handleAnimationChange(val: string) {
			suppressSync.current = true
			setUiAnimation(val)
			const base = stripAnimationClasses(className)
			// Single-variant animations apply immediately; multi-variant wait for a direction.
			const vs = val ? variantClasses(activeCategory, val) : []
			if (vs.length === 1) base.push(vs[0])
			setAttributes({ className: base.join(" ") })
		}

		function handleVariantChange(val: string) {
			suppressSync.current = true
			const base = stripAnimationClasses(className)
			if (val) base.push(val)
			setAttributes({ className: base.join(" ") })
		}

		function handleReset() {
			suppressSync.current = true
			setUiCategory("")
			setUiAnimation("")
			setAttributes({
				className: stripAnimationClasses(className).join(" "),
				animationDuration: null,
				animationDelay: null,
				animationEasePower: null,
				animationEaseDir: null,
			})
		}

		function handlePreview() {
			if (!appliedClass) return
			// The block canvas is rendered inside an iframe in modern WP; fall back to
			// the top document for the non-iframed case. Scope the selector to the
			// block-list wrapper so we don't match the List View row, which also
			// carries data-block="<clientId>".
			const canvas = document.querySelector<HTMLIFrameElement>('iframe[name="editor-canvas"]')
			const doc = canvas?.contentDocument ?? document
			const blockEl = doc.querySelector(
				`.block-editor-block-list__block[data-block="${props.clientId}"]`
			)
			if (!blockEl) return
			const config = FLAT_CONFIGS[appliedClass]
			if (!config) return

			const duration = animationDuration != null ? animationDuration / 1000 : config.duration / 1000
			const delay = animationDelay != null ? animationDelay / 1000 : 0
			const ease = animationEasePower && animationEaseDir
				? `${animationEasePower}.${animationEaseDir}`
				: config.ease

			gsap.killTweensOf(blockEl)

			if (config.timeline) {
				config.timeline(blockEl, duration)
				return
			}

			if (config.from) {
				gsap.from(blockEl, { ...config.from, duration, delay, ease, clearProps: clearPropsFor(config.from) })
			} else if (config.to) {
				gsap.to(blockEl, { ...config.to, duration, delay, ease })
			}
		}

		const showAnimation = !!activeCategory && !!REGISTRY[activeCategory]
		const showVariant = !!activeAnimation && variants.length > 1
		const showSettings = !!appliedClass

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Animation" initialOpen={!!activeCategory}>
						<SelectControl
							__next40pxDefaultSize
							label="Category"
							value={activeCategory}
							options={CATEGORY_OPTIONS}
							onChange={handleCategoryChange}
						/>
						{showAnimation && (
							<SelectControl
								__next40pxDefaultSize
								label="Animation"
								value={activeAnimation}
								options={animationOptions(activeCategory)}
								onChange={handleAnimationChange}
							/>
						)}
						{showVariant && (
							<SelectControl
								__next40pxDefaultSize
								label="Variant"
								value={appliedClass}
								options={variantOptions(variants)}
								onChange={handleVariantChange}
							/>
						)}
						{showSettings && (
							<>
								<NumberControl
									__next40pxDefaultSize
									label="Duration (ms)"
									value={animationDuration != null ? String(animationDuration) : ""}
									min={0}
									step={50}
									onChange={(val?: string) =>
										setAttributes({
											animationDuration: val !== "" && val != null ? parseInt(val, 10) : null,
										})
									}
								/>
								<NumberControl
									__next40pxDefaultSize
									label="Delay (ms)"
									value={animationDelay != null ? String(animationDelay) : ""}
									min={0}
									step={50}
									onChange={(val?: string) =>
										setAttributes({
											animationDelay: val !== "" && val != null ? parseInt(val, 10) : null,
										})
									}
								/>
								<SelectControl
									__next40pxDefaultSize
									label="Ease — Power"
									value={animationEasePower ?? ""}
									options={EASE_POWER_OPTIONS}
									onChange={(val: string) =>
										setAttributes({ animationEasePower: val || null })
									}
								/>
								<SelectControl
									__next40pxDefaultSize
									label="Ease — Direction"
									value={animationEaseDir ?? ""}
									options={EASE_DIR_OPTIONS}
									onChange={(val: string) =>
										setAttributes({ animationEaseDir: val || null })
									}
								/>
								<Button
									variant="secondary"
									size="compact"
									onClick={handlePreview}
									style={{ marginTop: "8px" }}
								>
									Preview Animation
								</Button>
							</>
						)}
						{hasAnyAnimation && (
							<Button
								variant="tertiary"
								isDestructive
								size="compact"
								onClick={handleReset}
								style={{ marginTop: "8px" }}
							>
								Reset Animation
							</Button>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		)
	}
}, "withAnimationInspector")

addFilter("editor.BlockEdit", "theatrum-animation/inspector", withAnimationInspector)
