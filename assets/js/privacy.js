gsap.utils.toArray(".term-box").forEach((box) => {
    gsap.from(box, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

const tocLinks = [...document.querySelectorAll(".js-toc-link")];

if (tocLinks.length) {
    const sections = tocLinks
        .map((link) => {
            const href = link.getAttribute("href");

            if (!href?.startsWith("#")) return null;

            return document.getElementById(href.slice(1));
        })
        .filter(Boolean);

    const mobileToc = document.querySelector(".mobile-toc");
    const mobileToggle = document.querySelector(".mobile-toc-toggle");
    const quickAccessList = document.querySelector(".quick-access-list");
    const visibleSections = new Map();

    let targetId = null;

    const setActive = (id) => {
        tocLinks.forEach((link) => {
            link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
            );
        });

        const activeLink = tocLinks.find(
            (link) => link.getAttribute("href") === `#${id}`
        );

        if (!activeLink || !quickAccessList) return;

        const listRect = quickAccessList.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        if (linkRect.top < listRect.top || linkRect.bottom > listRect.bottom) {
            quickAccessList.scrollTo({
                top:
                    activeLink.offsetTop -
                    quickAccessList.clientHeight / 2 +
                    activeLink.offsetHeight / 2,
                behavior: "smooth"
            });
        }
    };

    const syncActive = () => {
        let activeId = null;
        let highestRatio = 0;

        visibleSections.forEach((ratio, id) => {
            if (ratio > highestRatio) {
                highestRatio = ratio;
                activeId = id;
            }
        });

        if (activeId) setActive(activeId);
    };

    const finishNavigation = (id) => {
        if (targetId !== id) return;

        targetId = null;
        setActive(id);
    };

    const cancelNavigation = () => {
        if (!targetId) return;

        targetId = null;
        syncActive();
    };

    const scrollToSection = (section, onComplete) => {
        const header = document.querySelector("header");
        const headerHeight = header?.offsetHeight ?? 0;
        const absoluteTop = window.scrollY + section.getBoundingClientRect().top;

        const target = Math.max(
            0,
            absoluteTop - headerHeight - (window.innerHeight - headerHeight) * 0.4
        );

        lenis.scrollTo(target, {
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            immediate: false,
            lock: false,
            onComplete
        });
    };

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visibleSections.delete(entry.target.id);
                    }
                });

                if (!targetId) syncActive();
            },
            {
                rootMargin: "-35% 0px -35% 0px",
                threshold: [0, 0.15, 0.3, 0.5, 0.75, 1]
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    tocLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const href = link.getAttribute("href");

            if (!href?.startsWith("#")) return;

            const id = href.slice(1);
            const section = document.getElementById(id);

            if (!section) return;

            targetId = id;
            setActive(id);
            scrollToSection(section, () => finishNavigation(id));

            history.pushState(null, "", href);

            mobileToc?.classList.remove("is-open");
            mobileToggle?.setAttribute("aria-expanded", "false");
        });
    });

    ["wheel", "touchmove"].forEach((type) => {
        window.addEventListener(type, cancelNavigation, { passive: true });
    });

    if (mobileToc && mobileToggle) {
        mobileToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = mobileToc.classList.toggle("is-open");

            mobileToggle.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (event) => {
            if (mobileToc.contains(event.target)) return;

            mobileToc.classList.remove("is-open");
            mobileToggle.setAttribute("aria-expanded", "false");
        });
    }
}

const termsLayout = document.querySelector(".terms-layout");
const mobileTocToggle = document.querySelector(".mobile-toc-toggle");

if (termsLayout && mobileTocToggle) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    mobileTocToggle.classList.add("active");
                } else {
                    mobileTocToggle.classList.remove("active");
                    mobileTocToggle.setAttribute("aria-expanded", "false");
                    document.querySelector(".mobile-toc")?.classList.remove("is-open");
                }
            });
        },
        {
            rootMargin: "-25% 0px -75% 0px",
            threshold: 0
        }
    );

    observer.observe(termsLayout);
}