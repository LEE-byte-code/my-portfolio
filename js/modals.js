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

/* ─── PORTFOLIO ACCENT BUILDER ─── */
function renderPortfolio() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Portfolio Customizer';

  const accentColors = [
    { name: 'Cream', color: '#DEDBC8', hover: '#c5c2a8' },
    { name: 'Purple', color: '#B600A8', hover: '#95008a' },
    { name: 'Teal', color: '#00bfa5', hover: '#009688' },
    { name: 'Orange', color: '#ff6b4a', hover: '#e04e2c' },
    { name: 'Blue', color: '#3b82f6', hover: '#2563eb' }
  ];

  body.innerHTML = `
    <div class="demo-dashboard">
      <div class="demo-section">
        <h3 class="demo-section-title">Accent Color</h3>
        <div class="swatch-row">
          ${accentColors.map(c => `
            <button class="swatch-btn${c.color === '#DEDBC8' ? ' active' : ''}"
                    data-color="${c.color}" data-hover="${c.hover}">
              <span class="swatch-dot" style="background:${c.color}"></span>
              ${c.name}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  body.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('.swatch-btn').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const color = btn.dataset.color;
      const hover = btn.dataset.hover;
      document.documentElement.style.setProperty('--color-primary', color);
      document.documentElement.style.setProperty('--color-primary-hover', hover);
      document.documentElement.style.setProperty('--gradient-btn', `linear-gradient(135deg, ${color}, ${hover})`);
    });
  });
}

