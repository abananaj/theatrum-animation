import "./styles.scss"
import { initializeAnimations } from "./animations"

// Initialize animations when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeAnimations)
} else {
	initializeAnimations()
}

