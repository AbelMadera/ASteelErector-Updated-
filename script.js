/***********************
 * Config
 ***********************/
const COMPANY_EMAIL = 'info@asteelerector.com'; // <-- put your real email here

/***********************
 * Helpers
 ***********************/
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/***********************
 * Theme toggle
 ***********************/
const toggleBtn = $('.theme-toggle');
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

/***********************
 * Reveal animation
 ***********************/
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .1 });
$$('.reveal').forEach(el => observer.observe(el));

/***********************
 * Mobile menu (below header)
 ***********************/
const menuBtn = $('.menu-btn');
const mobileMenu = $('#mobileMenu');
const headerEl = $('header');

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
    menuBtn?.setAttribute('aria-expanded', String(opening));
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

/***********************
 * Smooth, offset-aware scrolling
 ***********************/
function smoothScrollToId(id) {
    const target = document.querySelector(id);
    if (!target) return;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
}
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id.length <= 1) return;
        e.preventDefault();
        smoothScrollToId(id);
        if (mobileMenu?.classList.contains('open')) closeMenu();
    });
});

/***********************
 * Contact form — mailto compose
 * Opens the user's email client with a prefilled message.
 ***********************/
const form = $('#contactForm');
const toast = $('#toast');

function sanitize(s) { return String(s || '').trim(); }

form?.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent jumping to top/reload

    const data = Object.fromEntries(new FormData(form).entries());
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const phone = sanitize(data.phone);
    const message = sanitize(data.message);

    // Basic validation
    const errors = [];
    if (name.length < 2) errors.push('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email.');
    if (message.length < 10) errors.push('Tell us a bit more about your project (at least 10 characters).');

    if (errors.length) {
        alert(errors.join('\n'));
        return;
    }

    // Build a nice subject/body
    const subject = encodeURIComponent(`Quote Request — ${name}`);
    const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        'Project details:',
        message
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join('\n'));

    // Trigger the email client
    const mailto = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    // Small toast for feedback
    toast?.classList.add('show');
    setTimeout(() => toast?.classList.remove('show'), 3200);

    // Optional: clear the form
    // form.reset();
});

/***********************
 * Footer year
 ***********************/
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
