const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

requestAnimationFrame(() => document.body.classList.add('page-ready'));

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.innerHTML = '<span></span>';
document.body.appendChild(progress);
const progressBar = progress.firstElementChild;

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  progressBar.style.transform = `scaleX(${value})`;
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

const closeMenu = () => {
  if (!mobileMenu || !menuBtn) return;
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const willOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', willOpen);
    menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    document.body.classList.toggle('menu-open', willOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const interactiveCards = document.querySelectorAll('.card,.project-card,.skill-premium,.home-profile-card');
interactiveCards.forEach(card => {
  card.classList.add('tilt-active');
  card.addEventListener('pointermove', e => {
    if (reduceMotion || window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    const rx = ((y / r.height) - .5) * -3;
    const ry = ((x / r.width) - .5) * 3;
    card.style.transform = `translateY(-5px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

window.addEventListener('pageshow', () => document.body.classList.add('page-ready'));
