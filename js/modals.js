let isModalOpen = false;
let prevFocus = null;

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  if (!modal || !closeBtn) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-project]');
    if (btn) {
      e.preventDefault();
      openModal(btn.getAttribute('data-project'));
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) closeModal();
    if (e.key === 'Tab' && isModalOpen) trapFocus(e);
  });
}

function trapFocus(e) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openModal(project) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  prevFocus = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  isModalOpen = true;

  if (project === 'portfolio') renderPortfolio();
  else if (project === 'taskly') renderTaskly();
  else if (project === 'weatherly') renderWeather();

  requestAnimationFrame(() => {
    const cb = document.getElementById('modalClose');
    if (cb) cb.focus();
  });
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  isModalOpen = false;
  if (prevFocus) { prevFocus.focus(); prevFocus = null; }
  setTimeout(() => {
    if (!isModalOpen) {
      const body = document.getElementById('modalBody');
      if (body) body.innerHTML = '';
    }
  }, 300);
}

function renderPortfolio() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Portfolio Accent & Tagline Swapper';

  let views = parseInt(localStorage.getItem('simulated_views') || '1428');

  body.innerHTML = `
    <div class="builder-dashboard">
      <p style="font-size:0.95rem;margin-bottom:1rem;opacity:0.7;">
        Welcome to Leon's real-time Portfolio Customizer! Play with the colors and tagline below.
      </p>
      <div class="builder-section glass">
        <h3 class="builder-section-title">Accent Color Palette</h3>
        <div class="swatches-grid">
          <button class="color-swatch-btn active" data-accent="#DEDBC8" data-hover="#c5c2a8">
            <span class="swatch-circle" style="background:#DEDBC8;"></span> Cream
          </button>
          <button class="color-swatch-btn" data-accent="#B600A8" data-hover="#95008a">
            <span class="swatch-circle" style="background:#B600A8;"></span> Purple
          </button>
          <button class="color-swatch-btn" data-accent="#00bfa5" data-hover="#009688">
            <span class="swatch-circle" style="background:#00bfa5;"></span> Teal
          </button>
          <button class="color-swatch-btn" data-accent="#ff6b4a" data-hover="#e04e2c">
            <span class="swatch-circle" style="background:#ff6b4a;"></span> Orange
          </button>
          <button class="color-swatch-btn" data-accent="#3b82f6" data-hover="#2563eb">
            <span class="swatch-circle" style="background:#3b82f6;"></span> Blue
          </button>
        </div>
      </div>
      <div class="builder-section glass">
        <h3 class="builder-section-title">Change Tagline</h3>
        <div class="builder-input-group">
          <input type="text" id="customTaglineInput" class="builder-input" value="Web developer in Nairobi, Kenya" maxlength="60">
          <button id="applyTaglineBtn" class="builder-btn">Apply</button>
        </div>
      </div>
      <div class="builder-stats-box glass">
        <div class="builder-stats-info">
          <span class="builder-stats-num" id="viewsCounter">${views}</span>
          <span class="builder-stats-label">Simulated Visitors</span>
        </div>
        <button id="incrementViewsBtn" class="builder-btn">Boost Stats</button>
      </div>
    </div>
  `;

  body.querySelectorAll('.color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('.color-swatch-btn').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--color-primary', btn.getAttribute('data-accent'));
      document.documentElement.style.setProperty('--color-primary-hover', btn.getAttribute('data-hover'));
    });
  });

  const activeReset = body.querySelector('.color-swatch-btn.active');
  if (activeReset) {
    document.documentElement.style.setProperty('--color-primary', activeReset.getAttribute('data-accent'));
    document.documentElement.style.setProperty('--color-primary-hover', activeReset.getAttribute('data-hover'));
  }

  body.querySelector('#applyTaglineBtn').addEventListener('click', () => {
    const val = body.querySelector('#customTaglineInput').value.trim();
    if (val) {
      const tagline = document.querySelector('.hero-tagline');
      if (tagline) {
        tagline.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        tagline.appendChild(cursor);
        let i = 0;
        const interval = setInterval(() => {
          if (i < val.length) {
            cursor.insertAdjacentText('beforebegin', val.charAt(i));
            i++;
          } else {
            clearInterval(interval);
            setTimeout(() => { if (cursor.parentNode) cursor.remove(); }, 3000);
          }
        }, 30);
      }
    }
  });

  body.querySelector('#incrementViewsBtn').addEventListener('click', () => {
    views += Math.floor(Math.random() * 20) + 5;
    localStorage.setItem('simulated_views', views.toString());
    body.querySelector('#viewsCounter').textContent = views;
  });
}

