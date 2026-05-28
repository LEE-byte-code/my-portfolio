
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
  initThemeToggle();
  initProjectModals();
  initSetupCopyFeature();
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

/**
 * FEATURE 9: Premium Light/Dark Theme Switcher
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const iconEl = toggleBtn.querySelector('.theme-toggle-icon');

  // Check saved preference
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.body.classList.add('light-theme');
    if (iconEl) iconEl.textContent = '💡';
  } else {
    document.body.classList.remove('light-theme');
    if (iconEl) iconEl.textContent = '🔌';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    if (iconEl) iconEl.textContent = isLight ? '💡' : '🔌';
    
    // Smooth transition pop!
    toggleBtn.style.transform = 'scale(0.9) rotate(15deg)';
    setTimeout(() => {
      toggleBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
  });
}

/**
 * FEATURE 10: Interactive Project Playground Modal System
 */
let isModalOpen = false;

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  
  if (!modal || !closeBtn) return;

  // Intercept data-project clicks
  const liveButtons = document.querySelectorAll('[data-project]');
  liveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const project = btn.getAttribute('data-project');
      openProjectModal(project);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closeProjectModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeProjectModal();
    }
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Lock background scroll
  isModalOpen = true;

  // Render specific content
  if (project === 'portfolio') {
    renderPortfolioBuilder();
  } else if (project === 'taskly') {
    renderTasklyKanban();
  } else if (project === 'weatherly') {
    renderWeatherDashboard();
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Unlock scroll
  isModalOpen = false;

  // Clear modal body shortly after transition completes
  setTimeout(() => {
    if (!isModalOpen) {
      const body = document.getElementById('modalBody');
      if (body) body.innerHTML = '';
    }
  }, 300);
}

/**
 * PROJECT 1 RENDER: Portfolio Live Accent Swapper & Customizer
 */
function renderPortfolioBuilder() {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  if (!modalTitle || !modalBody) return;

  modalTitle.textContent = "Portfolio Accent & Tagline Swapper";

  // Read current color state or set default
  const activeColor = document.documentElement.style.getPropertyValue('--color-primary') || '#00bfa5';
  
  // Custom tagline default
  const currentTagline = document.getElementById('typing-tagline')?.textContent?.replace('|', '')?.trim() || "Web developer in Nairobi, Kenya";

  // Increment simulated counter
  let viewsCount = parseInt(localStorage.getItem('simulated_views') || '1428');

  modalBody.innerHTML = `
    <div class="builder-dashboard">
      <p class="section-subtitle" style="font-size: 0.95rem; margin-bottom: 1rem;">
        Welcome to Leon's real-time Portfolio Customizer! Play with the colors and tagline below to customize your current experience of this website.
      </p>

      <div class="builder-section glass">
        <h3 class="builder-section-title">Accent Color Palette</h3>
        <div class="swatches-grid">
          <button class="color-swatch-btn ${activeColor.trim() === '#00bfa5' || activeColor === '' ? 'active' : ''}" data-accent="#00bfa5" data-accent-hover="#009688">
            <span class="swatch-circle" style="background-color: #00bfa5;"></span> Teal (Default)
          </button>
          <button class="color-swatch-btn ${activeColor.trim() === '#8b5cf6' ? 'active' : ''}" data-accent="#8b5cf6" data-accent-hover="#7c3aed">
            <span class="swatch-circle" style="background-color: #8b5cf6;"></span> Cyber Purple
          </button>
          <button class="color-swatch-btn ${activeColor.trim() === '#ff6b4a' ? 'active' : ''}" data-accent="#ff6b4a" data-accent-hover="#e04e2c">
            <span class="swatch-circle" style="background-color: #ff6b4a;"></span> Solar Orange
          </button>
          <button class="color-swatch-btn ${activeColor.trim() === '#3b82f6' ? 'active' : ''}" data-accent="#3b82f6" data-accent-hover="#2563eb">
            <span class="swatch-circle" style="background-color: #3b82f6;"></span> Electric Blue
          </button>
        </div>
      </div>

      <div class="builder-section glass">
        <h3 class="builder-section-title">Change Hero Typing Tagline</h3>
        <div class="builder-input-group">
          <input type="text" id="customTaglineInput" class="builder-input" value="${escapeHTML(currentTagline)}" placeholder="e.g. Front-End Engineer & Architect" maxlength="60">
          <button id="applyTaglineBtn" class="builder-btn">Apply & Type</button>
        </div>
      </div>

      <div class="builder-stats-box glass">
        <div class="builder-stats-info">
          <span class="builder-stats-num" id="viewsCounterText">${viewsCount}</span>
          <span class="builder-stats-label">Simulated Portfolio Visitors</span>
        </div>
        <button id="incrementViewsBtn" class="builder-btn" style="background-color: var(--color-accent-orange); color: #fff;">
          🏗️ Boost Stats
        </button>
      </div>
    </div>
  `;

  // Swatch interaction
  const swatches = modalBody.querySelectorAll('.color-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const accent = btn.getAttribute('data-accent');
      const accentHover = btn.getAttribute('data-accent-hover');
      
      // Update variables in root!
      document.documentElement.style.setProperty('--color-primary', accent);
      document.documentElement.style.setProperty('--color-primary-hover', accentHover);
      
      // Update nav logo badge backcolor
      const badge = document.querySelector('.nav-logo-badge');
      if (badge) {
        badge.style.backgroundColor = accent;
      }
    });
  });

  // Tagline applier
  const applyBtn = modalBody.querySelector('#applyTaglineBtn');
  const input = modalBody.querySelector('#customTaglineInput');
  applyBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (val) {
      const taglineEl = document.getElementById('typing-tagline');
      if (taglineEl) {
        taglineEl.textContent = val;
        // Retrigger typing!
        closeProjectModal();
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          initTypingAnimation();
        }, 600);
      }
    }
  });

  // Counter boost
  const boostBtn = modalBody.querySelector('#incrementViewsBtn');
  const counterText = modalBody.querySelector('#viewsCounterText');
  boostBtn.addEventListener('click', () => {
    viewsCount += Math.floor(Math.random() * 20) + 5;
    localStorage.setItem('simulated_views', viewsCount.toString());
    counterText.textContent = viewsCount;
    
    boostBtn.style.transform = 'scale(0.95)';
    setTimeout(() => boostBtn.style.transform = 'scale(1)', 100);
  });
}