/* ─── KANBAN BOARD ─── */
function renderTaskly() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Kanban Board';

  let tasks = JSON.parse(localStorage.getItem('kanban_tasks') || '[]');
  if (!tasks.length) {
    tasks = [
      { id: '1', title: 'Design portfolio layout', status: 'done' },
      { id: '2', title: 'Add IntersectionObserver animations', status: 'progress' },
      { id: '3', title: 'Build backend API', status: 'todo' }
    ];
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  }

  function render() {
    body.innerHTML = `
      <div class="kanban-wrap">
        <div class="kanban-input-row">
          <input type="text" id="taskInput" class="demo-input" placeholder="Add a task..." maxlength="80">
          <button id="addTask" class="demo-btn">Add</button>
        </div>
        <div class="kanban-cols">
          <div class="kanban-col" data-status="todo">
            <div class="kanban-col-head todo-head">
              <span>To Do</span>
              <span class="kanban-count" id="todoCount">0</span>
            </div>
            <div class="kanban-list" id="todoList"></div>
          </div>
          <div class="kanban-col" data-status="progress">
            <div class="kanban-col-head progress-head">
              <span>In Progress</span>
              <span class="kanban-count" id="progressCount">0</span>
            </div>
            <div class="kanban-list" id="progressList"></div>
          </div>
          <div class="kanban-col" data-status="done">
            <div class="kanban-col-head done-head">
              <span>Done</span>
              <span class="kanban-count" id="doneCount">0</span>
            </div>
            <div class="kanban-list" id="doneList"></div>
          </div>
        </div>
      </div>
    `;

    const statusMap = { todo: 'todoList', progress: 'progressList', done: 'doneList' };
    const counts = { todo: 0, progress: 0, done: 0 };

    tasks.forEach(t => {
      counts[t.status]++;
      const list = document.getElementById(statusMap[t.status]);
      if (!list) return;
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <span class="kanban-card-title">${esc(t.title)}</span>
        <div class="kanban-card-actions">
          ${t.status !== 'todo' ? `<button class="kanban-move" data-id="${t.id}" data-dir="-1">&#8592;</button>` : ''}
          ${t.status !== 'done' ? `<button class="kanban-move" data-id="${t.id}" data-dir="1">&#8594;</button>` : ''}
          <button class="kanban-del" data-id="${t.id}">&#10005;</button>
        </div>
      `;
      list.appendChild(card);
    });

    document.getElementById('todoCount').textContent = counts.todo;
    document.getElementById('progressCount').textContent = counts.progress;
    document.getElementById('doneCount').textContent = counts.done;

    document.getElementById('addTask').addEventListener('click', add);
    document.getElementById('taskInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
    body.querySelectorAll('.kanban-move').forEach(b => b.addEventListener('click', () => move(b.dataset.id, parseInt(b.dataset.dir))));
    body.querySelectorAll('.kanban-del').forEach(b => b.addEventListener('click', () => remove(b.dataset.id)));
  }

  function add() {
    const input = document.getElementById('taskInput');
    const val = input.value.trim();
    if (!val) return;
    tasks.push({ id: Date.now().toString(), title: val, status: 'todo' });
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    render();
  }

  function move(id, dir) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const stages = ['todo', 'progress', 'done'];
    const idx = stages.indexOf(t.status) + dir;
    if (idx >= 0 && idx < stages.length) {
      t.status = stages[idx];
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
      render();
    }
  }

  function remove(id) {
    tasks = tasks.filter(x => x.id !== id);
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    render();
  }

  render();
}

/* ─── WEATHER DASHBOARD ─── */
function renderWeather() {
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (!title || !body) return;
  title.textContent = 'Weather Dashboard';

  const presetData = {
    nairobi:     { name: 'Nairobi',     country: 'Kenya',           temp: 22, desc: 'Partly Cloudy', icon: '\u26C5',       humidity: '64%',  wind: '15 km/h', pressure: '1016 hPa', forecast: [22, 23, 21, 22, 24] },
    london:      { name: 'London',      country: 'United Kingdom',  temp: 14, desc: 'Light Rain',   icon: '\uD83C\uDF27',  humidity: '82%',  wind: '22 km/h', pressure: '1008 hPa', forecast: [14, 15, 12, 13, 16] },
    'new york':  { name: 'New York',    country: 'United States',   temp: 19, desc: 'Sunny',       icon: '\u2600\uFE0F',  humidity: '45%',  wind: '12 km/h', pressure: '1012 hPa', forecast: [19, 21, 22, 18, 17] },
    tokyo:       { name: 'Tokyo',       country: 'Japan',           temp: 17, desc: 'Clear',       icon: '\u2600\uFE0F',  humidity: '55%',  wind: '10 km/h', pressure: '1014 hPa', forecast: [17, 19, 18, 16, 20] },
    dubai:       { name: 'Dubai',       country: 'UAE',             temp: 35, desc: 'Hot & Sunny', icon: '\u2600\uFE0F',  humidity: '28%',  wind: '8 km/h',  pressure: '1005 hPa', forecast: [35, 36, 34, 35, 33] }
  };

  function generateCity(city) {
    let hash = 0;
    for (let i = 0; i < city.length; i++) hash += city.charCodeAt(i);
    const temp = Math.abs(hash % 25) + 10;
    const conditions = [
      { desc: 'Clear Skies',     icon: '\u2600\uFE0F', hum: '35%',  wind: '8 km/h'  },
      { desc: 'Scattered Clouds',icon: '\u26C5',        hum: '55%',  wind: '12 km/h' },
      { desc: 'Overcast',       icon: '\u2601\uFE0F', hum: '72%',  wind: '10 km/h' },
      { desc: 'Light Drizzle',  icon: '\uD83C\uDF27',  hum: '85%',  wind: '18 km/h' },
      { desc: 'Thunderstorms',  icon: '\u26C8\uFE0F', hum: '92%',  wind: '28 km/h' }
    ][hash % 5];
    const cap = city.charAt(0).toUpperCase() + city.slice(1);
    return {
      name: cap, country: 'Global Station', temp,
      desc: conditions.desc, icon: conditions.icon,
      humidity: conditions.hum, wind: conditions.wind,
      pressure: (1000 + hash % 20) + ' hPa',
      forecast: [temp, temp + 1, temp - 2, temp + 2, temp - 1]
    };
  }

  function show(city) {
    const key = city.trim().toLowerCase();
    body.innerHTML = `
      <div class="weather-wrap">
        <div class="weather-search-row">
          <input type="text" id="cityInput" class="demo-input" value="${esc(city)}" placeholder="Search city...">
          <button id="searchCity" class="demo-btn">Search</button>
        </div>
        <div class="weather-loading">
          <div class="weather-spinner"></div>
          <p class="weather-loading-text">Loading ${esc(city)}...</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      const data = presetData[key] || generateCity(city);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

      body.innerHTML = `
        <div class="weather-wrap">
          <div class="weather-search-row">
            <input type="text" id="cityInput" class="demo-input" value="${esc(data.name)}" placeholder="Search city...">
            <button id="searchCity" class="demo-btn">Search</button>
          </div>
          <p style="font-size:0.7rem;opacity:0.5;text-align:center;margin:0;">Simulated data &mdash; not real-time</p>
          <div class="weather-card">
            <div class="weather-main">
              <div>
                <h3 class="weather-city">${esc(data.name)}</h3>
                <span class="weather-country">${esc(data.country)}</span>
                <div class="weather-temp-row">
                  <span class="weather-temp">${data.temp}</span>
                  <span class="weather-temp-unit">°C</span>
                </div>
                <span class="weather-desc">${esc(data.desc)}</span>
              </div>
              <span class="weather-icon">${data.icon}</span>
            </div>
            <div class="weather-details">
              <div class="weather-detail">
                <span class="weather-detail-label">Humidity</span>
                <span class="weather-detail-value">${data.humidity}</span>
              </div>
              <div class="weather-detail">
                <span class="weather-detail-label">Wind</span>
                <span class="weather-detail-value">${data.wind}</span>
              </div>
              <div class="weather-detail">
                <span class="weather-detail-label">Pressure</span>
                <span class="weather-detail-value">${data.pressure}</span>
              </div>
            </div>
            <div class="weather-forecast">
              <h4 class="weather-forecast-title">5-Day Forecast</h4>
              <div class="weather-chart">
                ${data.forecast.map((t, i) => `
                  <div class="weather-bar-wrap">
                    <span class="weather-bar-temp">${t}°</span>
                    <div class="weather-bar" style="height:${Math.max(18, (t - 5) / 35 * 100)}%"></div>
                    <span class="weather-bar-day">${days[i]}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('searchCity').addEventListener('click', search);
      document.getElementById('cityInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });

      function search() {
        const v = document.getElementById('cityInput').value.trim();
        if (v) show(v);
      }
    }, 600);
  }

  show('Nairobi');
}
