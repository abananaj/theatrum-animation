/**
 * Animation configuration for different slide animations
 */
export interface AnimationConfig {
	name: string
	duration: number
	easing: string
	properties: string
}

const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
	"slide-top": {
		name: "slide-top",
		duration: 5000,
		easing: "linear",
		properties: "all",
	},
	"slide-bl": {
		name: "slide-bl",
		duration: 5000,
		easing: "linear",
		properties: "all",
	},
	"slide-bottom": {
		name: "slide-bottom",
		duration: 5000,
		easing: "linear",
		properties: "all",
	},
	"slide-br": {
		name: "slide-br",
		duration: 5000,
		easing: "linear",
		properties: "all",
	},
}

/**
 * Get animation data from a block element
 */
function getAnimationData(element: Element): AnimationConfig | null {
	const animationType = element.getAttribute("data-animation")

	if (!animationType || !ANIMATION_CONFIGS[animationType]) {
		return null
	}

	const config = { ...ANIMATION_CONFIGS[animationType] }

	// Check for custom duration
	const customDuration = element.getAttribute("data-animation-duration")
	if (customDuration) {
		config.duration = parseInt(customDuration, 10)
	}

	// Check for custom easing
	const customEasing = element.getAttribute("data-animation-easing")
	if (customEasing) {
		config.easing = customEasing
	}

	// Check for custom properties
	const customProperties = element.getAttribute("data-animation-properties")
	if (customProperties) {
		config.properties = customProperties
	}

	return config
}

/**
 * Apply animation to an element
 */
function applyAnimation(element: Element, config: AnimationConfig): void {
	const htmlElement = element as HTMLElement

	htmlElement.style.animation = `${config.name} ${config.duration}ms ${config.easing} forwards`
	htmlElement.classList.add("theatrum-animated")
}

/**
 * Initialize animations for all elements with animation data
 */
export function initializeAnimations(): void {
	// Intersection Observer for viewport detection
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const animationConfig = getAnimationData(entry.target)

					if (animationConfig) {
						applyAnimation(entry.target, animationConfig)
						// Stop observing after animation is triggered (only once per page load)
						observer.unobserve(entry.target)
					}
				}
			})
		},
		{
			threshold: 0.1,
		},
	)

	// Find all elements with animation data
	const animatedElements = document.querySelectorAll("[data-animation]")
	animatedElements.forEach((element) => {
		observer.observe(element)
	})
}

