/* ============================================================
   SERENITÀ — main.js
   Navbar scroll | Scroll reveal | Stagger cards | Marquee pause
   Testimonial fade carousel | Stats counter | Burger menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. NAVBAR — shrink + background on scroll
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();


  /* ──────────────────────────────────────────────
     2. BURGER MENU (mobile)
  ────────────────────────────────────────────── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when any mobile link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL — generic .scroll-reveal elements
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────────
     4. SCROLL STAGGER — service cards
  ────────────────────────────────────────────── */
  const staggerEls = document.querySelectorAll('.scroll-stagger');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  staggerEls.forEach(el => staggerObserver.observe(el));


  /* ──────────────────────────────────────────────
     5. TESTIMONIAL FADE CAROUSEL
        Auto-advances every 5 s; dots are clickable
  ────────────────────────────────────────────── */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.dot');
  let   currentT     = 0;
  let   testimonialTimer;

  function showTestimonial(index) {
    // hide all
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // show target
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentT = index;
  }

  function nextTestimonial() {
    const next = (currentT + 1) % testimonials.length;
    showTestimonial(next);
  }

  function startTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(nextTestimonial, 5000);
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showTestimonial(i);
      startTimer(); // reset timer on manual click
    });
  });

  // Pause on hover
  const testimonialWrap = document.querySelector('.testimonial-wrap');
  if (testimonialWrap) {
    testimonialWrap.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
    testimonialWrap.addEventListener('mouseleave', startTimer);
  }

  // Init
  showTestimonial(0);
  startTimer();


  /* ──────────────────────────────────────────────
     6. STATS COUNTER ANIMATION
        Counts from 0 to data-target when in view
  ────────────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-PT');
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(el => statsObserver.observe(el));


  /* ──────────────────────────────────────────────
     7. MARQUEE — pause on hover (CSS handles it,
        but we also add JS control for touch)
  ────────────────────────────────────────────── */
  const marqueeInner = document.getElementById('marqueeInner');

  if (marqueeInner) {
    marqueeInner.addEventListener('touchstart', () => {
      marqueeInner.style.animationPlayState = 'paused';
    }, { passive: true });

    marqueeInner.addEventListener('touchend', () => {
      marqueeInner.style.animationPlayState = 'running';
    }, { passive: true });
  }


  /* ──────────────────────────────────────────────
     8. SMOOTH ACTIVE NAV LINK on scroll
  ────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navAnchors.forEach(a => {
      a.classList.remove('active-nav');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active-nav');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ──────────────────────────────────────────────
     9. FORM SUBMIT — simple feedback
  ────────────────────────────────────────────── */
  const formBtn = document.querySelector('.agenda-form .btn-primary');

  if (formBtn) {
    formBtn.addEventListener('click', () => {
      const inputs  = document.querySelectorAll('.agenda-form input, .agenda-form select');
      let   valid   = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'rgba(196,131,106,.7)';
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
      });

      if (valid) {
        formBtn.textContent = '✓ Pedido enviado — entraremos em contacto em breve!';
        formBtn.style.background = '#5A7A5E';
        formBtn.disabled = true;
        inputs.forEach(input => { input.value = ''; });
      }
    });
  }


  /* ──────────────────────────────────────────────
     10. PARALLAX subtle — hero image on scroll
  ────────────────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img');

  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
      }
    }, { passive: true });
  }

});