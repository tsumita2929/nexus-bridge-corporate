/* ========================================
   NEXUS BRIDGE — Dark Atelier Script
   ======================================== */

(function () {
  'use strict';

  // --- Scroll Reveal with staggered timing ---
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal--card, .reveal--left, .reveal--right, .reveal--image, .reveal--scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('header__nav--mobile-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');

      const svg = menuBtn.querySelector('svg');
      if (isOpen) {
        svg.innerHTML = `
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="6" y1="18" x2="18" y2="6"/>
        `;
      } else {
        svg.innerHTML = `
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        `;
      }
    });

    mainNav.querySelectorAll('.header__nav-link, .header__contact-btn').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('header__nav--mobile-open')) {
        closeMobileMenu();
        menuBtn.focus();
      }
    });

    function closeMobileMenu() {
      mainNav.classList.remove('header__nav--mobile-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'メニューを開く');
      const svg = menuBtn.querySelector('svg');
      svg.innerHTML = `
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      `;
    }
  }

  // --- Back to Top (smooth) ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stats__number');

  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/^([\d,]+)/);
    if (!match) return;

    const targetStr = match[1];
    const target = parseInt(targetStr.replace(/,/g, ''), 10);
    const suffix = text.slice(match[0].length);
    const hasComma = targetStr.includes(',');
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out quartic
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(target * eased);

      const display = hasComma ? current.toLocaleString() : String(current);
      el.innerHTML = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));

  // --- Header scroll effect (subtle opacity shift) ---
  const header = document.querySelector('.header');

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      header.style.background = 'rgba(8, 8, 13, 0.97)';
      header.style.borderBottomColor = 'rgba(200, 168, 130, 0.06)';
    } else {
      header.style.background = 'rgba(8, 8, 13, 0.92)';
      header.style.borderBottomColor = 'rgba(232, 228, 223, 0.07)';
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // --- Smooth parallax on hero image ---
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    function handleHeroParallax() {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      if (scrollY <= maxScroll) {
        const translate = scrollY * 0.15;
        heroBg.style.transform = `translateY(${translate}px) scale(1.05)`;
      }
    }

    window.addEventListener('scroll', handleHeroParallax, { passive: true });
  }
})();
