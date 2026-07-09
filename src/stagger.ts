gsap.fromTo('.stagger-item', {
	y: 100,
	opacity: 0
}, {
	y: 0,
	opacity: 1,
	stagger: 0.1 // 0.1 seconds between when each ".stagger-item" element starts animating
});