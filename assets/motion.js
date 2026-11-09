(() => {
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.site-header nav a')];
  const header = document.querySelector('.site-header');
  let scheduled = false;

  function updateNavigation() {
    scheduled = false;
    const boundary = header.getBoundingClientRect().bottom + 48;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) current = section;
    }
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleNavigation() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }

  updateNavigation();
  document.documentElement.classList.add('has-scrollspy');
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  window.addEventListener('pageshow', scheduleNavigation);

  if (!('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  if (!motion.matches) {
    for (const item of document.querySelectorAll('.home-section > .section-heading, .project, .star-list > li, .about-prose')) {
      if (item.getBoundingClientRect().top < window.innerHeight - 24) continue;
      item.classList.add('scroll-reveal', 'reveal-pending');
      observer.observe(item);
    }
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    for (const item of document.querySelectorAll('.reveal-pending')) item.classList.remove('reveal-pending');
  });
})();
