/* Gunjan Barua — site behaviour (vanilla JS)
   • active-section highlighting  • mobile menu with focus trap
   • "show all" toggles           • lightbox
   • reveal-on-scroll (off under prefers-reduced-motion) */
(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Active section in the side rail ── */
    const railLinks = $$('.rail-links a');
    if (railLinks.length && 'IntersectionObserver' in window) {
        const byId = new Map(railLinks.map((a) => [a.dataset.section, a]));
        const setActive = (id) => railLinks.forEach((a) => {
            const on = a.dataset.section === id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting && byId.has(e.target.id)) setActive(e.target.id); });
        }, { rootMargin: '-40% 0px -55% 0px' });
        byId.forEach((_, id) => { const s = document.getElementById(id); if (s) observer.observe(s); });
        setActive('home');
    }

    /* ── Mobile menu ── */
    const menu = $('#menu');
    const openBtn = $('#menu-open');
    const closeBtn = $('#menu-close');
    if (menu && openBtn && closeBtn) {
        const focusables = () => $$('a[href], button', menu).filter((el) => !el.disabled);
        const openMenu = () => {
            menu.hidden = false;
            openBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        };
        const closeMenu = () => {
            menu.hidden = true;
            openBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            openBtn.focus();
        };
        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        $$('nav a', menu).forEach((a) => a.addEventListener('click', () => {
            menu.hidden = true;
            openBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }));
        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { closeMenu(); return; }
            if (e.key !== 'Tab') return;
            const f = focusables();
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
        // If the viewport grows past the breakpoint with the menu open, reset it.
        window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => {
            if (m.matches && !menu.hidden) { menu.hidden = true; document.body.style.overflow = ''; openBtn.setAttribute('aria-expanded', 'false'); }
        });
    }

    /* ── Show all / show fewer ── */
    $$('.toggle[data-toggle]').forEach((btn) => {
        const block = $(btn.dataset.toggle);
        if (!block) return;
        if (!$('.is-extra', block)) { btn.hidden = true; return; }
        btn.addEventListener('click', () => {
            const expanded = block.classList.toggle('expanded');
            btn.setAttribute('aria-expanded', String(expanded));
            btn.textContent = expanded ? btn.dataset.less : btn.dataset.more;
        });
    });

    /* ── Reveal cards on scroll ── */
    const reveals = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add('in'));
    } else {
        const ro = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach((el) => ro.observe(el));
    }

    /* ── Lightbox ── */
    const lb = $('#lightbox');
    if (lb) {
        const img = $('#lb-img'), cap = $('#lb-cap');
        const closeB = $('#lb-close'), prevB = $('#lb-prev'), nextB = $('#lb-next');
        let items = [], idx = 0, opener = null;

        const visibleShots = () => $$('#gallery-grid .shot button').filter((b) => b.offsetParent !== null);
        const show = (i) => {
            idx = (i + items.length) % items.length;
            const b = items[idx];
            img.src = b.dataset.src;
            img.alt = b.dataset.alt || '';
            cap.textContent = b.dataset.caption || '';
        };
        const open = (btn) => {
            items = visibleShots();
            opener = btn;
            show(items.indexOf(btn));
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
            closeB.focus();
        };
        const close = () => {
            lb.classList.remove('open');
            document.body.style.overflow = '';
            if (opener) opener.focus();
        };
        $$('#gallery-grid .shot button').forEach((b) => b.addEventListener('click', () => open(b)));
        closeB.addEventListener('click', close);
        prevB.addEventListener('click', () => show(idx - 1));
        nextB.addEventListener('click', () => show(idx + 1));
        lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
        lb.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(idx - 1);
            else if (e.key === 'ArrowRight') show(idx + 1);
            else if (e.key === 'Tab') {
                const f = [closeB, prevB, nextB];
                const i = f.indexOf(document.activeElement);
                e.preventDefault();
                f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
            }
        });
    }
})();