/**
 * PROJECT 2 RENDER: Taskly Kanban Board Dashboard
 */
function renderTasklyKanban() {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  if (!modalTitle || !modalBody) return;

  modalTitle.textContent = "Taskly: Kanban Board Dashboard";

  // Load task state
  let tasks = JSON.parse(localStorage.getItem('kanban_tasks') || '[]');
  
  if (tasks.length === 0) {
    tasks = [
      { id: '1', title: 'Design personal web portfolio layout', status: 'done' },
      { id: '2', title: 'Integrate dynamic IntersectionObserver', status: 'progress' },
      { id: '3', title: 'Set up customized database back-end API', status: 'todo' }
    ];
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  }

  function drawBoard() {
    modalBody.innerHTML = `
      <div class="kanban-dashboard">
        <p class="section-subtitle" style="font-size: 0.95rem; margin-bottom: 1rem;">
          Organize your milestones. Add, move, or delete tasks! Updates persist in your local storage.
        </p>

        <div class="kanban-controls">
          <input type="text" id="newTaskInput" class="kanban-input" placeholder="Enter task description..." maxlength="80">
          <button id="addTaskBtn" class="kanban-add-btn">+ Add</button>
        </div>

        <div class="kanban-board">
          <!-- TODO Column -->
          <div class="kanban-column column-todo">
            <div class="kanban-column-header">
              <span>To Do</span>
              <span class="kanban-column-count" id="todo-count">0</span>
            </div>
            <div class="kanban-tasks" id="tasks-todo"></div>
          </div>

          <!-- PROGRESS Column -->
          <div class="kanban-column column-progress">
            <div class="kanban-column-header">
              <span>In Progress</span>
              <span class="kanban-column-count" id="progress-count">0</span>
            </div>
            <div class="kanban-tasks" id="tasks-progress"></div>
          </div>

          <!-- DONE Column -->
          <div class="kanban-column column-done">
            <div class="kanban-column-header">
              <span>Completed</span>
              <span class="kanban-column-count" id="done-count">0</span>
            </div>
            <div class="kanban-tasks" id="tasks-done"></div>
          </div>
        </div>
      </div>
    `;

    const todoCol = modalBody.querySelector('#tasks-todo');
    const progCol = modalBody.querySelector('#tasks-progress');
    const doneCol = modalBody.querySelector('#tasks-done');

    let counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach(task => {
      counts[task.status]++;
      
      const card = document.createElement('div');
      card.className = 'kanban-task-card glass';
      card.innerHTML = `
        <h4 class="kanban-task-title">${escapeHTML(task.title)}</h4>
        <div class="kanban-task-actions">
          ${task.status !== 'todo' ? `<button class="kanban-task-btn move-left-btn" data-id="${task.id}" title="Move left">◀</button>` : ''}
          ${task.status !== 'done' ? `<button class="kanban-task-btn move-right-btn" data-id="${task.id}" title="Move right">▶</button>` : ''}
          <button class="kanban-task-btn delete-btn" data-id="${task.id}" title="Delete task">🔨</button>
        </div>
      `;
      
      if (task.status === 'todo') todoCol.appendChild(card);
      else if (task.status === 'progress') progCol.appendChild(card);
      else if (task.status === 'done') doneCol.appendChild(card);
    });

    modalBody.querySelector('#todo-count').textContent = counts.todo;
    modalBody.querySelector('#progress-count').textContent = counts.progress;
    modalBody.querySelector('#done-count').textContent = counts.done;

    modalBody.querySelector('#addTaskBtn').addEventListener('click', createNewTask);
    modalBody.querySelector('#newTaskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') createNewTask();
    });

    modalBody.querySelectorAll('.move-left-btn').forEach(btn => {
      btn.addEventListener('click', () => moveTask(btn.getAttribute('data-id'), -1));
    });
    modalBody.querySelectorAll('.move-right-btn').forEach(btn => {
      btn.addEventListener('click', () => moveTask(btn.getAttribute('data-id'), 1));
    });
    modalBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteTask(btn.getAttribute('data-id')));
    });
  }

  function createNewTask() {
    const input = modalBody.querySelector('#newTaskInput');
    const val = input.value.trim();
    if (!val) return;

    const newTask = {
      id: Date.now().toString(),
      title: val,
      status: 'todo'
    };

    tasks.push(newTask);
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    drawBoard();
  }

  function moveTask(id, dir) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const stages = ['todo', 'progress', 'done'];
    const currIndex = stages.indexOf(task.status);
    const nextIndex = currIndex + dir;

    if (nextIndex >= 0 && nextIndex < stages.length) {
      task.status = stages[nextIndex];
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
      drawBoard();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    drawBoard();
  }

  drawBoard();
}

