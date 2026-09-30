gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    infinite: false
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

function startScripts() {
    gsap.to('.h-t-w', {
        y: 0,
        stagger: 0.04,
        duration: 1,
        ease: "back.inOut(2.5)"
    });
}
