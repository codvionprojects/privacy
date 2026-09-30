document.getElementById("copyright-year").textContent = new Date().getFullYear();
gsap.to('.f-c-t', {
    y: 0,
    opacity: 1,
    stagger: 0.08,
    duration: 0.8,
    ease: "back.inOut(1.5)",
    scrollTrigger: {
        trigger: '.codvion-pro-footer-brandline',
        start: "top 85%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true
    }
});

window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});