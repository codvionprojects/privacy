function toggleScroll(state) {
    scroll = state;
    if (!scroll) {
        document.documentElement.style.overflow = "hidden";
    } else {
        document.documentElement.style.overflow = "auto";
    }
}

const header = document.querySelector('[data-header]');
const mobile_top = document.querySelector('.mobile-menu');

function headerScroll() {
    if (window.scrollY > 70) {
        header.classList.add('scrolled');
        mobile_top.classList.add('scrolled-padding');
    } else {
        header.classList.remove('scrolled');
        mobile_top.classList.remove('scrolled-padding');
    }
}

let header_scroll = window.scrollY;

function headerScrollMore() {
    const scroll_header = window.scrollY;
    if (scroll_header > header_scroll && scroll_header > 0) {
        header.classList.remove('top');
    } else {
        header.classList.add('top');
    }
    header_scroll = scroll_header;
}

window.addEventListener('scroll', () => {
    headerScroll();
    headerScrollMore();
});

headerScroll();
headerScrollMore();

const menuButton = document.getElementById('header-menu-button');
const overlayMenu = document.getElementById('codvion-overlay-menu');
const overlayBackdrop = document.getElementById('menu-overlay-backdrop');
const mob_nav = document.getElementById('mobileMenu');
const btn_nav = document.getElementById('menuBtn');
const a_nav = document.querySelectorAll('.mobile-menu a');

let animated_menu = false;
isopen_nav = false;

function openMenu() {
    if (animated_menu) return;
    animated_menu = true;
    isopen_nav = true;
    toggleScroll(false);
    btn_nav.classList.add('active');
    mob_nav.classList.add('active');
    setTimeout(() => { animated_menu = false; }, 960);
}

function closeMenu() {
    if (animated_menu) return;
    animated_menu = true;
    isopen_nav = false;
    toggleScroll(true);
    btn_nav.classList.remove('active')
    mob_nav.classList.remove('active');
    setTimeout(() => { animated_menu = false; }, 960);
}

btn_nav.addEventListener('click', () => { isopen_nav ? closeMenu() : openMenu(); });

function openOverlayMenu() {
    if (!overlayMenu || !overlayBackdrop || !menuButton) {
        return;
    }

    overlayMenu.classList.add('active');
    overlayBackdrop.classList.add('active');
    menuButton.classList.add('active');
    menuButton.classList.remove('scroll');
    document.body.classList.add('menu-open');

    overlayMenu.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close CodVion menu');
}

function closeOverlayMenu() {
    if (!overlayMenu || !overlayBackdrop || !menuButton) {
        return;
    }

    overlayMenu.classList.remove('active');
    overlayBackdrop.classList.remove('active');
    menuButton.classList.remove('active');
    document.body.classList.remove('menu-open');
    overlayMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open CodVion menu');
    lastScrollPosition = window.scrollY;
    menuButton.focus();
    handleHeaderingScroll();
}

menuButton?.addEventListener('click', () => {
    const isMenuOpen = overlayMenu?.classList.contains('active');

    if (isMenuOpen) {
        closeOverlayMenu();
    } else {
        openOverlayMenu();
    }
});

overlayBackdrop?.addEventListener('click', closeOverlayMenu);

document.addEventListener('keydown', event => {
    if (
        event.key === 'Escape' &&
        overlayMenu?.classList.contains('active')
    ) {
        closeOverlayMenu();
    }
});

let lastScrollPosition = window.scrollY;
let scrollTicking = false;

function handleHeaderingScroll() {
    if (header.classList.contains('top')) {
        menuButton?.classList.add('scroll');
    }
}

function handleHeaderScroll() {
    const currentScrollPosition = Math.max(window.scrollY, 0);
    const isScrollingDown = currentScrollPosition > lastScrollPosition;
    const isPastTop = currentScrollPosition > 1;
    const isMenuOpen = overlayMenu?.classList.contains('active');

    if (isScrollingDown && isPastTop) {
        header?.classList.add('scroll');
    } else {
        header?.classList.remove('scroll');
    }

    if (isMenuOpen) {
        menuButton?.classList.remove('scroll');
    } else if (isScrollingDown && isPastTop) {
        menuButton?.classList.remove('scroll');
    } else {
        menuButton?.classList.add('scroll');
    }

    lastScrollPosition = currentScrollPosition;
}

window.addEventListener(
    'scroll',
    () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                scrollTicking = false;
            });

            scrollTicking = true;
        }
    },
    { passive: true }
);
handleHeaderScroll();
