const loadTimeout = setTimeout(() => {
    const load_issue = document.querySelector('.net-issue');
    if (load_issue) {
        load_issue.classList.add('onload');
    }

    setTimeout(() => {
        const net_is = document.querySelector(".net-iss");
        net_is.animate(
            [
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(10px)' }
            ],
            {
                duration: 300,
                easing: 'ease-in',
                fill: 'forwards'
            }
        ).onfinish = () => {
            net_is.textContent =
                'This is taking longer than expected. Please check your internet connection and try again.';

            net_is.animate(
                [
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                {
                    duration: 500,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
        };
    }, 10000);

}, 5000);

window.addEventListener('load', () => {
    clearTimeout(loadTimeout);
    setTimeout(() => {
        const load_sys = document.querySelector('.scene');
        load_sys.classList.add('onload');
    }, 1400);
    const load_bar = document.querySelectorAll('.scene-8bar .bar-sec');
    load_bar.forEach(bar => {
        bar.classList.add('onload');
    });
    setTimeout(() => {
        const load_spin = document.querySelector('.win11-spinner');
        load_spin.classList.add('onload');

        const load_cap = document.querySelector('.caption');
        load_cap.classList.add('onload');

        const load_issue = document.querySelector('.net-issue');
        load_issue.classList.remove('onload');
        const html = document.documentElement;
        html.classList.remove('onload');
    }, 300);

    setTimeout(() => {
        if (typeof startScripts() == "function") {
            startScripts();
        }
    }, 600);
    setTimeout(() => {
        document.querySelector('.scene')?.remove();
    }, 2000);
});