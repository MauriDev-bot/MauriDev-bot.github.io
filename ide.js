(function(){
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', () => {
      const isCollapsed = siteNav.dataset.collapsed === 'true';
      siteNav.dataset.collapsed = String(!isCollapsed);
      navToggle.setAttribute('aria-expanded', String(isCollapsed));
    });
  }
  // Año del footer
  const yearSpan = document.getElementById('year');
  if(yearSpan){ yearSpan.textContent = new Date().getFullYear(); }

  // Asegurar altura del iframe de JDoodle si pym tarda en ajustar
  const ensureIdeHeight = () => {
    const iframe = document.querySelector('.ide-embed iframe');
    if(iframe){
      const minH = getComputedStyle(document.documentElement).getPropertyValue('--ide-min-h').trim();
      const minPx = parseInt(minH,10) || 820;
      if(iframe.clientHeight < minPx){ iframe.style.minHeight = minPx + 'px'; }
    }
  };
  // Intentos iniciales + resize
  let tries = 0; const tick = setInterval(()=>{ ensureIdeHeight(); if(++tries>20) clearInterval(tick); }, 300);
  window.addEventListener('resize', ensureIdeHeight);
})();