function renderTaskly() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Taskly: Kanban Board Dashboard';

  let tasks = JSON.parse(localStorage.getItem('kanban_tasks') || '[]');
  if (!tasks.length) {
    tasks = [
      { id: '1', title: 'Design personal web portfolio layout', status: 'done' },
      { id: '2', title: 'Integrate dynamic IntersectionObserver', status: 'progress' },
      { id: '3', title: 'Set up customized database back-end API', status: 'todo' }
    ];
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  }

  function draw() {
    body.innerHTML = `
      <div class="kanban-dashboard">
        <p style="font-size:0.95rem;margin-bottom:1rem;opacity:0.7;">
          Organize your milestones. Add, move, or delete tasks!
        </p>
        <div class="kanban-controls">
          <input type="text" id="newTaskInput" class="kanban-input" placeholder="Enter task..." maxlength="80">
          <button id="addTaskBtn" class="kanban-add-btn">+ Add</button>
        </div>
        <div class="kanban-board">
          <div class="kanban-column column-todo">
            <div class="kanban-column-header"><span>To Do</span><span class="kanban-column-count" id="todo-count">0</span></div>
            <div class="kanban-tasks" id="tasks-todo"></div>
          </div>
          <div class="kanban-column column-progress">
            <div class="kanban-column-header"><span>In Progress</span><span class="kanban-column-count" id="progress-count">0</span></div>
            <div class="kanban-tasks" id="tasks-progress"></div>
          </div>
          <div class="kanban-column column-done">
            <div class="kanban-column-header"><span>Completed</span><span class="kanban-column-count" id="done-count">0</span></div>
            <div class="kanban-tasks" id="tasks-done"></div>
          </div>
        </div>
      </div>
    `;

    const cols = {
      todo: body.querySelector('#tasks-todo'),
      progress: body.querySelector('#tasks-progress'),
      done: body.querySelector('#tasks-done')
    };
    const counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach(task => {
      counts[task.status]++;
      const card = document.createElement('div');
      card.className = 'kanban-task-card glass';
      card.innerHTML = `
        <h4 class="kanban-task-title">${esc(task.title)}</h4>
        <div class="kanban-task-actions">
          ${task.status !== 'todo' ? `<button class="kanban-task-btn move-left" data-id="${task.id}">&#9664;</button>` : ''}
          ${task.status !== 'done' ? `<button class="kanban-task-btn move-right" data-id="${task.id}">&#9654;</button>` : ''}
          <button class="kanban-task-btn delete-task" data-id="${task.id}">&#128683;</button>
        </div>
      `;
      cols[task.status].appendChild(card);
    });

    body.querySelector('#todo-count').textContent = counts.todo;
    body.querySelector('#progress-count').textContent = counts.progress;
    body.querySelector('#done-count').textContent = counts.done;

    body.querySelector('#addTaskBtn').addEventListener('click', addTask);
    body.querySelector('#newTaskInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
    body.querySelectorAll('.move-left').forEach(b => b.addEventListener('click', () => move(b.getAttribute('data-id'), -1)));
    body.querySelectorAll('.move-right').forEach(b => b.addEventListener('click', () => move(b.getAttribute('data-id'), 1)));
    body.querySelectorAll('.delete-task').forEach(b => b.addEventListener('click', () => del(b.getAttribute('data-id'))));
  }

  function addTask() {
    const input = body.querySelector('#newTaskInput');
    const val = input.value.trim();
    if (!val) return;
    tasks.push({ id: Date.now().toString(), title: val, status: 'todo' });
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    draw();
  }

  function move(id, dir) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const stages = ['todo', 'progress', 'done'];
    const idx = stages.indexOf(task.status) + dir;
    if (idx >= 0 && idx < stages.length) {
      task.status = stages[idx];
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
      draw();
    }
  }

  function del(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    draw();
  }

  draw();
}

function renderWeather() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Weatherly: Climate Forecast';

  const preset = {
    nairobi: { name: 'Nairobi', country: 'Kenya', temp: 22, desc: 'Partly Cloudy', icon: '\u26C5', humidity: '64%', wind: '15 km/h', pressure: '1016 hPa', forecast: [22, 23, 21, 22, 23] },
    london: { name: 'London', country: 'United Kingdom', temp: 14, desc: 'Light Rain', icon: '\uD83C\uDF27', humidity: '82%', wind: '22 km/h', pressure: '1008 hPa', forecast: [14, 15, 12, 13, 16] },
    'new york': { name: 'New York', country: 'United States', temp: 19, desc: 'Sunny', icon: '\u2600\uFE0F', humidity: '45%', wind: '12 km/h', pressure: '1012 hPa', forecast: [19, 21, 22, 18, 17] }
  };

  function show(city) {
    const c = city.trim().toLowerCase();
    body.innerHTML = `
      <div class="weather-dashboard">
        <div class="weather-search-row">
          <input type="text" id="weatherCityInput" class="weather-input" value="${esc(city)}" placeholder="Search city..." maxlength="40">
          <button id="weatherSearchBtn" class="weather-search-btn">Search</button>
        </div>
        <div class="weather-loading">
          <div class="weather-spinner"></div>
          <p style="font-size:0.9rem;opacity:0.6;">Fetching data for ${esc(city)}...</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      let data = preset[c];
      if (!data) {
        let hash = 0;
        for (let i = 0; i < c.length; i++) hash += c.charCodeAt(i);
        const temp = Math.abs(hash % 25) + 10;
        const conditions = [
          { desc: 'Clear Skies', icon: '\u2600\uFE0F', hum: '35%', wind: '8 km/h' },
          { desc: 'Scattered Clouds', icon: '\u26C5', hum: '55%', wind: '12 km/h' },
          { desc: 'Overcast', icon: '\u2601\uFE0F', hum: '72%', wind: '10 km/h' },
          { desc: 'Light Drizzle', icon: '\uD83C\uDF27', hum: '85%', wind: '18 km/h' },
          { desc: 'Storms', icon: '\u26C8\uFE0F', hum: '92%', wind: '28 km/h' }
        ][hash % 5];
        const cap = city.charAt(0).toUpperCase() + city.slice(1);
        data = {
          name: cap, country: 'Global Station', temp,
          desc: conditions.desc, icon: conditions.icon,
          humidity: conditions.hum, wind: conditions.wind,
          pressure: (1000 + hash % 20) + ' hPa',
          forecast: [temp, temp + 1, temp - 2, temp + 2, temp - 1]
        };
      }

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      body.innerHTML = `
        <div class="weather-dashboard">
          <div class="weather-search-row">
            <input type="text" id="weatherCityInput" class="weather-input" value="${esc(data.name)}" placeholder="Search city...">
            <button id="weatherSearchBtn" class="weather-search-btn">Search</button>
          </div>
          <div class="weather-display-container">
            <div class="weather-main-card glass">
              <div class="weather-city-info">
                <h3 class="weather-city-name">${esc(data.name)}</h3>
                <span class="weather-city-country">${esc(data.country)}</span>
                <div class="weather-temp-group">
                  <span class="weather-temp">${data.temp}</span>
                  <span class="weather-temp-unit">°C</span>
                </div>
                <span class="weather-desc">${esc(data.desc)}</span>
              </div>
              <span class="weather-emoji-icon">${data.icon}</span>
            </div>
            <div class="weather-details-grid">
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Humidity</span>
                <span class="weather-detail-value">${data.humidity}</span>
              </div>
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Wind</span>
                <span class="weather-detail-value">${data.wind}</span>
              </div>
              <div class="weather-detail-item glass">
                <span class="weather-detail-label">Pressure</span>
                <span class="weather-detail-value">${data.pressure}</span>
              </div>
            </div>
            <div class="weather-chart-section glass">
              <h4 class="weather-chart-title">5-Day Forecast</h4>
              <div class="weather-chart">
                ${data.forecast.map((t, i) => `
                  <div class="weather-chart-bar-container">
                    <span class="weather-chart-temp">${t}°</span>
                    <div class="weather-chart-bar" style="height:${Math.max(20, Math.min(95, ((t - 5) / 35) * 100))}%"></div>
                    <span class="weather-chart-day">${days[i]}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      body.querySelector('#weatherSearchBtn').addEventListener('click', search);
      body.querySelector('#weatherCityInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') search(); });
      function search() {
        const v = body.querySelector('#weatherCityInput').value.trim();
        if (v) show(v);
      }
    }, 700);
  }

  show('Nairobi');
}
