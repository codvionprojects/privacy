(() => {
    'use strict';

    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CONFIG = {
        palette: ['--primary-600', '--primary-500', '--primary-400', '--secondary-400', '--secondary-500'],
        orbFollow: 0.35,
        colorSpeed: 0.0022,
        idleDrift: 0.0006,
        trail: !reduceMotion,
        trailLength: 22,
        trailWidth: 14,
        orbHalf: 7,
        shine: { x: -2.6, y: -3.2 },
        hoverSelector: 'a, button, [role="button"], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], select, summary, label, .service-card, .ser-word, [data-cursor]',
        textSelector: 'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'
    };

    const init = () => {
        const root = document.documentElement;

        const make = (cls, parent, tag = 'div') => {
            const el = document.createElement(tag);
            el.className = cls;
            parent.appendChild(el);
            return el;
        };
        const wrap = make('cursor', document.body);
        wrap.setAttribute('aria-hidden', 'true');
        const canvas = make('cursor-trail', wrap, 'canvas');
        const orb = make('cursor-orb', wrap);
        const ctx = canvas.getContext('2d');

        const parse = (hex) => {
            hex = (hex || '').trim().replace('#', '');
            if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
            const n = parseInt(hex, 16);
            return Number.isNaN(n) ? [51, 113, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        };
        const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
        const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

        let palette = [];
        const readPalette = () => {
            const cs = getComputedStyle(root);
            palette = CONFIG.palette.map((v) => parse(cs.getPropertyValue(v)));
        };
        const colorAt = (t) => {
            const n = palette.length - 1;
            const tri = Math.abs((((t % 2) + 2) % 2) - 1);
            const pos = tri * n;
            const i = Math.min(Math.floor(pos), n - 1);
            const f = pos - i;
            return palette[i].map((v, k) => Math.round(v + (palette[i + 1][k] - v) * f));
        };

        readPalette();
        new MutationObserver(readPalette).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

        let W = 0, H = 0;
        const resize = () => {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            W = innerWidth;
            H = innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        addEventListener('resize', resize);

        let mx = innerWidth / 2, my = innerHeight / 2;
        let ox = mx, oy = my;
        let hue = 0, travel = 0;
        let visible = false, pressed = false, mode = 'default';
        let sx = 1, sy = 1, tsx = 1, tsy = 1;
        const trail = [];

        const updateTargets = () => {
            const p = pressed ? 0.78 : 1;
            if (mode === 'hover') { tsx = tsy = 3 * p; }
            else if (mode === 'text') { tsx = 0.2; tsy = 1.9; }
            else { tsx = tsy = p; }
        };
        const setMode = (m) => {
            if (m === mode) return;
            mode = m;
            orb.classList.toggle('is-hover', m === 'hover');
            orb.classList.toggle('is-text', m === 'text');
            updateTargets();
        };

        addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            if (!visible) {
                ox = mx = e.clientX;
                oy = my = e.clientY;
                visible = true;
                root.classList.add('has-custom-cursor');
                wrap.classList.add('is-visible');
            } else {
                travel += Math.hypot(e.clientX - mx, e.clientY - my);
                mx = e.clientX;
                my = e.clientY;
            }
        }, { passive: true });

        document.addEventListener('pointerover', (e) => {
            const t = e.target;
            if (!(t instanceof Element)) return;
            setMode(t.closest(CONFIG.textSelector) ? 'text' : t.closest(CONFIG.hoverSelector) ? 'hover' : 'default');
        }, { passive: true });

        document.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') return;
            pressed = true;
            updateTargets();
            const r = make('cursor-ripple', wrap);
            r.style.left = e.clientX + 'px';
            r.style.top = e.clientY + 'px';
            r.style.borderColor = rgb(colorAt(hue));
            r.addEventListener('animationend', () => r.remove());
        }, { passive: true });

        addEventListener('pointerup', () => { pressed = false; updateTargets(); }, { passive: true });

        document.addEventListener('mouseleave', () => { visible = false; wrap.classList.remove('is-visible'); });

        const tick = () => {
            const dx = mx - ox, dy = my - oy;
            ox += dx * CONFIG.orbFollow;
            oy += dy * CONFIG.orbFollow;

            hue += travel * CONFIG.colorSpeed + CONFIG.idleDrift;
            travel = 0;
            const a = colorAt(hue);
            const b = colorAt(hue + 0.25);

            const dist = Math.hypot(dx, dy);
            const stretch = reduceMotion || mode === 'text' ? 0 : Math.min(dist / 90, 0.4);
            const angle = stretch > 0.02 ? Math.atan2(dy, dx) : 0;
            sx += (tsx - sx) * 0.18;
            sy += (tsy - sy) * 0.18;

            const sxs = sx * (1 + stretch);
            const sys = sy * (1 - stretch * 0.45);
            orb.style.transform =
                `translate3d(${ox}px,${oy}px,0) rotate(${angle}rad) scale(${sxs},${sys}) translate(-50%,-50%)`;

            const cos = Math.cos(angle), sin = Math.sin(angle);
            const hx = CONFIG.orbHalf + (cos * CONFIG.shine.x + sin * CONFIG.shine.y) / sxs;
            const hy = CONFIG.orbHalf + (-sin * CONFIG.shine.x + cos * CONFIG.shine.y) / sys;

            orb.style.background =
                `radial-gradient(circle 6px at ${hx}px ${hy}px, rgba(255,255,255,0.85) 0, rgba(255,255,255,0) 100%), linear-gradient(135deg, ${rgb(a)} 0%, ${rgb(b)} 100%)`;
            orb.style.boxShadow =
                `0 0 10px 1px ${rgba(a, 0.6)}, 0 0 28px 5px ${rgba(b, 0.3)}, inset 0 -2px 4px color-mix(in srgb, var(--neutral-900) 25%, transparent)`;

            if (CONFIG.trail) {
                if (dist > 0.6) {
                    trail.push({ x: ox, y: oy, c: rgb(a) });
                    if (trail.length > CONFIG.trailLength) trail.shift();
                } else if (trail.length) {
                    trail.shift();
                }
                ctx.clearRect(0, 0, W, H);
                ctx.lineCap = 'round';
                for (let i = 1; i < trail.length; i++) {
                    const k = i / trail.length;
                    ctx.beginPath();
                    ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                    ctx.lineTo(trail[i].x, trail[i].y);
                    ctx.lineWidth = CONFIG.trailWidth * k;
                    ctx.strokeStyle = trail[i].c;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();