/**
 * ============================================================================
 * SHRUTI GADILKAR — PORTFOLIO ENGINE
 * 
 * Features:
 * 1. 240-Frame Scroll-Synchronized Canvas Animation (Preserved & Optimized)
 * 2. Active Section Highlighting in Navigation
 * 3. Sticky Glass Header Elevation on Scroll
 * 4. Responsive Mobile Drawer Navigation
 * 5. Subtle IntersectionObserver Scroll Reveal Animations
 * ============================================================================
 */

// --- 1. CANVAS SCROLL ANIMATION (PRESERVED CORE) ---
const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `new_frames/frame_${index.toString().padStart(6, '0')}.jpg`
);

const images = [];

// Preload all 240 animation frames for smooth scrubbing
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

preloadImages();

  // Render initial frame once available
  const renderFirstFrame = () => {
    if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
      canvas.width = images[0].naturalWidth || images[0].width;
      canvas.height = images[0].naturalHeight || images[0].height;
      context.drawImage(images[0], 0, 0);
    }
  };

  if (images[0]) {
    if (images[0].complete) {
      renderFirstFrame();
    } else {
      images[0].onload = renderFirstFrame;
    }
  }

  // Function to draw the frame corresponding to current scroll fraction
  let lastDrawnIndex = -1;
  const updateImage = index => {
    index = Math.max(1, Math.min(index, frameCount));
    if (index === lastDrawnIndex) return;

    const img = images[index - 1];
    if (img && img.complete) {
      context.drawImage(img, 0, 0);
      lastDrawnIndex = index;
    }
  };

  // Scroll listener with requestAnimationFrame sync
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = html.scrollTop || document.body.scrollTop;
        const maxScrollTop = Math.max(1, html.scrollHeight - window.innerHeight);
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));

        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        );

        updateImage(frameIndex + 1);
        handleScrollUI(scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  // --- 2. HEADER & NAVIGATION INTERACTIONS ---
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Elevated header styling on scroll
  const handleScrollUI = (scrollTop) => {
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active section spy
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  // Mobile Drawer Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking outside or on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


// --- 3. SUBTLE SCROLL REVEAL (INTERSECTION OBSERVER) ---
document.addEventListener('DOMContentLoaded', () => {
        // Initial frame render fallback check
        setTimeout(renderFirstFrame, 200);

        // Setup subtle entrance reveals
        const revealElements = document.querySelectorAll(
          '.about-container, .timeline-item, .project-card, .prestige-card, .achievement-card, .skill-category-card, .education-card, .cert-card, .contact-card-container'
        );

        revealElements.forEach(el => el.classList.add('reveal-init'));

        if ('IntersectionObserver' in window) {
          const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
              }
            });
          }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
          });

          revealElements.forEach(el => revealObserver.observe(el));
        } else {
          // Fallback if IntersectionObserver not supported
          revealElements.forEach(el => el.classList.add('reveal-visible'));
        }
      });
