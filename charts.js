// Charts module
const Charts = {
  progChart: null,
  volChart: null,

  colors: {
    green: '#4ade80',
    greenFill: 'rgba(74,222,128,0.12)',
    pink: '#f472b6',
    purple: '#a78bfa',
    purpleFill: 'rgba(167,139,250,0.2)',
    grid: 'rgba(255,255,255,0.06)',
    text: 'rgba(255,255,255,0.4)',
  },

  baseOptions(yLabel) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleColor: 'rgba(255,255,255,0.6)',
          bodyColor: '#fff',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
        }
      },
      scales: {
        x: {
          grid: { color: this.colors.grid },
          ticks: { color: this.colors.text, font: { size: 11 }, maxRotation: 45 }
        },
        y: {
          grid: { color: this.colors.grid },
          ticks: { color: this.colors.text, font: { size: 11 }, callback: v => Math.round(v) + ' kg' },
          beginAtZero: false
        }
      }
    };
  },

  renderProgression(canvasId, session, exName, metric = 'vol') {
    const hist = DB.getHistory().filter(e => e.session === session);
    const mens = DB.getMens();
    const points = [];

    hist.forEach(entry => {
      const ex = (entry.exercises || []).find(e => e.name === exName);
      if (!ex) return;
      const valid = (ex.sets || []).filter(s => s && parseFloat(s.kg) > 0 && parseInt(s.reps) > 0);
      if (!valid.length) return;
      const vol = valid.reduce((a, s) => a + parseFloat(s.kg) * parseInt(s.reps), 0);
      const maxKg = Math.max(...valid.map(s => parseFloat(s.kg)));
      points.push({ date: entry.date, vol: Math.round(vol), maxKg, mens: entry.menstruasjon || mens[entry.date] });
    });

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.progChart) { this.progChart.destroy(); this.progChart = null; }

    if (points.length < 2) {
      canvas.parentElement.querySelector('.no-data')?.style && (canvas.parentElement.querySelector('.no-data').style.display = 'block');
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = 'block';
    const noData = canvas.parentElement.querySelector('.no-data');
    if (noData) noData.style.display = 'none';

    const values = points.map(p => metric === 'vol' ? p.vol : p.maxKg);
    const pointColors = points.map(p => p.mens ? this.colors.pink : this.colors.green);

    const opts = this.baseOptions(metric === 'vol' ? 'Volum (kg)' : 'Toppvekt (kg)');
    opts.plugins.tooltip.callbacks = {
      label: ctx2 => {
        const p = points[ctx2.dataIndex];
        return `${Math.round(ctx2.parsed.y)} kg${p.mens ? ' 🌸' : ''}`;
      }
    };

    this.progChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: points.map(p => p.date),
        datasets: [{
          data: values,
          borderColor: this.colors.green,
          backgroundColor: this.colors.greenFill,
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointHoverRadius: 7
        }]
      },
      options: opts
    });
  },

  renderVolume(canvasId, session) {
    const hist = DB.getHistory().filter(e => e.session === session);
    const mens = DB.getMens();

    const points = hist.map(entry => {
      const vol = (entry.exercises || []).reduce((a, ex) => {
        return a + (ex.sets || []).filter(s => s && s.kg && s.reps).reduce((b, s) => b + parseFloat(s.kg) * parseInt(s.reps), 0);
      }, 0);
      return { date: entry.date, vol: Math.round(vol), mens: entry.menstruasjon || mens[entry.date] };
    }).filter(p => p.vol > 0);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.volChart) { this.volChart.destroy(); this.volChart = null; }

    if (points.length < 2) {
      const noData = canvas.parentElement.querySelector('.no-data');
      if (noData) noData.style.display = 'block';
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = 'block';
    const noData = canvas.parentElement.querySelector('.no-data');
    if (noData) noData.style.display = 'none';

    const opts = this.baseOptions('Volum (kg)');
    opts.scales.y.beginAtZero = true;
    opts.plugins.tooltip.callbacks = {
      label: ctx2 => {
        const p = points[ctx2.dataIndex];
        return `${Math.round(ctx2.parsed.y).toLocaleString('no')} kg${p.mens ? ' 🌸' : ''}`;
      }
    };

    this.volChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: points.map(p => p.date),
        datasets: [{
          data: points.map(p => p.vol),
          backgroundColor: points.map(p => p.mens ? 'rgba(244,114,182,0.4)' : 'rgba(167,139,250,0.4)'),
          borderColor: points.map(p => p.mens ? this.colors.pink : this.colors.purple),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: opts
    });
  }
};
