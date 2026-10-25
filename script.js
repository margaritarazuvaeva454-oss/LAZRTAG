document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. ХЕДЕР ПРИ СКРОЛЛЕ ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---------- 2. МОБИЛЬНОЕ МЕНЮ ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- 3. АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ СКРОЛЛЕ ---------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const menuLinks = document.querySelectorAll('.nav-links a');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        menuLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => activeLinkObserver.observe(sec));

  /* ---------- 4. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-text, .facts, .card, .rules li, .award, .event, .gallery figure, .quote, ' +
    '.section-sub, .status-box, .status-future .card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- 5. СЧЁТЧИКИ ЦИФР ---------- */
  const counters = document.querySelectorAll('.num[data-target]');
  let countersStarted = false;

  function animateCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.5 });

  if (counters.length) countersObserver.observe(counters[0]);

  /* ---------- 6. ЛАЙТБОКС ГАЛЕРЕИ ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery figure img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- 8. ОБРАТНЫЙ ОТСЧЁТ ДО ТУРНИРОВ ---------- */
  const countdowns = document.querySelectorAll('.countdown');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(cd){
    const target = new Date(cd.dataset.date).getTime();
    const now = Date.now();
    const diff = target - now;

    // событие началось или прошло
    if (diff <= 0){
      cd.classList.add('started');
      cd.classList.remove('soon');
      cd.innerHTML = '<span>Турнир уже начался!</span>';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const set = (unit, val) => {
      const el = cd.querySelector(`[data-unit="${unit}"]`);
      if (el) el.textContent = pad(val);
    };
    set('days', days);
    set('hours', hours);
    set('minutes', minutes);
    set('seconds', seconds);

    // меньше суток — подсветить
    cd.classList.toggle('soon', diff < 86400000);
  }

  function tickCountdowns(){
    countdowns.forEach(updateCountdown);
  }

  if (countdowns.length){
    tickCountdowns();
    setInterval(tickCountdowns, 1000);
  }

  /* ---------- 7. КНОПКА НАВЕРХ ---------- */
  const toTop = document.getElementById('toTop');

  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 600);
  });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});