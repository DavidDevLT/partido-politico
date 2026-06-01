/**
 * Alianza por el Progreso — Script principal
 * Navegación, animaciones, galería, búsqueda, formularios y más
 */

(function () {
  'use strict';

  /* --- Utilidades --- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Tema claro / oscuro --- */
  const themeToggle = $('#themeToggle');
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  if (storedTheme) {
    setTheme(storedTheme);
  } else if (systemDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* --- Header scroll y menú móvil --- */
  const header = $('#header');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  $$('.nav__menu a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Revelar elementos al scroll --- */
  const revealElements = $$('.reveal');

  if (!prefersReducedMotion && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), Number(delay));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  /* --- Contadores animados --- */
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return num.toLocaleString('es-PE');
    return num.toString();
  }

  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = formatNumber(target);
    }
    requestAnimationFrame(update);
  }

  const statNumbers = $$('.stat-card__number');
  if (statNumbers.length && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            if (!isNaN(target)) animateCounter(el, target);
            statsObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => statsObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) el.textContent = formatNumber(target);
    });
  }

  /* --- Galería con filtros y modal --- */
  const galleryFilters = $$('.gallery-filter');
  const galleryItems = $$('.gallery-item');
  const galleryModal = $('#galleryModal');
  const galleryModalImg = $('#galleryModalImg');
  const galleryModalTitle = $('#galleryModalTitle');
  const galleryModalClose = $('#galleryModalClose');

  galleryFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  function openGalleryModal(imgSrc, caption) {
    galleryModalImg.src = imgSrc;
    galleryModalImg.alt = caption;
    galleryModalTitle.textContent = caption;
    galleryModal.hidden = false;
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryModal() {
    galleryModal.classList.remove('active');
    galleryModal.hidden = true;
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption')?.textContent || '';
      openGalleryModal(img.src, caption);
    });
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  galleryModalClose?.addEventListener('click', closeGalleryModal);
  galleryModal?.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeGalleryModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal?.classList.contains('active')) {
      closeGalleryModal();
    }
  });

  /* --- Videos por pestañas --- */
  const videoTabs = $$('.video-tab');
  const videoCards = $$('.video-card');

  videoTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      videoTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.tab;
      videoCards.forEach((card) => {
        card.classList.toggle('hidden', card.dataset.category !== category);
      });
    });
  });

  /* --- Línea de tiempo interactiva --- */
  const timelineItems = $$('.timeline-item');
  let timelineIndex = 0;

  function setTimelineActive(index) {
    timelineIndex = Math.max(0, Math.min(index, timelineItems.length - 1));
    timelineItems.forEach((item, i) => {
      item.classList.toggle('active', i === timelineIndex);
    });
    timelineItems[timelineIndex]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }

  $('#timelinePrev')?.addEventListener('click', () => setTimelineActive(timelineIndex - 1));
  $('#timelineNext')?.addEventListener('click', () => setTimelineActive(timelineIndex + 1));

  timelineItems.forEach((item, i) => {
    item.addEventListener('click', () => setTimelineActive(i));
  });

  /* --- Carrusel de testimonios --- */
  const testimonialSlides = $$('.testimonial-slide');
  const testimonialsDots = $('#testimonialsDots');
  let testimonialIndex = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === testimonialIndex);
    });
    $$('.testimonials-dots button').forEach((dot, i) => {
      dot.classList.toggle('active', i === testimonialIndex);
      dot.setAttribute('aria-selected', i === testimonialIndex);
    });
  }

  testimonialSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      showTestimonial(i);
      resetTestimonialAutoplay();
    });
    testimonialsDots?.appendChild(dot);
  });

  function startTestimonialAutoplay() {
    if (prefersReducedMotion) return;
    testimonialInterval = setInterval(() => {
      showTestimonial(testimonialIndex + 1);
    }, 6000);
  }

  function resetTestimonialAutoplay() {
    clearInterval(testimonialInterval);
    startTestimonialAutoplay();
  }

  if (testimonialSlides.length) {
    showTestimonial(0);
    startTestimonialAutoplay();
  }

  /* --- Barras de progreso animadas --- */
  const progressFills = $$('.progress-fill');
  if (progressFills.length && !prefersReducedMotion) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.style.width;
            fill.style.width = '0';
            requestAnimationFrame(() => {
              fill.style.width = width;
            });
            progressObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );
    progressFills.forEach((el) => progressObserver.observe(el));
  }

  /* --- Formulario de participación --- */
  const participateForm = $('#participateForm');
  const formFeedback = $('#formFeedback');

  participateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.className = 'form-feedback';

    const nombre = $('#nombre').value.trim();
    const email = $('#email').value.trim();
    const checkboxes = $$('input[name="interes"]:checked', participateForm);

    if (!nombre || !email) {
      formFeedback.textContent = 'Por favor completa los campos obligatorios.';
      formFeedback.classList.add('error');
      return;
    }

    if (checkboxes.length === 0) {
      formFeedback.textContent = 'Selecciona al menos una forma de participar.';
      formFeedback.classList.add('error');
      return;
    }

    // Simulación de envío — conectar con backend o servicio de correo
    formFeedback.textContent = '¡Gracias por tu interés! Hemos recibido tu solicitud. Nos comunicaremos contigo pronto.';
    formFeedback.classList.add('success');
    participateForm.reset();
  });

  /* --- Buscador de contenido --- */
  const searchToggle = $('#searchToggle');
  const searchModal = $('#searchModal');
  const searchBackdrop = $('#searchBackdrop');
  const searchClose = $('#searchClose');
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');

  const searchIndex = [
    { title: 'Logros de gestión', section: '#logros', keywords: 'obras hospitales escuelas carreteras beneficiarios' },
    { title: 'Plan de Gobierno / Propuestas', section: '#propuestas', keywords: 'economía educación salud seguridad empleo medio ambiente tecnología' },
    { title: 'Galería de obras', section: '#galeria', keywords: 'infraestructura educación salud seguridad social' },
    { title: 'Biblioteca de videos', section: '#videos', keywords: 'discursos testimonios institucional gestión youtube' },
    { title: 'Línea de tiempo', section: '#cronologia', keywords: 'historia hitos reconocimientos gestión' },
    { title: 'Transparencia', section: '#transparencia', keywords: 'informes documentos presupuesto auditoría pdf' },
    { title: 'Participa / Afiliación', section: '#participa', keywords: 'voluntario afiliarse eventos noticias formulario' },
    { title: 'Noticias y actividades', section: '#noticias', keywords: 'comunicados eventos agenda campaña' },
    { title: 'Equipo de trabajo', section: '#equipo', keywords: 'autoridades candidatos' },
    { title: 'Preguntas frecuentes', section: '#faq', keywords: 'faq dudas afiliación elecciones financiamiento' },
    { title: 'Mensaje del líder', section: '#lider', keywords: 'candidata visión maría vargas' },
    { title: 'Testimonios', section: '#testimonios', keywords: 'ciudadanos beneficiarios comunidad' },
  ];

  function openSearch() {
    searchModal?.classList.add('active');
    searchModal?.setAttribute('aria-hidden', 'false');
    searchInput?.focus();
  }

  function closeSearch() {
    searchModal?.classList.remove('active');
    searchModal?.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchToggle?.addEventListener('click', openSearch);
  searchBackdrop?.addEventListener('click', closeSearch);
  searchClose?.addEventListener('click', closeSearch);

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query.length < 2) return;

    const matches = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
    );

    matches.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.title;
      li.setAttribute('role', 'option');
      li.addEventListener('click', () => {
        closeSearch();
        const target = document.querySelector(item.section);
        target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
      searchResults.appendChild(li);
    });

    if (matches.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No se encontraron resultados.';
      li.style.cursor = 'default';
      searchResults.appendChild(li);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
      closeSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  /* --- Navegación activa al scroll --- */
  const sections = $$('section[id]');
  const navLinks = $$('.nav__menu a');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              link.style.color = href === `#${id}` ? 'var(--color-accent)' : '';
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((sec) => navObserver.observe(sec));
  }

  /* --- Pausar video hero si pestaña no visible (ahorro recursos) --- */
  const heroVideo = $('.hero__video');
  document.addEventListener('visibilitychange', () => {
    if (!heroVideo) return;
    if (document.hidden) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  });

})();
