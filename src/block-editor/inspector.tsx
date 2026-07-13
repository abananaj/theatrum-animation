import gsap from "gsap"
import { addFilter } from "@wordpress/hooks"
import { InspectorControls } from "@wordpress/block-editor"
import { PanelBody, SelectControl, __experimentalNumberControl as NumberControl, Button } from "@wordpress/components"
import { createHigherOrderComponent } from "@wordpress/compose"
import { useSelect, select as wpSelect } from "@wordpress/data"
import { Fragment, useState, useEffect, useRef } from "@wordpress/element"
import { __ } from "@wordpress/i18n"
import { REGISTRY, buildClassIndex, flattenConfigs } from "../config/registry"
import { clearPropsFor, withPerspective } from "../config/animationConfigs"

// ─── Derived registries (single source of truth = config/registry.ts) ──────────

/** CSS class → { category, animation } ids. */
const CLASS_INDEX = buildClassIndex()
const FLAT_CONFIGS = flattenConfigs()

const SELECT_PLACEHOLDER = { label: __("— Select —", "theatrum-animation"), value: "" }

// category id → its default trigger (single source of truth = the registry).
const CATEGORY_DEFAULT_TRIGGER: Record<string, string> = Object.fromEntries(
	Object.entries(REGISTRY).map(([id, cat]) => [id, cat.trigger])
)

// Which categories appear under each trigger header in the Category dropdown.
// Entrance/Text/Basic list twice — under On Scroll (their default) and On Load;
// picking from On Load persists a data-animation-trigger override. Exit is
// deliberately excluded from the picker (kept in the registry for old content).
const TRIGGER_GROUPS: { id: string; label: string; categories: string[] }[] = [
	{ id: "scroll", label: __("On Scroll", "theatrum-animation"), categories: ["entrance", "text", "basic"] },
	{ id: "load",   label: __("On Load", "theatrum-animation"),   categories: ["entrance", "text", "basic"] },
	{ id: "hover",  label: __("On Hover", "theatrum-animation"),  categories: ["attention", "background"] },
]

// Grouped options for the Category <SelectControl>. Trigger headers are rendered
// as disabled rows (version-safe vs <optgroup>); selectable rows encode both the
// trigger and category in their value as `${trigger}:${category}`.
const CATEGORY_OPTIONS = [
	SELECT_PLACEHOLDER,
	...TRIGGER_GROUPS.flatMap((group) => [
		{ label: group.label, value: `__group_${group.id}`, disabled: true },
		...group.categories
			.filter((catId) => REGISTRY[catId])
			.map((catId) => ({
				label: `  ${REGISTRY[catId].label}`,
				value: `${group.id}:${catId}`,
			})),
	]),
]

/** Split a Category option value back into its trigger + category ids. */
function parseCategoryValue(val: string): { trigger: string; category: string } | null {
	const [trigger, category] = val.split(":")
	if (!trigger || !category) return null
	return { trigger, category }
}

/** The trigger to persist for a pick — only non-default triggers (i.e. Load) are saved. */
function triggerToSave(category: string, trigger: string): string | null {
	return trigger && trigger !== CATEGORY_DEFAULT_TRIGGER[category] ? trigger : null
}

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

// ─── Blocks excluded from animation entirely ───────────────────────────────────
//
// WPForms' block (and any future wpforms/* block) is skipped everywhere below —
// its preview/frontend widgets (reCAPTCHA, date pickers, etc.) measure their own
// size on mount, and injecting unexpected attributes/props into a block whose
// schema we don't control risks corrupting its ServerSideRender preview. Wrap it
// in a Group block and animate that instead.
function isExcludedBlock(name: unknown): boolean {
	return typeof name === "string" && name.startsWith("wpforms/")
}

// ─── Register custom attributes on all blocks ──────────────────────────────────

function addAnimationAttributes(settings: Record<string, any>, name?: string): Record<string, any> {
	if (isExcludedBlock(name ?? settings?.name)) return settings
	return {
		...settings,
		attributes: {
			...settings.attributes,
			animationDuration: { type: "number", default: null },
			animationDelay: { type: "number", default: null },
			animationEasePower: { type: "string", default: null },
			animationEaseDir: { type: "string", default: null },
			// Only persisted for the non-default (Load) trigger; scroll/hover are
			// derived on the frontend from the animation's category.
			animationTrigger: { type: "string", default: null },
		},
	}
}
addFilter("blocks.registerBlockType", "theatrum-animation/attributes", addAnimationAttributes)

