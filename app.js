const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
menuToggle.addEventListener('click', () => {
const isOpen = sidebar.classList.toggle('open');
menuToggle.setAttribute('aria-expanded', String(isOpen));
});

sidebar.addEventListener('click', (e) => {
if (e.target.matches('a') && sidebar.classList.contains('open')) {
sidebar.classList.remove('open');
menuToggle.setAttribute('aria-expanded', 'false');
}
});
}

const setActiveLink = () => {
const hash = window.location.hash || '#sobre-mi';
document.querySelectorAll('.menu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === hash));
};
window.addEventListener('hashchange', setActiveLink);
window.addEventListener('DOMContentLoaded', setActiveLink);

document.addEventListener('click', (e) => {
const a = e.target.closest('a[href^="#"]');
if (!a) return;
const id = a.getAttribute('href');
const el = document.querySelector(id);
if (!el) return;
e.preventDefault();
el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
