// Database layer - localStorage wrapper
const DB = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
  },

  // History
  getHistory() { return this.get('tl_history', []); },
  saveEntry(entry) {
    const h = this.getHistory();
    h.push(entry);
    this.set('tl_history', h);
  },

  // PR
  getPR() { return this.get('tl_pr', {}); },
  updatePR(exName, kg, date) {
    const pr = this.getPR();
    if (!pr[exName] || kg > pr[exName].kg) {
      pr[exName] = { kg, date };
      this.set('tl_pr', pr);
      return true;
    }
    return false;
  },

  // Plan
  getPlan() {
    return this.get('tl_plan', {
      "Lower A": [
        { name: "Hip thrust", sets: 4, minReps: 6, maxReps: 12, repRange: "3×6-8, 1×8-12" },
        { name: "RDL", sets: 4, minReps: 8, maxReps: 12, repRange: "4×8-12" },
        { name: "Step ups", sets: 3, minReps: 8, maxReps: 10, repRange: "3×8-10" },
        { name: "Leg extensions", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" },
        { name: "Leg curl", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" },
        { name: "Hyperextensions", sets: 3, minReps: 15, maxReps: 20, repRange: "3×15-20" }
      ],
      "Lower B": [
        { name: "Squats", sets: 3, minReps: 8, maxReps: 12, repRange: "3×8-12" },
        { name: "Machine hip thrust", sets: 3, minReps: 10, maxReps: 12, repRange: "3×10-12" },
        { name: "SL RDL", sets: 3, minReps: 10, maxReps: 12, repRange: "3×10-12" },
        { name: "Leg extensions", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" },
        { name: "Leg curl", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" }
      ],
      "Upper A": [
        { name: "Assisted pullups", sets: 3, minReps: 6, maxReps: 8, repRange: "3×6-8" },
        { name: "SA dumbbell row", sets: 3, minReps: 6, maxReps: 12, repRange: "3×6-12" },
        { name: "Smith machine press", sets: 3, minReps: 8, maxReps: 12, repRange: "3×8-12" },
        { name: "Cable row", sets: 3, minReps: 8, maxReps: 12, repRange: "3×8-12" },
        { name: "Facepulls", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" },
        { name: "Lateral raises", sets: 4, minReps: 12, maxReps: 15, repRange: "4×12-15" },
        { name: "Rear delt flies", sets: 4, minReps: 12, maxReps: 15, repRange: "4×12-15" }
      ],
      "Upper B": [
        { name: "Pull ups", sets: 3, minReps: 6, maxReps: 8, repRange: "3×6-8" },
        { name: "Lat pulldown", sets: 3, minReps: 8, maxReps: 12, repRange: "3×8-12" },
        { name: "Militærpress", sets: 3, minReps: 8, maxReps: 12, repRange: "3×8-12" },
        { name: "SA row machine", sets: 3, minReps: 10, maxReps: 12, repRange: "3×10-12" },
        { name: "Chest flies", sets: 3, minReps: 10, maxReps: 12, repRange: "3×10-12" },
        { name: "Lateral raises", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" },
        { name: "Rear delt fly", sets: 3, minReps: 12, maxReps: 15, repRange: "3×12-15" }
      ]
    });
  },
  savePlan(plan) { this.set('tl_plan', plan); },

  // Goals
  getGoals() { return this.get('tl_goals', []); },
  saveGoals(goals) { this.set('tl_goals', goals); },

  // Mens
  getMens() { return this.get('tl_mens', {}); },
  toggleMens(date) {
    const m = this.getMens();
    if (m[date]) { delete m[date]; } else { m[date] = true; }
    this.set('tl_mens', m);
    return !!m[date];
  },
  isMens(date) { return this.getMens()[date] === true; },

  // Dagsform
  getDagsform() { return this.get('tl_dagsform', {}); },
  saveDagsform(date, data) {
    const d = this.getDagsform();
    d[date] = data;
    this.set('tl_dagsform', d);
  },
  getDagsformForDate(date) { return this.getDagsform()[date] || null; },

  // Chat history
  getChatHistory() { return this.get('tl_chat', []); },
  saveChatHistory(msgs) { this.set('tl_chat', msgs.slice(-50)); },

  // Last session
  getLastSeen() { return this.get('tl_last_seen', null); },
  setLastSeen(date) { this.set('tl_last_seen', date); }
};
