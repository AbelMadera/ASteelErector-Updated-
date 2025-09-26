// ===== Theme toggle =====
const toggleBtn = document.querySelector('.theme-toggle');
function setTheme(dark) {
    document.body.classList.toggle('theme-dark', dark);
    document.body.classList.toggle('theme-light', !dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}
toggleBtn?.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('theme-dark'));
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) { setTheme(savedTheme === 'dark'); }

// ===== Reveal animation =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Mobile menu (below header, never overlaps logo) =====
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.getElementById('mobileMenu');
const headerEl = document.querySelector('header');

function setHeaderHeightVar() {
    const h = headerEl?.offsetHeight || 64;
    document.documentElement.style.setProperty('--header-h', h + 'px');
}
window.addEventListener('load', setHeaderHeightVar);
window.addEventListener('resize', setHeaderHeightVar);
document.addEventListener('DOMContentLoaded', () => setTimeout(setHeaderHeightVar, 150));

function closeMenu() {
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
}
menuBtn?.addEventListener('click', () => {
    const opening = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
    menuBtn.setAttribute('aria-expanded', String(opening));
    setHeaderHeightVar();
});
mobileMenu?.addEventListener('click', e => {
    if (e.target.tagName === 'A') closeMenu();
});
document.addEventListener('click', e => {
    if (!mobileMenu?.classList.contains('open')) return;
    if (!e.target.closest('#mobileMenu, .menu-btn, header')) closeMenu();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// ===== Smooth, offset-aware scrolling for all in-page links =====
function smoothScrollToId(id) {
    const target = document.querySelector(id);
    if (!target) return;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH - 12; // small buffer
    window.scrollTo({ top: y, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id.length <= 1) return;
        e.preventDefault();
        smoothScrollToId(id);
        // Close mobile menu if open
        if (mobileMenu?.classList.contains('open')) closeMenu();
    });
});
