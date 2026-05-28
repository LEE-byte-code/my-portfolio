/**
 * Leon Mwangi - Developer Portfolio Interactivity Scripts
 * Pure Vanilla JavaScript implementation of requested features.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initSmoothScrolling();
  initMobileMenu();
  initScrollAnimations();
  initTypingAnimation();
  initActiveNavHighlight();
  initSkillsAnimation();
  initBackToTopAndNavbarScroll();
});

/**
 * FEATURE 1: Smooth Scrolling with 80px Navbar Offset
 */
function initSmoothScrolling() {
  const scrollLinks = document.querySelectorAll('.nav-link, .nav-logo, .footer-nav-link, .footer-back-to-top, .btn-primary[href^="#"], .btn-secondary[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Only process local links
      if (targetId && targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Accessibility: Focus target element if possible
          targetElement.focus({ preventScroll: true });
        }
      }
    });
  });
}

/**
 * FEATURE 2: Scroll Fade-In Animations using IntersectionObserver
 */
function initScrollAnimations() {
  // Staggered reveal for grid containers
  const staggerContainers = document.querySelectorAll('.stagger-container');
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const items = container.querySelectorAll('.fade-hidden');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('fade-visible');
          }, index * 100); // 100ms stagger delay
        });
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(container => {
    staggerObserver.observe(container);
  });

  // Individual reveal for non-staggered elements
  const individualObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe all fade-hidden elements that are NOT inside a stagger container
  const individualElements = document.querySelectorAll('.fade-hidden');
  individualElements.forEach(el => {
    // Check if element has a stagger-container ancestor
    if (!el.closest('.stagger-container')) {
      individualObserver.observe(el);
    }
  });
}

/**
 * FEATURE 3: Mobile Hamburger Menu
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !header) return;

  // Toggle menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = header.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) {
      header.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * FEATURE 5: Typing Animation on Tagline
 */
function initTypingAnimation() {
  const tagline = document.getElementById('typing-tagline');
  if (!tagline) return;

  const text = tagline.textContent.trim();
  tagline.textContent = ''; // Clear text
  
  // Make sure element is visible during typing
  tagline.style.opacity = '1';

  let index = 0;
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  cursorSpan.textContent = '|';
  
  // Append cursor at start
  tagline.appendChild(cursorSpan);

  const typingInterval = setInterval(() => {
    if (index < text.length) {
      // Insert character before cursor
      cursorSpan.insertAdjacentText('beforebegin', text.charAt(index));
      index++;
    } else {
      clearInterval(typingInterval);
      // Remove cursor after 3 seconds
      setTimeout(() => {
        if (cursorSpan.parentNode) {
          cursorSpan.remove();
        }
      }, 3000);
    }
  }, 60); // 60ms delay
}

/**
 * FEATURE 6: Active Navigation Link Highlight
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px', // Center active range
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * FEATURE 7: Skills Progress Bar Animation
 */
function initSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const skillBars = skillsSection.querySelectorAll('.skill-bar');

  // Keep width at 0 initially (CSS overrides handle fallback)
  skillBars.forEach(bar => {
    bar.style.width = '0';
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each skill progress bar when visible
        skillBars.forEach((bar, index) => {
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = `${targetWidth}%`;
          }, index * 150); // 150ms stagger delay
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsSection);
}

/**
 * FEATURE 4 & FEATURE 8: Sticky Navbar Scroll Class & Back to Top Button
 */
function initBackToTopAndNavbarScroll() {
  const navbar = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');
  
  let isScrolling = false;
  
  // Throttled scroll listener
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScrollUpdates();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  function handleScrollUpdates() {
    const scrollPos = window.scrollY;
    
    // Feature 4: Sticky navbar scroll style (scrolled > 80px)
    if (navbar) {
      if (scrollPos > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }
    
    // Feature 8: Back to top button visibility (scrolled > 400px)
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  // Feature 8: Back to Top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Run once initially to set starting state
  handleScrollUpdates();
}
