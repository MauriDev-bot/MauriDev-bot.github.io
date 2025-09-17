const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');

function toggleNav() {
  const isCollapsed = siteNav.getAttribute('data-collapsed') === 'true';
  siteNav.setAttribute('data-collapsed', String(!isCollapsed));
  navToggle.setAttribute('aria-expanded', String(isCollapsed));
}

navToggle?.addEventListener('click', toggleNav);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      siteNav.setAttribute('data-collapsed', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const sections = document.querySelectorAll('main .section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(sec => observer.observe(sec));

const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