// ─── Register stagger attributes on all blocks ─────────────────────────────────

function addStaggerAttributes(settings: Record<string, any>, name?: string): Record<string, any> {
	if (isExcludedBlock(name ?? settings?.name)) return settings
	return {
		...settings,
		attributes: {
			...settings.attributes,
			staggerEach: { type: "number", default: null },
			staggerFrom: { type: "string", default: null },
		},
	}
}
addFilter("blocks.registerBlockType", "theatrum-animation/stagger-attributes", addStaggerAttributes)

// ─── Apply data-* attributes to saved block HTML ───────────────────────────────

function addAnimationSaveProps(
	props: Record<string, any>,
	blockType: Record<string, any>,
	attributes: Record<string, any>
): Record<string, any> {
	if (isExcludedBlock(blockType?.name)) return props
	const { className = "", animationDuration, animationDelay, animationEasePower, animationEaseDir, animationTrigger } = attributes
	const hasAnimation = (className || "").split(" ").some((cls: string) => cls in CLASS_INDEX)
	if (!hasAnimation) return props

	const result = { ...props }
	if (animationDuration != null) result["data-animation-duration"] = animationDuration
	if (animationDelay != null) result["data-animation-delay"] = animationDelay
	if (animationEasePower != null && animationEaseDir != null) {
		result["data-animation-ease"] = `${animationEasePower}.${animationEaseDir}`
	}
	if (animationTrigger != null) result["data-animation-trigger"] = animationTrigger
	return result
}
addFilter("blocks.getSaveContent.extraProps", "theatrum-animation/save-props", addAnimationSaveProps)

function addStaggerSaveProps(
	props: Record<string, any>,
	blockType: Record<string, any>,
	attributes: Record<string, any>
): Record<string, any> {
	if (isExcludedBlock(blockType?.name)) return props
	const { staggerEach, staggerFrom } = attributes
	if (staggerEach == null) return props

	return {
		...props,
		"data-stagger-each": staggerEach,
		"data-stagger-from": staggerFrom ?? "start",
	}
}
addFilter("blocks.getSaveContent.extraProps", "theatrum-animation/stagger-save-props", addStaggerSaveProps)

// ─── Ease controls ─────────────────────────────────────────────────────────────

const EASE_POWER_OPTIONS = [
	SELECT_PLACEHOLDER,
	{ label: __("Power 1", "theatrum-animation"), value: "power1" },
	{ label: __("Power 2", "theatrum-animation"), value: "power2" },
	{ label: __("Power 3", "theatrum-animation"), value: "power3" },
	{ label: __("Power 4", "theatrum-animation"), value: "power4" },
	{ label: __("Back", "theatrum-animation"), value: "back" },
]

const EASE_DIR_OPTIONS = [
	SELECT_PLACEHOLDER,
	{ label: __("In", "theatrum-animation"), value: "in" },
	{ label: __("Out", "theatrum-animation"), value: "out" },
	{ label: __("In → Out", "theatrum-animation"), value: "inOut" },
]

// ─── Stagger controls ───────────────────────────────────────────────────────

const STAGGER_FROM_OPTIONS = [
	{ label: __("Start", "theatrum-animation"), value: "start" },
	{ label: __("End", "theatrum-animation"), value: "end" },
	{ label: __("Center", "theatrum-animation"), value: "center" },
	{ label: __("Edges", "theatrum-animation"), value: "edges" },
	{ label: __("Random", "theatrum-animation"), value: "random" },
]

// ─── Inspector panel ───────────────────────────────────────────────────────────

