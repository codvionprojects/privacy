const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    const updateBackToTop = ({ scroll }) => {
        if (scroll > 600) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    };

    if (typeof lenis !== 'undefined') {
        lenis.on('scroll', updateBackToTop);
    } else {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
    }

    backToTopBtn.addEventListener('click', () => {
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, {
                duration: 1.5,
                easing: t => {
                    const x1 = 0.87, y1 = 0;
                    const x2 = 0.3, y2 = 1;

                    return 3 * (1 - t) ** 2 * t * y1
                        + 3 * (1 - t) * t ** 2 * y2
                        + t ** 3;
                }
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}
