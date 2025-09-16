// ===== Utilities =====
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// ===== Mobile menu =====
const menuBtn = $('.menu-btn');
const mobileMenu = $('#mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu?.addEventListener('click', e => { if (e.target.tagName === 'A') mobileMenu.classList.remove('open'); });
// Close mobile menu if resizing to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileMenu?.classList.contains('open')) {
        mobileMenu.classList.remove('open');
    }
});

// ===== Reveal animations =====
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

// ===== Year =====
$('#year').textContent = new Date().getFullYear();

// ===== Smooth scroll =====
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
            e.preventDefault();
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Contact form (mailto fallback) =====
const form = $('#contactForm');
const toast = $('#toast');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const errors = [];
    if (!data.name || data.name.trim().length < 2) errors.push('Please enter your name.');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Please enter a valid email.');
    if (!data.message || data.message.trim().length < 10) errors.push('Tell us a bit more about your project.');
    if (errors.length) { alert(errors.join('\n')); return; }

    const to = 'info@asteelerector.com'; // TODO: replace with your real inbox
    const subject = encodeURIComponent('Quote Request — ' + data.name);
    const bodyLines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : null,
        '',
        'Project details:',
        data.message
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
    window.location.href = mailto;
});

// ===== Theme handling =====
const THEME_KEY = 'asel_theme';
const body = document.body;
const toggleBtn = $('#themeToggle');

// Default to LIGHT; only switch if saved choice exists
(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light') { body.classList.add('theme-light'); body.classList.remove('theme-dark'); toggleBtn.querySelector('.icon').textContent = '☀️'; return; }
    if (saved === 'dark') { body.classList.add('theme-dark'); body.classList.remove('theme-light'); toggleBtn.querySelector('.icon').textContent = '🌙'; return; }
    // no saved preference -> keep HTML default (light)
    toggleBtn.querySelector('.icon').textContent = '☀️';
})();

toggleBtn?.addEventListener('click', () => {
    const isDark = body.classList.contains('theme-dark');
    body.classList.toggle('theme-dark', !isDark);
    body.classList.toggle('theme-light', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); // store new state
    toggleBtn.querySelector('.icon').textContent = isDark ? '🌙' : '☀️';
});

// Floating toggle: subtle motion on scroll
let lastY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const offset = (y % 40) / 4; // 0..10px
    toggleBtn.style.transform = `translateY(-${offset}px)`;
    toggleBtn.classList.add('scroll-anim');
    toggleBtn.style.opacity = (y > lastY && y > 120) ? '0.85' : '1';
    lastY = y;
});
