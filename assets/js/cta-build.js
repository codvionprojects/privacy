gsap.to('.cta-build-w', {
    y: 0,
    opacity: 1,
    stagger: 0.04,
    duration: 0.5,
    scrollTrigger: {
        trigger: '.cta-build',
        start: "top 65%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true
    }
});