const withAnimationInspector = createHigherOrderComponent((BlockEdit) => {
	return (props: any) => {
		if (isExcludedBlock(props.name)) return <BlockEdit {...props} />

		const { attributes, setAttributes, clientId } = props
		const {
			className = "",
			animationDuration = null,
			animationDelay = null,
			animationEasePower = null,
			animationEaseDir = null,
			animationTrigger = null,
			staggerEach = null,
			staggerFrom = null,
		} = attributes

		// getBlockOrder (child clientIds only) is much cheaper than getBlock
		// (deep-clones the whole subtree) — this HOC wraps every block on the page.
		const hasMultipleChildren = useSelect(
			(select: any) => select("core/block-editor").getBlockOrder(clientId).length > 1,
			[clientId]
		)

		const parsed = parseAnimationClass(className)

		// The trigger for a committed class = its saved override (Load) or its
		// category default (scroll/hover).
		function triggerFor(category: string): string {
			return category ? animationTrigger || CATEGORY_DEFAULT_TRIGGER[category] || "" : ""
		}

		// Track intermediate selections before a class is committed to className
		const [uiCategory, setUiCategory] = useState(parsed.category)
		const [uiAnimation, setUiAnimation] = useState(parsed.animation)
		const [uiTrigger, setUiTrigger] = useState(triggerFor(parsed.category))

		// Set to true in handlers before calling setAttributes so the effect
		// below knows the className change came from us, not from an external source
		// like undo/redo. After the effect fires it resets back to false.
		const suppressSync = useRef(false)

		// Commit a className change from a handler. Only raise the suppress flag
		// when the value actually changes — the effect below only fires (and only
		// resets the flag) on a real className change, so flagging a no-op write
		// would leave the flag latched and swallow the next external change.
		function commitClassName(next: string, extra: Record<string, any> = {}) {
			if (next !== className) suppressSync.current = true
			setAttributes({ className: next, ...extra })
		}

		// When className changes externally (undo/redo), reset pending UI state so
		// the selects reflect the new reality instead of stale intermediate values.
		useEffect(() => {
			if (suppressSync.current) {
				suppressSync.current = false
				return
			}
			setUiCategory(parsed.category)
			setUiAnimation(parsed.animation)
			setUiTrigger(triggerFor(parsed.category))
		}, [className]) // eslint-disable-line react-hooks/exhaustive-deps

		// Committed (saved) values take precedence over pending UI state
		const activeCategory = parsed.category || uiCategory
		const activeAnimation = parsed.animation || uiAnimation
		const activeTrigger = parsed.category ? triggerFor(parsed.category) : uiTrigger
		const appliedClass = parsed.variant
		// The combined value the grouped Category <SelectControl> matches on.
		const categoryValue = activeCategory ? `${activeTrigger}:${activeCategory}` : ""

		const variants = activeCategory && activeAnimation ? variantClasses(activeCategory, activeAnimation) : []
		const hasAnyAnimation = !!activeCategory || !!activeAnimation || !!appliedClass

		function handleCategoryChange(val: string) {
			// Placeholder clears the selection; header rows never fire (disabled).
			const picked = val ? parseCategoryValue(val) : null
			if (val && !picked) return
			setUiCategory(picked?.category ?? "")
			setUiTrigger(picked?.trigger ?? "")
			setUiAnimation("")
			// Changing category drops any applied class and its trigger override.
			commitClassName(stripAnimationClasses(className).join(" "), { animationTrigger: null })
		}

		function handleAnimationChange(val: string) {
			setUiAnimation(val)
			const base = stripAnimationClasses(className)
			// Single-variant animations apply immediately; multi-variant wait for a direction.
			const vs = val ? variantClasses(activeCategory, val) : []
			const committing = vs.length === 1
			if (committing) base.push(vs[0])
			commitClassName(base.join(" "), {
				animationTrigger: committing ? triggerToSave(activeCategory, activeTrigger) : null,
			})
		}

		function handleVariantChange(val: string) {
			const base = stripAnimationClasses(className)
			if (val) base.push(val)
			commitClassName(base.join(" "), {
				animationTrigger: val ? triggerToSave(activeCategory, activeTrigger) : null,
			})
		}

		function handleReset() {
			setUiCategory("")
			setUiAnimation("")
			setUiTrigger("")
			commitClassName(stripAnimationClasses(className).join(" "), {
				animationDuration: null,
				animationDelay: null,
				animationEasePower: null,
				animationEaseDir: null,
				animationTrigger: null,
			})
		}

		// The animation created by the last Preview click. killTweensOf() alone
		// kills child tweens but leaves a repeat:-1 timeline container alive in
		// GSAP's root ticker, leaking one per click — kill the container itself.
		const previewAnim = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null)
		useEffect(() => () => {
			previewAnim.current?.kill()
			previewAnim.current = null
		}, [])

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

			previewAnim.current?.kill()
			previewAnim.current = null
			gsap.killTweensOf(blockEl)

			if (config.timeline) {
				const tl = config.timeline(blockEl)
				const speed = duration > 0 ? config.duration / 1000 / duration : 1
				if (speed !== 1) tl.timeScale(speed)
				if (delay > 0) {
					tl.delay(delay)
					tl.restart(true)
				}
				previewAnim.current = tl
				return
			}

			const hasRepeat = config.repeat !== undefined

			if (config.from) {
				previewAnim.current = gsap.from(blockEl, {
					...withPerspective(config.from),
					duration,
					delay,
					ease,
					...(hasRepeat
						? { repeat: config.repeat, yoyo: config.yoyo }
						: { clearProps: clearPropsFor(config.from) }),
				})
			} else if (config.to) {
				previewAnim.current = gsap.to(blockEl, {
					...withPerspective(config.to),
					duration,
					delay,
					ease,
					...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
				})
			}
		}

		function handleStaggerReset() {
			setAttributes({ staggerEach: null, staggerFrom: null })
		}

		// The animations created by the last Stagger Preview click.
		const staggerPreviewAnims = useRef<(gsap.core.Timeline | gsap.core.Tween)[]>([])
		useEffect(() => () => {
			staggerPreviewAnims.current.forEach((a) => a.kill())
			staggerPreviewAnims.current = []
		}, [])

		function handleStaggerPreview() {
			if (staggerEach == null) return
			const canvas = document.querySelector<HTMLIFrameElement>('iframe[name="editor-canvas"]')
			const doc = canvas?.contentDocument ?? document

			staggerPreviewAnims.current.forEach((a) => a.kill())
			staggerPreviewAnims.current = []

			// Mirror the frontend's bindStaggerGroup(): direct children only, only
			// scroll/load-triggered ones (hover children preview independently),
			// reading each child's own applied class + overrides from its block
			// attributes — the editor canvas never carries data-animation-* (that's
			// only written into saved HTML), so we can't read it off the DOM.
			const childClientIds: string[] = wpSelect("core/block-editor").getBlockOrder(clientId) ?? []
			const from = staggerFrom || "start"

			const built: { el: Element; config: any; duration: number; ease: string; delay: number }[] = []
			for (const childId of childClientIds) {
				const childAttrs = wpSelect("core/block-editor").getBlockAttributes(childId) ?? {}
				const parsedChild = parseAnimationClass(childAttrs.className || "")
				if (!parsedChild.variant) continue
				const config = FLAT_CONFIGS[parsedChild.variant]
				if (!config) continue

				const trigger = childAttrs.animationTrigger || CATEGORY_DEFAULT_TRIGGER[parsedChild.category] || "scroll"
				if (trigger === "hover") continue

				const el = doc.querySelector(`.block-editor-block-list__block[data-block="${childId}"]`)
				if (!el) continue

				gsap.killTweensOf(el)
				built.push({
					el,
					config,
					duration: childAttrs.animationDuration != null ? childAttrs.animationDuration / 1000 : config.duration / 1000,
					ease: childAttrs.animationEasePower && childAttrs.animationEaseDir
						? `${childAttrs.animationEasePower}.${childAttrs.animationEaseDir}`
						: config.ease,
					delay: childAttrs.animationDelay != null ? childAttrs.animationDelay / 1000 : 0,
				})
			}
			if (built.length === 0) return

			const distribute = gsap.utils.distribute({ each: staggerEach / 1000, from })
			const els = built.map((b) => b.el)

			built.forEach(({ el, config, duration, ease, delay }, i) => {
				const totalDelay = delay + distribute(i, el, els)
				const hasRepeat = config.repeat !== undefined

				if (config.timeline) {
					const tl = config.timeline(el)
					const speed = duration > 0 ? config.duration / 1000 / duration : 1
					if (speed !== 1) tl.timeScale(speed)
					tl.delay(totalDelay)
					tl.restart(true)
					staggerPreviewAnims.current.push(tl)
					return
				}

				if (config.from) {
					staggerPreviewAnims.current.push(gsap.from(el, {
						...withPerspective(config.from),
						duration, delay: totalDelay, ease,
						...(hasRepeat
							? { repeat: config.repeat, yoyo: config.yoyo }
							: { clearProps: clearPropsFor(config.from) }),
					}))
				} else if (config.to) {
					staggerPreviewAnims.current.push(gsap.to(el, {
						...withPerspective(config.to),
						duration, delay: totalDelay, ease,
						...(hasRepeat ? { repeat: config.repeat, yoyo: config.yoyo } : {}),
					}))
				}
			})
		}

		const showAnimation = !!activeCategory && !!REGISTRY[activeCategory]
		const showVariant = !!activeAnimation && variants.length > 1
		const showSettings = !!appliedClass
		// Multi-step timelines have no single ease to override; hide the controls
		// rather than show settings that do nothing.
		const isTimeline = !!(appliedClass && FLAT_CONFIGS[appliedClass]?.timeline)

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Animation", "theatrum-animation")} initialOpen={!!activeCategory}>
						<SelectControl
							__next40pxDefaultSize
							label={__("Category", "theatrum-animation")}
							value={categoryValue}
							options={CATEGORY_OPTIONS}
							onChange={handleCategoryChange}
						/>
						{showAnimation && (
							<SelectControl
								__next40pxDefaultSize
								label={__("Animation", "theatrum-animation")}
								value={activeAnimation}
								options={animationOptions(activeCategory)}
								onChange={handleAnimationChange}
							/>
						)}
						{showVariant && (
							<SelectControl
								__next40pxDefaultSize
								label={__("Variant", "theatrum-animation")}
								value={appliedClass}
								options={variantOptions(variants)}
								onChange={handleVariantChange}
							/>
						)}
						{showSettings && (
							<>
								<NumberControl
									__next40pxDefaultSize
									label={__("Duration (ms)", "theatrum-animation")}
									value={animationDuration != null ? String(animationDuration) : ""}
									min={0}
									step={50}
									onChange={(val?: string) => {
										// parseInt of intermediate input ("-", "5e") is NaN — store null, never NaN.
										const n = parseInt(val ?? "", 10)
										setAttributes({ animationDuration: Number.isNaN(n) ? null : n })
									}}
								/>
								<NumberControl
									__next40pxDefaultSize
									label={__("Delay (ms)", "theatrum-animation")}
									value={animationDelay != null ? String(animationDelay) : ""}
									min={0}
									step={50}
									onChange={(val?: string) => {
										const n = parseInt(val ?? "", 10)
										setAttributes({ animationDelay: Number.isNaN(n) ? null : n })
									}}
								/>
								{!isTimeline && (
									<>
										<SelectControl
											__next40pxDefaultSize
											label={__("Ease — Power", "theatrum-animation")}
											value={animationEasePower ?? ""}
											options={EASE_POWER_OPTIONS}
											onChange={(val: string) =>
												setAttributes({ animationEasePower: val || null })
											}
										/>
										<SelectControl
											__next40pxDefaultSize
											label={__("Ease — Direction", "theatrum-animation")}
											value={animationEaseDir ?? ""}
											options={EASE_DIR_OPTIONS}
											onChange={(val: string) =>
												setAttributes({ animationEaseDir: val || null })
											}
										/>
									</>
								)}
								<Button
									variant="secondary"
									size="compact"
									onClick={handlePreview}
									style={{ marginTop: "8px" }}
								>
									{__("Preview Animation", "theatrum-animation")}
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
								{__("Reset Animation", "theatrum-animation")}
							</Button>
						)}
					</PanelBody>
					{hasMultipleChildren && (
						<PanelBody title={__("Stagger", "theatrum-animation")} initialOpen={staggerEach != null}>
							<NumberControl
								__next40pxDefaultSize
								label={__("Stagger Each (ms)", "theatrum-animation")}
								value={staggerEach != null ? String(staggerEach) : ""}
								min={0}
								step={50}
								onChange={(val?: string) => {
									// parseInt of intermediate input ("-", "5e") is NaN — store null, never NaN.
									const n = parseInt(val ?? "", 10)
									setAttributes({ staggerEach: Number.isNaN(n) ? null : n })
								}}
							/>
							<SelectControl
								__next40pxDefaultSize
								label={__("Stagger From", "theatrum-animation")}
								value={staggerFrom ?? "start"}
								options={STAGGER_FROM_OPTIONS}
								onChange={(val: string) => setAttributes({ staggerFrom: val })}
							/>
							{staggerEach != null && (
								<Button
									variant="secondary"
									size="compact"
									onClick={handleStaggerPreview}
									style={{ marginTop: "8px" }}
								>
									{__("Preview Stagger", "theatrum-animation")}
								</Button>
							)}
							{(staggerEach != null || staggerFrom != null) && (
								<Button
									variant="tertiary"
									isDestructive
									size="compact"
									onClick={handleStaggerReset}
									style={{ marginTop: "8px" }}
								>
									{__("Reset Stagger", "theatrum-animation")}
								</Button>
							)}
						</PanelBody>
					)}
				</InspectorControls>
			</Fragment>
		)
	}
}, "withAnimationInspector")

addFilter("editor.BlockEdit", "theatrum-animation/inspector", withAnimationInspector)
