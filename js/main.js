/* Captivate — main.js */

// ── Nav scroll shadow ────────────────────────────────────────
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Mobile hamburger ─────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── Active nav link ──────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
    a.classList.add('active');
  }
});

// ── Fade-in on scroll ────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Accordion ────────────────────────────────────────────────
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.accordion-btn').forEach(b => {
      b.classList.remove('open');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) { btn.classList.add('open'); body.classList.add('open'); }
  });
});

// ── Counter animation ────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counterEls.forEach(el => cio.observe(el));
}
