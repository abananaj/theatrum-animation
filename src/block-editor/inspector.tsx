import { addFilter } from "@wordpress/hooks"
import { InspectorControls } from "@wordpress/block-editor"
import { PanelBody, SelectControl, __experimentalNumberControl as NumberControl, Button } from "@wordpress/components"
import { createHigherOrderComponent } from "@wordpress/compose"
import { Fragment, useState } from "@wordpress/element"

// ─── Animation registry ────────────────────────────────────────────────────────

const SLIDE_IN_DIRECTIONS = ["top", "right", "bottom", "left", "tl", "tr", "bl", "br"] as const

const ALL_ANIMATION_CLASSES: string[] = SLIDE_IN_DIRECTIONS.map((d) => `slide-in-${d}`)

// ─── Option trees ──────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
	{ label: "— Select —", value: "" },
	{ label: "Entrance", value: "entrance" },
]

const ANIMATION_OPTIONS: Record<string, { label: string; value: string }[]> = {
	entrance: [
		{ label: "— Select —", value: "" },
		{ label: "Slide In", value: "slide-in" },
	],
}

const DIRECTION_OPTIONS: Record<string, { label: string; value: string }[]> = {
	"slide-in": [
		{ label: "— Select —", value: "" },
		{ label: "Top", value: "top" },
		{ label: "Top Right", value: "tr" },
		{ label: "Right", value: "right" },
		{ label: "Bottom Right", value: "br" },
		{ label: "Bottom", value: "bottom" },
		{ label: "Bottom Left", value: "bl" },
		{ label: "Left", value: "left" },
		{ label: "Top Left", value: "tl" },
	],
}

const EASE_POWER_OPTIONS = [
	{ label: "— Select —", value: "" },
	{ label: "Power 1", value: "power1" },
	{ label: "Power 2", value: "power2" },
	{ label: "Power 3", value: "power3" },
	{ label: "Power 4", value: "power4" },
	{ label: "Back", value: "back" },
]

const EASE_DIR_OPTIONS = [
	{ label: "— Select —", value: "" },
	{ label: "In", value: "in" },
	{ label: "Out", value: "out" },
	{ label: "In → Out", value: "inOut" },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function parseAnimationClass(className: string): { category: string; animation: string; direction: string } {
	const classes = (className || "").split(" ")
	for (const dir of SLIDE_IN_DIRECTIONS) {
		if (classes.includes(`slide-in-${dir}`)) {
			return { category: "entrance", animation: "slide-in", direction: dir }
		}
	}
	return { category: "", animation: "", direction: "" }
}

function stripAnimationClasses(className: string): string[] {
	return (className || "").split(" ").filter((c) => c && !ALL_ANIMATION_CLASSES.includes(c))
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
	const hasAnimation = ALL_ANIMATION_CLASSES.some((cls) => (className || "").split(" ").includes(cls))
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

		// Committed (saved) values take precedence over pending UI state
		const activeCategory = parsed.category || uiCategory
		const activeAnimation = parsed.animation || uiAnimation
		const activeDirection = parsed.direction

		const hasAnyAnimation = !!activeCategory || !!activeAnimation || !!activeDirection

		function handleCategoryChange(val: string) {
			setUiCategory(val)
			setUiAnimation("")
			setAttributes({ className: stripAnimationClasses(className).join(" ") })
		}

		function handleAnimationChange(val: string) {
			setUiAnimation(val)
			setAttributes({ className: stripAnimationClasses(className).join(" ") })
		}

		function handleDirectionChange(val: string) {
			const base = stripAnimationClasses(className)
			if (val) base.push(`${activeAnimation}-${val}`)
			setAttributes({ className: base.join(" ") })
		}

		function handleReset() {
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

		const showAnimation = !!activeCategory && !!ANIMATION_OPTIONS[activeCategory]
		const showDirection = !!activeAnimation && !!DIRECTION_OPTIONS[activeAnimation]
		const showSettings = !!activeAnimation && (!showDirection || !!activeDirection)

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
								options={ANIMATION_OPTIONS[activeCategory]}
								onChange={handleAnimationChange}
							/>
						)}
						{showDirection && (
							<SelectControl
								__next40pxDefaultSize
								label="Direction"
								value={activeDirection}
								options={DIRECTION_OPTIONS[activeAnimation]}
								onChange={handleDirectionChange}
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
