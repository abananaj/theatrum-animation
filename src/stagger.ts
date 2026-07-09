import gsap from "gsap"
import { onScrollIntoView } from "./config/scrollTrigger"
import { ANIMATION_CONFIGS, processed, applyOverrides, resolveTrigger, buildPaused } from "./engine"

type StaggerFrom = "start" | "end" | "center" | "edges" | "random"
const STAGGER_FROM_VALUES: readonly StaggerFrom[] = ["start", "end", "center", "edges", "random"]

function parseStaggerFrom(val: string | null): StaggerFrom {
	return (STAGGER_FROM_VALUES as readonly string[]).includes(val ?? "") ? (val as StaggerFrom) : "start"
}

/** Find the animation class an element was given (its first matching registry key). */
function animationClassOf(el: Element): string | undefined {
	return Object.keys(ANIMATION_CONFIGS).find(k => el.classList.contains(k))
}

/** Bind every parent carrying data-stagger-each that hasn't been processed yet. */
export function bindStaggerGroups(): void {
	document.querySelectorAll("[data-stagger-each]").forEach(bindStaggerGroup)
}

function bindStaggerGroup(parent: Element): void {
	if (processed.has(parent)) return
	const each = parseInt(parent.getAttribute("data-stagger-each") ?? "", 10)
	if (Number.isNaN(each)) return
	const fromMode = parseStaggerFrom(parent.getAttribute("data-stagger-from"))

	const children = Array.from(parent.querySelectorAll(":scope > *")).filter(el => animationClassOf(el))

	// Hover/attention children aren't real entrances — exclude them from the
	// group so they keep animating independently on their own trigger.
	const eligible = children.filter(el => resolveTrigger(el, animationClassOf(el)!) !== "hover")

	processed.add(parent)
	if (eligible.length < 2) return // nothing to stagger

	const distribute = gsap.utils.distribute({ each: each / 1000, from: fromMode })
	const built = eligible.map((el, i) => {
		const cls = animationClassOf(el)!
		const config = ANIMATION_CONFIGS[cls]
		const timing = applyOverrides(el, config)
		timing.delay += distribute(i, el, eligible)
		processed.add(el)
		return buildPaused(el, config, timing)
	})

	const play = () => built.forEach(anim => anim.play())

	// If every member is Load-triggered, play immediately; otherwise gate the
	// whole group on the parent scrolling into view.
	const allLoad = eligible.every(el => resolveTrigger(el, animationClassOf(el)!) === "load")
	if (allLoad) play()
	else onScrollIntoView(parent, play)
}
