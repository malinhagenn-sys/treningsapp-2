// Main app logic
const App = {
  currentView: 'hjem',
  currentSession: null,
  currentMetric: 'vol',

  init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    this.renderNav();
    this.showView('hjem');
    this.checkDailyCoach();
  },

  renderNav() {
    const nav = document.getElementById('nav');
    const items = [
      { id: 'hjem', icon: '⚡', label: 'Hjem' },
      { id: 'logg', icon: '📋', label: 'Logg' },
      { id: 'progresjon', icon: '📈', label: 'Graf' },
      { id: 'pr', icon: '🏆', label: 'PR' },
      { id: 'coach', icon: '💬', label: 'Coach' },
      { id: 'bibliotek', icon: '📚', label: 'Bibliotek' },
      { id: 'plan', icon: '⚙️', label: 'Plan' },
    ];
    nav.innerHTML = items.map(i => `
      <button class="nav-btn${this.currentView === i.id ? ' active' : ''}" onclick="App.showView('${i.id}')">
        <span class="nav-icon">${i.icon}</span>
        <span class="nav-label">${i.label}</span>
      </button>
    `).join('');
  },

  showView(view) {
    this.currentView = view;
    this.renderNav();
    const main = document.getElementById('main');

    const views = {
      hjem: () => this.renderHjem(),
      logg: () => this.renderLogg(),
      progresjon: () => this.renderProgresjon(),
      pr: () => this.renderPR(),
      coach: () => this.renderCoach(),
      plan: () => this.renderPlan(),
      goals: () => this.renderGoals(),
      bibliotek: () => this.renderBibliotek(),
    };

    main.innerHTML = '';
    if (views[view]) views[view]();
  },

  // ---- HJEM ----
  renderHjem() {
    const today = new Date().toISOString().split('T')[0];
    const dagsform = DB.getDagsformForDate(today);
    const hist = DB.getHistory();
    const lastSess = hist.length ? hist[hist.length - 1] : null;
    const mens = DB.isMens(today);
    const pr = DB.getPR();
    const prCount = Object.keys(pr).length;

    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="hjem-header">
        <div class="hjem-greeting">${this.greeting()}</div>
        <div class="hjem-date">${this.formatDate(today)}${mens ? ' <span class="mens-pill">🌸 Menstruasjonsuke</span>' : ''}</div>
      </div>

      ${!dagsform ? `
      <div class="card dagsform-prompt">
        <div class="card-title">Hvordan er formen i dag?</div>
        <div class="dagsform-grid">
          <div class="df-item">
            <label>Søvn (timer)</label>
            <input type="number" id="df-sovn" min="0" max="14" step="0.5" placeholder="7.5">
          </div>
          <div class="df-item">
            <label>Søvnkvalitet</label>
            <div class="slider-row">
              <input type="range" id="df-sovnkval" min="1" max="10" value="7" step="1" oninput="document.getElementById('df-sovnkval-out').textContent=this.value">
              <span id="df-sovnkval-out">7</span>
            </div>
          </div>
          <div class="df-item">
            <label>Restitusjon</label>
            <div class="slider-row">
              <input type="range" id="df-rest" min="1" max="10" value="7" step="1" oninput="document.getElementById('df-rest-out').textContent=this.value">
              <span id="df-rest-out">7</span>
            </div>
          </div>
          <div class="df-item">
            <label>Energinivå</label>
            <div class="slider-row">
              <input type="range" id="df-energi" min="1" max="10" value="7" step="1" oninput="document.getElementById('df-energi-out').textContent=this.value">
              <span id="df-energi-out">7</span>
            </div>
          </div>
          <div class="df-item">
            <label>Protein (gram)</label>
            <input type="number" id="df-protein" min="0" max="500" placeholder="150">
          </div>
          <div class="df-item mens-toggle-item">
            <label>Menstruasjonsuke?</label>
            <button class="toggle-pill${mens ? ' on' : ''}" id="mens-home-btn" onclick="App.toggleMensHome()">${mens ? 'Ja' : 'Nei'}</button>
          </div>
        </div>
        <button class="btn-primary" onclick="App.saveDagsform()">Lagre dagsform</button>
      </div>` : `
      <div class="card dagsform-summary">
        <div class="card-title">Dagsform i dag</div>
        <div class="df-summary-grid">
          <div class="df-stat"><span class="df-stat-val">${dagsform.sovn}t</span><span class="df-stat-label">Søvn</span></div>
          <div class="df-stat"><span class="df-stat-val">${dagsform.sovnKvalitet}/10</span><span class="df-stat-label">Kvalitet</span></div>
          <div class="df-stat"><span class="df-stat-val">${dagsform.restitusjon}/10</span><span class="df-stat-label">Restitusjon</span></div>
          <div class="df-stat"><span class="df-stat-val">${dagsform.energi}/10</span><span class="df-stat-label">Energi</span></div>
          <div class="df-stat"><span class="df-stat-val">${dagsform.protein}g</span><span class="df-stat-label">Protein</span></div>
        </div>
        <button class="btn-ghost small" onclick="DB.saveDagsform('${today}', null); App.renderHjem()">Endre</button>
      </div>`}

      <div class="quick-session-title">Start økt</div>
      <div class="session-grid">
        ${Object.keys(DB.getPlan()).map(s => `
          <button class="session-card" onclick="App.startSession('${s}')">
            <span class="session-name">${s}</span>
            <span class="session-arrow">→</span>
          </button>
        `).join('')}
      </div>

      <div class="stats-row">
        <div class="stat-card" onclick="App.showView('pr')">
          <div class="stat-val">${prCount}</div>
          <div class="stat-label">PR-er</div>
        </div>
        <div class="stat-card" onclick="App.showView('progresjon')">
          <div class="stat-val">${hist.length}</div>
          <div class="stat-label">Økter</div>
        </div>
        <div class="stat-card" onclick="App.showView('goals')">
          <div class="stat-val">${DB.getGoals().length}</div>
          <div class="stat-label">Mål</div>
        </div>
      </div>

      ${lastSess ? `
      <div class="card last-session">
        <div class="card-title">Siste økt</div>
        <div class="last-sess-info">${lastSess.session} · ${this.formatDate(lastSess.date)}</div>
      </div>` : ''}

      <div class="card coach-teaser" onclick="App.showView('coach')">
        <div class="coach-icon">💬</div>
        <div class="coach-text">
          <div class="coach-label">Coach</div>
          <div class="coach-hint">Spør meg om trening, kosthold eller progresjon →</div>
        </div>
      </div>
    `;
  },

  toggleMensHome() {
    const today = new Date().toISOString().split('T')[0];
    const on = DB.toggleMens(today);
    const btn = document.getElementById('mens-home-btn');
    if (btn) { btn.className = 'toggle-pill' + (on ? ' on' : ''); btn.textContent = on ? 'Ja' : 'Nei'; }
  },

  saveDagsform() {
    const today = new Date().toISOString().split('T')[0];
    const data = {
      sovn: parseFloat(document.getElementById('df-sovn').value) || 0,
      sovnKvalitet: parseInt(document.getElementById('df-sovnkval').value) || 7,
      restitusjon: parseInt(document.getElementById('df-rest').value) || 7,
      energi: parseInt(document.getElementById('df-energi').value) || 7,
      protein: parseInt(document.getElementById('df-protein').value) || 0,
    };
    DB.saveDagsform(today, data);
    this.renderHjem();
  },

  greeting() {
    const h = new Date().getHours();
    if (h < 10) return 'God morgen 🌅';
    if (h < 17) return 'God dag 💪';
    return 'God kveld 🌙';
  },

  formatDate(d) {
    return new Date(d).toLocaleDateString('no-NO', { weekday: 'long', day: 'numeric', month: 'long' });
  },

  // ---- LOGG ----
  startSession(session) {
    this.currentSession = session;
    this.showView('logg');
  },

  renderLogg() {
    const plan = DB.getPlan();
    const sessions = Object.keys(plan);
    const session = this.currentSession || sessions[0];
    this.currentSession = session;

    const main = document.getElementById('main');
    const today = new Date().toISOString().split('T')[0];
    const mens = DB.isMens(today);
    const pr = DB.getPR();

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title">Logg økt</div>
      </div>
      <div class="session-tabs">
        ${sessions.map(s => `<button class="sess-tab${s === session ? ' active' : ''}" onclick="App.currentSession='${s}'; App.renderLogg()">${s}</button>`).join('')}
      </div>
      <div class="date-mens-row">
        <input type="date" id="log-date" value="${today}">
        <button class="toggle-pill${mens ? ' on' : ''}" id="mens-log-btn" onclick="App.toggleMensLog()">${mens ? '🌸 Mens' : 'Mens?'}</button>
      </div>
      <div id="coach-pre-msg" class="coach-pre-card">
        <div class="coach-pre-loading">Henter råd fra coach...</div>
      </div>
      <div id="exercises-container"></div>
      <div class="log-actions">
        <button class="btn-primary" onclick="App.saveLog()">Lagre økt 💾</button>
        <span id="log-status" class="log-status"></span>
      </div>
    `;

    this.renderExercises(session, plan[session], pr);
    this.loadPreCoachMessage(session);
  },

  toggleMensLog() {
    const date = document.getElementById('log-date')?.value || new Date().toISOString().split('T')[0];
    const on = DB.toggleMens(date);
    const btn = document.getElementById('mens-log-btn');
    if (btn) { btn.className = 'toggle-pill' + (on ? ' on' : ''); btn.textContent = on ? '🌸 Mens' : 'Mens?'; }
  },

  async loadPreCoachMessage(session) {
    const el = document.getElementById('coach-pre-msg');
    if (!el) return;
    const msg = await Coach.getPreWorkoutMessage(session);
    el.innerHTML = `<div class="coach-bubble"><span class="coach-avatar">💬</span><div class="coach-msg-text">${msg}</div></div>`;
  },

  renderExercises(session, exercises, pr) {
    const container = document.getElementById('exercises-container');
    if (!container) return;

    container.innerHTML = exercises.map(ex => {
      const last = this.getLastEntry(session, ex.name);
      const adv = this.getAdvice(ex, last);
      const prev = last ? (last.sets || []).filter(s => s && s.kg && s.reps).map(s => `${s.kg}kg×${s.reps}`).join(', ') : null;
      const prVal = pr[ex.name];

      return `
        <div class="ex-card">
          <div class="ex-card-header">
            <div class="ex-info">
              <div class="ex-name" onclick="App.toggleMuscleView('${ex.name}')" style="cursor:pointer">${ex.name} <span style="font-size:11px;color:var(--text3)">▾</span></div>
              <div id="muscle-view-${ex.name.replace(/\s/g,'_')}" style="display:none;margin-top:8px;text-align:center">${Muscles.renderSVG(ex.name, 120)}</div>
              <div class="ex-meta">${ex.repRange}${prVal ? ` · PR: <span class="pr-inline">${prVal.kg}kg</span>` : ''}</div>
              ${Muscles.renderMuscleChips(ex.name)}
            </div>
            <span class="badge ${adv.type === 'increase' ? 'badge-up' : 'badge-ok'}">${adv.badge}</span>
          </div>
          <div class="advice-strip ${adv.type === 'increase' ? 'advice-up' : 'advice-ok'}">${adv.text}</div>
          ${prev ? `<div class="prev-info">Sist: ${prev}</div>` : ''}
          <div class="sets-grid">
            ${Array.from({ length: ex.sets }, (_, i) => {
              const lastKg = last && last.sets && last.sets[i] ? last.sets[i].kg : '';
              return `<div class="set-item">
                <div class="set-num">Sett ${i + 1}</div>
                <div class="set-inputs">
                  <input type="number" placeholder="${lastKg || 'kg'}" min="0" step="0.5" data-ex="${ex.name}" data-set="${i}" data-field="kg" class="set-input">
                  <span class="set-x">×</span>
                  <input type="number" placeholder="reps" min="0" step="1" data-ex="${ex.name}" data-set="${i}" data-field="reps" class="set-input">
                </div>
              </div>`;
            }).join('')}
          </div>
          <textarea class="ex-notes" data-ex-note="${ex.name}" placeholder="Notater..."></textarea>
        </div>
      `;
    }).join('');
  },

  getLastEntry(session, exName) {
    const hist = DB.getHistory().filter(e => e.session === session);
    if (!hist.length) return null;
    const last = hist[hist.length - 1];
    return (last.exercises || []).find(e => e.name === exName) || null;
  },

  getAdvice(ex, last) {
    if (!last || !(last.sets || []).some(s => s && parseFloat(s.kg) > 0 && parseInt(s.reps) > 0)) {
      return { type: 'ok', text: 'Ingen forrige logg – velg vekt du er komfortabel med.', badge: 'Logg vekt' };
    }
    const valid = (last.sets || []).filter(s => s && parseFloat(s.kg) > 0 && parseInt(s.reps) > 0);
    const avgReps = valid.reduce((a, s) => a + parseInt(s.reps), 0) / valid.length;
    const lastKg = parseFloat(valid[0].kg);
    const inc = ex.maxReps >= 15 ? 2.5 : 5;
    if (valid.every(s => parseInt(s.reps) >= ex.maxReps)) {
      return { type: 'increase', text: `Nådde toppen sist (${Math.round(avgReps)} reps snitt) – øk med ${inc} kg → prøv ${lastKg + inc} kg.`, badge: 'Øk vekt' };
    } else if (valid.every(s => parseInt(s.reps) >= ex.minReps)) {
      return { type: 'ok', text: `Bra sist! Hold ${lastKg} kg og jobb mot ${ex.maxReps} reps.`, badge: 'Bygg reps' };
    } else {
      return { type: 'ok', text: `Hold ${lastKg} kg – nå ${ex.minReps} reps på alle sett først.`, badge: 'Hold vekt' };
    }
  },

  saveLog() {
    const session = this.currentSession;
    const plan = DB.getPlan();
    const exercises = plan[session];
    const date = document.getElementById('log-date')?.value || new Date().toISOString().split('T')[0];
    const mens = DB.isMens(date);

    const exMap = {};
    document.querySelectorAll('input[data-ex]').forEach(inp => {
      const n = inp.dataset.ex, si = parseInt(inp.dataset.set), f = inp.dataset.field;
      if (!exMap[n]) exMap[n] = [];
      if (!exMap[n][si]) exMap[n][si] = { kg: '', reps: '' };
      exMap[n][si][f] = inp.value;
    });

    const notes = {};
    document.querySelectorAll('textarea[data-ex-note]').forEach(t => { notes[t.dataset.exNote] = t.value; });

    const entry = {
      session, date, menstruasjon: mens,
      exercises: exercises.map(ex => ({ name: ex.name, sets: exMap[ex.name] || [], notes: notes[ex.name] || '' }))
    };

    DB.saveEntry(entry);

    // Check PRs
    const newPRs = [];
    entry.exercises.forEach(ex => {
      const valid = (ex.sets || []).filter(s => s && parseFloat(s.kg) > 0 && parseInt(s.reps) > 0);
      if (!valid.length) return;
      const maxKg = Math.max(...valid.map(s => parseFloat(s.kg)));
      if (DB.updatePR(ex.name, maxKg, date)) newPRs.push({ name: ex.name, kg: maxKg });
    });

    const status = document.getElementById('log-status');
    if (newPRs.length) {
      status.textContent = `Lagret! 🏆 NY PR: ${newPRs.map(p => `${p.name} ${p.kg}kg`).join(', ')}`;
      newPRs.forEach(p => Coach.celebratePR(p.name, p.kg).then(msg => {
        if (status) status.textContent += ' 🎉';
      }));
    } else {
      status.textContent = 'Lagret! ✅';
    }
    setTimeout(() => { if (status) status.textContent = ''; }, 3000);
  },

  // ---- PROGRESJON ----
  renderProgresjon() {
    const plan = DB.getPlan();
    const sessions = Object.keys(plan);
    const sess = this.currentSession || sessions[0];

    document.getElementById('main').innerHTML = `
      <div class="page-header"><div class="page-title">Progresjon</div></div>
      <div class="graph-controls">
        <select id="g-sess" onchange="App.onGraphSessionChange()">
          ${sessions.map(s => `<option value="${s}"${s === sess ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
        <select id="g-ex" onchange="App.renderCharts()">
          ${plan[sess].map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
        </select>
        <div class="metric-tabs">
          <button class="mtab${this.currentMetric === 'vol' ? ' active' : ''}" onclick="App.setMetric('vol')">Volum</button>
          <button class="mtab${this.currentMetric === 'kg' ? ' active' : ''}" onclick="App.setMetric('kg')">Toppvekt</button>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title" id="chart-title">Progresjon</div>
        <div style="position:relative;height:220px">
          <canvas id="progChart"></canvas>
          <div class="no-data" id="no-prog">Logg minst 2 økter for å se graf.</div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Total øktvolum</div>
        <div style="position:relative;height:180px">
          <canvas id="volChart"></canvas>
          <div class="no-data" id="no-vol">Logg minst 2 økter.</div>
        </div>
      </div>
      <div style="text-align:center;margin-top:1rem">
        <button class="btn-ghost" onclick="App.askMonthlySummary()">Be om månedlig rapport 📊</button>
      </div>
    `;
    this.renderCharts();
  },

  onGraphSessionChange() {
    const sess = document.getElementById('g-sess').value;
    const plan = DB.getPlan();
    const exSel = document.getElementById('g-ex');
    exSel.innerHTML = plan[sess].map(e => `<option value="${e.name}">${e.name}</option>`).join('');
    this.renderCharts();
  },

  setMetric(m) {
    this.currentMetric = m;
    document.querySelectorAll('.mtab').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(m === 'vol' ? 'volum' : 'topp')));
    this.renderCharts();
  },

  renderCharts() {
    const sess = document.getElementById('g-sess')?.value || this.currentSession;
    const exName = document.getElementById('g-ex')?.value;
    if (!sess || !exName) return;
    const title = document.getElementById('chart-title');
    if (title) title.textContent = `${exName} – ${this.currentMetric === 'vol' ? 'Volum' : 'Toppvekt'}`;
    Charts.renderProgression('progChart', sess, exName, this.currentMetric);
    Charts.renderVolume('volChart', sess);
  },

  async askMonthlySummary() {
    this.showView('coach');
    setTimeout(async () => {
      const msg = await Coach.getWeeklySummary();
      this.addCoachMessage(msg);
    }, 300);
  },

  // ---- PR ----
  renderPR() {
    const pr = DB.getPR();
    const plan = DB.getPlan();
    document.getElementById('main').innerHTML = `
      <div class="page-header"><div class="page-title">Personlige rekorder 🏆</div></div>
      ${Object.keys(plan).map(sess => {
        const exes = plan[sess].filter(ex => pr[ex.name]);
        if (!exes.length) return `<div class="pr-section-title">${sess}</div><div class="empty-state">Ingen PR-er ennå</div>`;
        return `
          <div class="pr-section-title">${sess}</div>
          ${exes.map(ex => {
            const p = pr[ex.name];
            return `<div class="pr-card">
              <div><div class="pr-name">${ex.name}</div><div class="pr-date">${p.date}</div></div>
              <div class="pr-kg">${p.kg} kg</div>
            </div>`;
          }).join('')}
        `;
      }).join('')}
    `;
  },

  // ---- COACH ----
  renderCoach() {
    document.getElementById('main').innerHTML = `
      <div class="page-header"><div class="page-title">Coach 💬</div></div>
      <div id="chat-messages" class="chat-messages"></div>
      <div class="chat-input-row">
        <input type="text" id="chat-input" placeholder="Spør coachen..." onkeydown="if(event.key==='Enter')App.sendChat()">
        <button class="btn-send" onclick="App.sendChat()">Send</button>
      </div>
      <div class="quick-questions">
        <button class="quick-q" onclick="App.quickAsk('Gi meg ukentlig oppsummering')">Ukeoppsummering</button>
        <button class="quick-q" onclick="App.quickAsk('Hva bør jeg fokusere på fremover?')">Tips fremover</button>
        <button class="quick-q" onclick="App.quickAsk('Gi meg råd om restitusjon og søvn')">Restitusjon</button>
      </div>
    `;
    this.renderChatHistory();
  },

  renderChatHistory() {
    const hist = DB.getChatHistory();
    const container = document.getElementById('chat-messages');
    if (!container) return;
    if (!hist.length) {
      container.innerHTML = `<div class="chat-welcome">Hei! Jeg er coachen din 💪 Spør meg om trening, progresjon eller kosthold!</div>`;
      return;
    }
    container.innerHTML = hist.map(m => `
      <div class="chat-msg ${m.role}">
        ${m.role === 'assistant' ? '<span class="chat-avatar">💬</span>' : ''}
        <div class="chat-bubble">${m.content}</div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  },

  addCoachMessage(msg) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'chat-msg assistant';
    div.innerHTML = `<span class="chat-avatar">💬</span><div class="chat-bubble">${msg}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  async sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input?.value.trim();
    if (!msg) return;
    input.value = '';

    const container = document.getElementById('chat-messages');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerHTML = `<div class="chat-bubble">${msg}</div>`;
    container.appendChild(userDiv);

    const loadDiv = document.createElement('div');
    loadDiv.className = 'chat-msg assistant';
    loadDiv.innerHTML = `<span class="chat-avatar">💬</span><div class="chat-bubble typing">...</div>`;
    container.appendChild(loadDiv);
    container.scrollTop = container.scrollHeight;

    const reply = await Coach.ask(msg);
    loadDiv.querySelector('.chat-bubble').textContent = reply;
    container.scrollTop = container.scrollHeight;
  },

  async quickAsk(msg) {
    const input = document.getElementById('chat-input');
    if (input) input.value = msg;
    await this.sendChat();
  },

  // ---- PLAN ----
  renderPlan(activeForm, activeSession, activeExIdx) {
    const plan = DB.getPlan();
    const sessions = Object.keys(plan);
    activeExIdx = activeExIdx !== undefined ? activeExIdx : -1;

    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div class="page-title">Treningsplan</div>
      </div>
      <div id="plan-content">
        ${sessions.map(sess => `
          <div class="plan-session-card">
            <div class="plan-sess-header">
              <span class="plan-sess-name">${sess}</span>
              <div class="plan-sess-actions">
                <button class="btn-icon" onclick="App.renderPlan('editSession','${sess}')">✏️</button>
                <button class="btn-icon danger" onclick="App.deleteSession('${sess}')">🗑️</button>
              </div>
            </div>
            ${activeForm === 'editSession' && activeSession === sess ? `
            <div class="inline-form">
              <input type="text" id="edit-sess-name" value="${sess}" placeholder="Navn på økt">
              <div class="inline-form-btns">
                <button class="btn-primary" onclick="App.saveEditSession('${sess}')">Lagre</button>
                <button class="btn-ghost" onclick="App.renderPlan()">Avbryt</button>
              </div>
            </div>` : ''}
            ${plan[sess].map((ex, i) => `
              <div class="plan-ex-row">
                <div class="plan-ex-info">
                  <span class="plan-ex-name">${ex.name}</span>
                  <span class="plan-ex-meta">${ex.repRange}</span>
                </div>
                <div class="plan-ex-actions">
                  <button class="btn-icon" onclick="App.renderPlan('editEx','${sess}',${i})">✏️</button>
                  <button class="btn-icon danger" onclick="App.deleteExercise('${sess}',${i})">✕</button>
                </div>
              </div>
              ${activeForm === 'editEx' && activeSession === sess && activeExIdx === i ? `
              <div class="inline-form">
                <input type="text" id="edit-ex-name" value="${ex.name}" placeholder="Øvelsesnavn">
                <div class="inline-form-row">
                  <div class="inline-form-field"><label>Sett</label><input type="number" id="edit-ex-sets" value="${ex.sets}" min="1" max="10"></div>
                  <div class="inline-form-field"><label>Min reps</label><input type="number" id="edit-ex-minr" value="${ex.minReps}" min="1"></div>
                  <div class="inline-form-field"><label>Max reps</label><input type="number" id="edit-ex-maxr" value="${ex.maxReps}" min="1"></div>
                </div>
                <div class="inline-form-btns">
                  <button class="btn-primary" onclick="App.saveEditExercise('${sess}',${i})">Lagre</button>
                  <button class="btn-ghost" onclick="App.renderPlan()">Avbryt</button>
                </div>
              </div>` : ''}
            `).join('')}
            ${activeForm === 'addEx' && activeSession === sess ? `
            <div class="inline-form">
              <input type="text" id="new-ex-name" placeholder="Øvelsesnavn">
              <div class="inline-form-row">
                <div class="inline-form-field"><label>Sett</label><input type="number" id="new-ex-sets" value="3" min="1" max="10"></div>
                <div class="inline-form-field"><label>Min reps</label><input type="number" id="new-ex-minr" value="8" min="1"></div>
                <div class="inline-form-field"><label>Max reps</label><input type="number" id="new-ex-maxr" value="12" min="1"></div>
              </div>
              <div class="inline-form-btns">
                <button class="btn-primary" onclick="App.saveAddExercise('${sess}')">Legg til</button>
                <button class="btn-ghost" onclick="App.renderPlan()">Avbryt</button>
              </div>
            </div>` : `
            <button class="btn-ghost small" onclick="App.renderPlan('addEx','${sess}')">+ Legg til øvelse</button>`}
          </div>
        `).join('')}
      </div>
      ${activeForm === 'addSession' ? `
      <div class="inline-form" style="margin-top:1rem">
        <input type="text" id="new-sess-name" placeholder="Navn på økt (f.eks. Full Body)">
        <div class="inline-form-btns">
          <button class="btn-primary" onclick="App.saveAddSession()">Opprett økt</button>
          <button class="btn-ghost" onclick="App.renderPlan()">Avbryt</button>
        </div>
      </div>` : `
      <button class="btn-ghost" style="margin-top:1rem;width:100%" onclick="App.renderPlan('addSession')">+ Ny økt</button>`}
      <div style="margin-top:1rem">
        <button class="btn-ghost" onclick="App.showView('goals')">Se treningsmål 🎯</button>
      </div>
    `;
  },

  saveEditSession(oldName) {
    const newName = document.getElementById('edit-sess-name').value.trim();
    if (!newName) return;
    const plan = DB.getPlan();
    const entries = Object.entries(plan);
    const newPlan = {};
    entries.forEach(([k,v]) => { newPlan[k === oldName ? newName : k] = v; });
    DB.savePlan(newPlan);
    this.renderPlan();
  },

  saveAddSession() {
    const name = document.getElementById('new-sess-name').value.trim();
    if (!name) return;
    const plan = DB.getPlan();
    plan[name] = [];
    DB.savePlan(plan);
    this.renderPlan();
  },

  saveAddExercise(session) {
    const name = document.getElementById('new-ex-name').value.trim();
    if (!name) return;
    const sets = parseInt(document.getElementById('new-ex-sets').value) || 3;
    const minR = parseInt(document.getElementById('new-ex-minr').value) || 8;
    const maxR = parseInt(document.getElementById('new-ex-maxr').value) || 12;
    const plan = DB.getPlan();
    plan[session].push({ name, sets, minReps: minR, maxReps: maxR, repRange: sets+'x'+minR+'-'+maxR });
    DB.savePlan(plan);
    this.renderPlan();
  },

  saveEditExercise(session, idx) {
    const name = document.getElementById('edit-ex-name').value.trim();
    if (!name) return;
    const sets = parseInt(document.getElementById('edit-ex-sets').value) || 3;
    const minR = parseInt(document.getElementById('edit-ex-minr').value) || 8;
    const maxR = parseInt(document.getElementById('edit-ex-maxr').value) || 12;
    const plan = DB.getPlan();
    plan[session][idx] = { name, sets, minReps: minR, maxReps: maxR, repRange: sets+'x'+minR+'-'+maxR };
    DB.savePlan(plan);
    this.renderPlan();
  },

  deleteExercise(session, idx) {
    const plan = DB.getPlan();
    plan[session].splice(idx, 1);
    DB.savePlan(plan);
    this.renderPlan();
  },

  deleteSession(session) {
    const plan = DB.getPlan();
    delete plan[session];
    DB.savePlan(plan);
    this.renderPlan();
  },

  // ---- GOALS ----
  renderGoals() {
    const goals = DB.getGoals();
    document.getElementById('main').innerHTML = `
      <div class="page-header">
        <div class="page-title">Treningsmål 🎯</div>
        <button class="btn-ghost small" onclick="App.showView('plan')">← Tilbake</button>
      </div>
      <div id="goals-list">
        ${goals.length ? goals.map((g, i) => `
          <div class="goal-card ${g.done ? 'done' : ''}">
            <div class="goal-check" onclick="App.toggleGoal(${i})">${g.done ? '✅' : '⬜'}</div>
            <div class="goal-content">
              <div class="goal-text">${g.text}</div>
              ${g.deadline ? `<div class="goal-deadline">Frist: ${g.deadline}</div>` : ''}
            </div>
            <button class="btn-icon danger" onclick="App.deleteGoal(${i})">✕</button>
          </div>
        `).join('') : '<div class="empty-state">Ingen mål ennå – legg til ditt første!</div>'}
      </div>
      <div class="add-goal-form">
        <input type="text" id="goal-input" placeholder="Nytt mål (f.eks. 10 pull ups innen juni)">
        <input type="date" id="goal-deadline" placeholder="Frist (valgfritt)">
        <button class="btn-primary" onclick="App.addGoal()">Legg til mål</button>
      </div>
    `;
  },

  addGoal() {
    const text = document.getElementById('goal-input')?.value.trim();
    if (!text) return;
    const deadline = document.getElementById('goal-deadline')?.value || '';
    const goals = DB.getGoals();
    goals.push({ text, deadline, done: false });
    DB.saveGoals(goals);
    this.renderGoals();
  },

  toggleGoal(idx) {
    const goals = DB.getGoals();
    goals[idx].done = !goals[idx].done;
    DB.saveGoals(goals);
    this.renderGoals();
  },

  deleteGoal(idx) {
    const goals = DB.getGoals();
    goals.splice(idx, 1);
    DB.saveGoals(goals);
    this.renderGoals();
  },

  toggleMuscleView(exName) {
    const id = 'muscle-view-' + exName.replace(/\s/g, '_');
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  renderBibliotek() {
    const plan = DB.getPlan();
    const allExercises = {};
    Object.entries(plan).forEach(([sess, exes]) => {
      exes.forEach(ex => {
        if (!allExercises[ex.name]) allExercises[ex.name] = { sessions: [], ex };
        allExercises[ex.name].sessions.push(sess);
      });
    });
    Object.keys(Muscles.exercises).forEach(name => {
      if (!allExercises[name]) allExercises[name] = { sessions: [], ex: { name } };
    });
    const groups = {};
    Object.entries(allExercises).forEach(([name, data]) => {
      const m = Muscles.getMuscles(name);
      const primaryGroup = m.primary[0] || 'other';
      const groupLabel = Muscles.groups[primaryGroup] ? Muscles.groups[primaryGroup].label : 'Annet';
      if (!groups[groupLabel]) groups[groupLabel] = [];
      groups[groupLabel].push({ name, sessions: data.sessions });
    });
    const sorted = Object.entries(groups).sort((a,b) => a[0].localeCompare(b[0]));
    let html = '<div class="page-header"><div class="page-title">Øvelsesbibliotek 📚</div></div>';
    html += '<input type="text" id="bib-search" class="bib-search-input" placeholder="Søk etter øvelse..." oninput="App.filterBibliotek()">';
    html += '<div id="bib-list">';
    sorted.forEach(([group, exes]) => {
      html += '<div class="bib-group-title">' + group + '</div>';
      exes.forEach(function(item) {
        const sessText = item.sessions.length ? item.sessions.join(', ') : 'Ikke i din plan';
        html += '<div class="bib-card" onclick="App.openExercise(&quot;' + item.name + '&quot;)"><div class="bib-card-left">';
        html += '<div class="bib-card-left">';
        html += '<div class="bib-ex-name">' + item.name + '</div>';
        html += '<div class="bib-ex-sess">' + sessText + '</div>';
        html += Muscles.renderMuscleChips(item.name);
        html += '</div><div class="bib-arrow">→</div></div>';
      });
    });
    html += '</div>';
    document.getElementById('main').innerHTML = html;
  },

  filterBibliotek() {
    const q = (document.getElementById('bib-search') ? document.getElementById('bib-search').value : '').toLowerCase();
    document.querySelectorAll('.bib-card').forEach(function(card) {
      const name = card.querySelector('.bib-ex-name') ? card.querySelector('.bib-ex-name').textContent.toLowerCase() : '';
      card.style.display = name.includes(q) ? 'flex' : 'none';
    });
    document.querySelectorAll('.bib-group-title').forEach(function(title) {
      let el = title.nextElementSibling;
      let hasVisible = false;
      while (el && !el.classList.contains('bib-group-title')) {
        if (el.style.display !== 'none') hasVisible = true;
        el = el.nextElementSibling;
      }
      title.style.display = hasVisible ? 'block' : 'none';
    });
  },

  openExercise(name) {
    const labels = Muscles.getMuscleLabels(name);
    const primary = labels.primary;
    const secondary = labels.secondary;
    let html = '<div class="page-header">';
    html += '<button class="btn-ghost small" onclick="App.showView(\'bibliotek\')">← Tilbake</button>';
    html += '<div class="page-title" style="font-size:18px">' + name + '</div></div>';
    html += '<div style="display:flex;justify-content:center;margin:16px 0">' + Muscles.renderSVG(name, 140) + '</div>';
    html += '<div class="card"><div class="card-title">Primære muskler</div><div class="muscle-chips">';
    if (primary.length) {
      primary.forEach(function(l) { html += '<span class="chip chip-primary">' + l + '</span>'; });
    } else {
      html += '<span style="color:var(--text3);font-size:13px">Ingen data</span>';
    }
    html += '</div></div>';
    if (secondary.length) {
      html += '<div class="card"><div class="card-title">Sekundære muskler</div><div class="muscle-chips">';
      secondary.forEach(function(l) { html += '<span class="chip chip-secondary">' + l + '</span>'; });
      html += '</div></div>';
    }
    html += '<div class="card"><div class="card-title">Fargekode</div>';
    html += '<div style="display:flex;gap:12px;font-size:12px;color:var(--text2)">';
    html += '<span><span style="color:#4ade80">●</span> Primær muskel</span>';
    html += '<span><span style="color:#60a5fa">●</span> Sekundær muskel</span>';
    html += '</div></div>';
    document.getElementById('main').innerHTML = html;
  },

    async checkDailyCoach() {
    const today = new Date().toISOString().split('T')[0];
    const last = DB.getLastSeen();
    if (last === today) return;
    DB.setLastSeen(today);
    const hist = DB.getHistory();
    if (!hist.length) return;
    const daysSince = Math.floor((new Date() - new Date(hist[hist.length - 1].date)) / 86400000);
    if (daysSince >= 5) {
      const msg = await Coach.ask(`Brukeren har ikke logget på ${daysSince} dager. Send en kort, motiverende melding for å få dem tilbake på trening!`);
      this.showNotification(msg);
    }
  },

  showNotification(msg) {
    const el = document.createElement('div');
    el.className = 'notification';
    el.innerHTML = `<span>💬</span> ${msg} <button onclick="this.parentElement.remove()">✕</button>`;
    document.body.prepend(el);
    setTimeout(() => el.remove(), 8000);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