/**
 * PROJECT 3 RENDER: Weatherly Climate Forecast Portal
 */
function renderWeatherDashboard() {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  if (!modalTitle || !modalBody) return;

  modalTitle.textContent = "Weatherly: Climate Forecast";

  const presetWeather = {
    'nairobi': { name: 'Nairobi', country: 'Kenya 🇰🇪', temp: 22, desc: 'Partly Cloudy', icon: '🌤️', humidity: '64%', wind: '15 km/h', pressure: '1016 hPa', forecast: [22, 23, 21, 22, 23] },
    'london': { name: 'London', country: 'United Kingdom 🇬🇧', temp: 14, desc: 'Light Rain showers', icon: '🌧️', humidity: '82%', wind: '22 km/h', pressure: '1008 hPa', forecast: [14, 15, 12, 13, 16] },
    'new york': { name: 'New York', country: 'United States 🇺🇸', temp: 19, desc: 'Sunny and Clear', icon: '☀️', humidity: '45%', wind: '12 km/h', pressure: '1012 hPa', forecast: [19, 21, 22, 18, 17] },
    'tokyo': { name: 'Tokyo', country: 'Japan 🇯🇵', temp: 24, desc: 'Overcast cloud', icon: '☁️', humidity: '70%', wind: '9 km/h', pressure: '1015 hPa', forecast: [24, 23, 25, 26, 22] },
    'paris': { name: 'Paris', country: 'France 🇫🇷', temp: 17, desc: 'Scattered clouds', icon: '⛅', humidity: '58%', wind: '10 km/h', pressure: '1013 hPa', forecast: [17, 18, 19, 16, 15] },
    'sydney': { name: 'Sydney', country: 'Australia 🇦🇺', temp: 16, desc: 'Heavy Storms', icon: '⛈️', humidity: '90%', wind: '34 km/h', pressure: '998 hPa', forecast: [16, 17, 15, 14, 18] }
  };

  function showWeather(cityName) {
    const cleanName = cityName.trim().toLowerCase();
    
    modalBody.innerHTML = `
      <div class="weather-dashboard">
        <div class="weather-search-row">
          <input type="text" id="weatherCityInput" class="weather-input" value="${escapeHTML(cityName)}" placeholder="Search city... (e.g. London, Nairobi)" maxlength="40">
          <button id="weatherSearchBtn" class="weather-search-btn">Search</button>
        </div>
        <div class="weather-loading">
          <div class="weather-spinner"></div>
          <p class="section-subtitle" style="font-size: 0.9rem;">Fetching meteorological data for ${escapeHTML(cityName)}...</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      let data = presetWeather[cleanName];
      
      if (!data) {
        // Procedurally generate realistic weather metrics for any queried city!
        let hash = 0;
        for (let i = 0; i < cleanName.length; i++) hash += cleanName.charCodeAt(i);
        const temp = Math.abs(hash % 25) + 10; // Temp 10°C to 35°C
        const conditionIndex = hash % 5;
        const conditions = [
          { desc: 'Clear Skies', icon: '☀️', hum: '35%', wind: '8 km/h' },
          { desc: 'Scattered Clouds', icon: '⛅', hum: '55%', wind: '12 km/h' },
          { desc: 'Overcast Mist', icon: '☁️', hum: '72%', wind: '10 km/h' },
          { desc: 'Light Drizzle', icon: '🌧️', hum: '85%', wind: '18 km/h' },
          { desc: 'Thunderstorms', icon: '⛈️', hum: '92%', wind: '28 km/h' }
        ];
        const cond = conditions[conditionIndex];
        const forecast = [temp, temp + 1, temp - 2, temp + 2, temp - 1];

        const capCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        data = {
          name: capCity,
          country: 'Global Station 📡',
          temp: temp,
          desc: cond.desc,
          icon: cond.icon,
          humidity: cond.hum,
          wind: cond.wind,
          pressure: (1000 + (hash % 20)).toString() + ' hPa',
          forecast: forecast
        };
      }

      modalBody.innerHTML = `
        <div class="weather-dashboard">
          <div class="weather-search-row">
            <input type="text" id="weatherCityInput" class="weather-input" value="${escapeHTML(data.name)}" placeholder="Search city... (e.g. London, Nairobi)">
            <button id="weatherSearchBtn" class="weather-search-btn">Search</button>
          </div>

          <div class="weather-display-container">
            <div class="weather-main-card glass">
              <div class="weather-city-info">
                <h3 class="weather-city-name">${escapeHTML(data.name)}</h3>
                <span class="weather-city-country">${escapeHTML(data.country)}</span>
                <div class="weather-temp-group">
                  <span class="weather-temp">${data.temp}</span>
                  <span class="weather-temp-unit">°C</span>
                </div>
                <span class="weather-desc">${escapeHTML(data.desc)}</span>
              </div>
              <span class="weather-emoji-icon" aria-hidden="true">${data.icon}</span>
            </div>

            <div class="weather-details-grid">
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Humidity</span>
                <span class="weather-detail-value">${data.humidity}</span>
              </div>
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Wind Speed</span>
                <span class="weather-detail-value">${data.wind}</span>
              </div>
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Pressure</span>
                <span class="weather-detail-value">${data.pressure}</span>
              </div>
            </div>

            <div class="weather-chart-section glass">
              <h4 class="weather-chart-title">5-Day Temperature Projection</h4>
              <div class="weather-chart">
                ${data.forecast.map((t, idx) => {
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                  const heightPercentage = Math.max(20, Math.min(95, ((t - 5) / 35) * 100));
                  return `
                    <div class="weather-chart-bar-container">
                      <span class="weather-chart-temp">${t}°</span>
                      <div class="weather-chart-bar" style="height: ${heightPercentage}%"></div>
                      <span class="weather-chart-day">${days[idx]}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      const searchBtn = modalBody.querySelector('#weatherSearchBtn');
      const input = modalBody.querySelector('#weatherCityInput');
      
      searchBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (val) showWeather(val);
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = input.value.trim();
          if (val) showWeather(val);
        }
      });
    }, 800);
  }

  showWeather('Nairobi');
}

/**
 * HELPER: Escape string characters to prevent arbitrary script injections
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/**
 * FEATURE 10: VS Code Extension Copy Command Feature
 */
function initSetupCopyFeature() {
  const copyButtons = document.querySelectorAll('.setup-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const extId = btn.getAttribute('data-id');
      const command = `code --install-extension ${extId}`;
      
      navigator.clipboard.writeText(command).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '📋 Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy command: ', err);
      });
    });
  });
}

