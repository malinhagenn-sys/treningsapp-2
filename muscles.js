const Muscles = {
  groups: {
    chest:      { label: 'Bryst',         color: '#4ade80' },
    shoulders:  { label: 'Skuldre',       color: '#60a5fa' },
    biceps:     { label: 'Biceps',        color: '#f472b6' },
    triceps:    { label: 'Triceps',       color: '#fb923c' },
    upperBack:  { label: 'Øvre rygg',     color: '#a78bfa' },
    lats:       { label: 'Lats',          color: '#34d399' },
    lowerBack:  { label: 'Korsrygg',      color: '#fbbf24' },
    abs:        { label: 'Mage',          color: '#4ade80' },
    glutes:     { label: 'Rumpe',         color: '#f472b6' },
    hamstrings: { label: 'Hamstrings',    color: '#fb923c' },
    quads:      { label: 'Quadriceps',    color: '#60a5fa' },
    calves:     { label: 'Legger',        color: '#a78bfa' },
    adductors:  { label: 'Indre lår',     color: '#fbbf24' },
    rearDelt:   { label: 'Bakre skulder', color: '#34d399' },
  },

  // Wikimedia anatomical muscle images (front/back)
  images: {
    front: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Anterior_muscles_of_the_body_%281918%29.jpg/250px-Anterior_muscles_of_the_body_%281918%29.jpg',
    back:  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Posterior_muscles_of_the_body_%281918%29.jpg/250px-Posterior_muscles_of_the_body_%281918%29.jpg',
  },

  // SVG overlay coordinates (as % of image) for each muscle on front/back views
  // These are approximate bounding regions over the Wikimedia anatomy image
  overlays: {
    front: {
      chest:      [{x:28,y:22,w:18,h:12,rx:6},{x:54,y:22,w:18,h:12,rx:6}],
      shoulders:  [{x:12,y:18,w:14,h:14,rx:7},{x:74,y:18,w:14,h:14,rx:7}],
      biceps:     [{x:8,y:32,w:10,h:16,rx:5},{x:82,y:32,w:10,h:16,rx:5}],
      abs:        [{x:38,y:34,w:24,h:22,rx:4}],
      quads:      [{x:28,y:58,w:18,h:24,rx:5},{x:54,y:58,w:18,h:24,rx:5}],
      adductors:  [{x:44,y:58,w:12,h:22,rx:4}],
      calves:     [{x:28,y:83,w:16,h:12,rx:4},{x:56,y:83,w:16,h:12,rx:4}],
      lats:       [{x:18,y:30,w:10,h:16,rx:4},{x:72,y:30,w:10,h:16,rx:4}],
      shoulders:  [{x:12,y:18,w:14,h:14,rx:7},{x:74,y:18,w:14,h:14,rx:7}],
    },
    back: {
      upperBack:  [{x:28,y:20,w:44,h:18,rx:5}],
      lats:       [{x:16,y:30,w:16,h:20,rx:5},{x:68,y:30,w:16,h:20,rx:5}],
      lowerBack:  [{x:36,y:46,w:28,h:12,rx:4}],
      glutes:     [{x:26,y:56,w:20,h:14,rx:6},{x:54,y:56,w:20,h:14,rx:6}],
      hamstrings: [{x:26,y:60,w:20,h:22,rx:5},{x:54,y:60,w:20,h:22,rx:5}],
      calves:     [{x:28,y:83,w:16,h:12,rx:4},{x:56,y:83,w:16,h:12,rx:4}],
      triceps:    [{x:8,y:32,w:10,h:16,rx:5},{x:82,y:32,w:10,h:16,rx:5}],
      rearDelt:   [{x:12,y:18,w:14,h:14,rx:7},{x:74,y:18,w:14,h:14,rx:7}],
    }
  },

  exercises: {
    'Hip thrust':           { primary: ['glutes'], secondary: ['hamstrings','lowerBack'] },
    'Machine hip thrust':   { primary: ['glutes'], secondary: ['hamstrings'] },
    'RDL':                  { primary: ['hamstrings','glutes'], secondary: ['lowerBack'] },
    'SL RDL':               { primary: ['hamstrings','glutes'], secondary: ['lowerBack'] },
    'Step ups':             { primary: ['quads','glutes'], secondary: ['hamstrings'] },
    'Squats':               { primary: ['quads','glutes'], secondary: ['hamstrings','lowerBack'] },
    'Leg extensions':       { primary: ['quads'], secondary: [] },
    'Leg curl':             { primary: ['hamstrings'], secondary: [] },
    'Hyperextensions':      { primary: ['lowerBack','glutes'], secondary: ['hamstrings'] },
    'Assisted pullups':     { primary: ['lats','upperBack'], secondary: ['biceps'] },
    'Pull ups':             { primary: ['lats','upperBack'], secondary: ['biceps'] },
    'Lat pulldown':         { primary: ['lats'], secondary: ['biceps','upperBack'] },
    'SA dumbbell row':      { primary: ['lats','upperBack'], secondary: ['biceps'] },
    'SA row machine':       { primary: ['lats','upperBack'], secondary: ['biceps'] },
    'Cable row':            { primary: ['upperBack','lats'], secondary: ['biceps'] },
    'Smith machine press':  { primary: ['chest','shoulders'], secondary: ['triceps'] },
    'Chest flies':          { primary: ['chest'], secondary: ['shoulders'] },
    'Militærpress':         { primary: ['shoulders'], secondary: ['triceps','upperBack'] },
    'Facepulls':            { primary: ['rearDelt','upperBack'], secondary: ['shoulders'] },
    'Lateral raises':       { primary: ['shoulders'], secondary: [] },
    'Rear delt flies':      { primary: ['rearDelt'], secondary: ['upperBack'] },
    'Rear delt fly':        { primary: ['rearDelt'], secondary: ['upperBack'] },

    // Ekstra øvelser
    'Benkpress':            { primary: ['chest','shoulders'], secondary: ['triceps'] },
    'Skråbenkpress':        { primary: ['chest','shoulders'], secondary: ['triceps'] },
    'Dips':                 { primary: ['triceps','chest'], secondary: ['shoulders'] },
    'Push ups':             { primary: ['chest','shoulders'], secondary: ['triceps','abs'] },
    'Cable flies':          { primary: ['chest'], secondary: ['shoulders'] },
    'Pec deck':             { primary: ['chest'], secondary: [] },
    'Skulderpress':         { primary: ['shoulders'], secondary: ['triceps'] },
    'Arnold press':         { primary: ['shoulders'], secondary: ['triceps'] },
    'Frontløft':            { primary: ['shoulders'], secondary: [] },
    'Upright row':          { primary: ['shoulders','upperBack'], secondary: ['biceps'] },
    'Shrugs':               { primary: ['upperBack'], secondary: [] },
    'Triceps pushdown':     { primary: ['triceps'], secondary: [] },
    'Skull crushers':       { primary: ['triceps'], secondary: [] },
    'Overhead triceps':     { primary: ['triceps'], secondary: [] },
    'Hammer curl':          { primary: ['biceps'], secondary: [] },
    'Barbell curl':         { primary: ['biceps'], secondary: [] },
    'Incline curl':         { primary: ['biceps'], secondary: [] },
    'Cable curl':           { primary: ['biceps'], secondary: [] },
    'Chin ups':             { primary: ['lats','biceps'], secondary: ['upperBack'] },
    'T-bar row':            { primary: ['upperBack','lats'], secondary: ['biceps'] },
    'Bent over row':        { primary: ['upperBack','lats'], secondary: ['biceps'] },
    'Seated cable row':     { primary: ['upperBack','lats'], secondary: ['biceps'] },
    'Good mornings':        { primary: ['lowerBack','hamstrings'], secondary: ['glutes'] },
    'Back extension':       { primary: ['lowerBack'], secondary: ['glutes','hamstrings'] },
    'Deadlift':             { primary: ['lowerBack','glutes','hamstrings'], secondary: ['upperBack','quads'] },
    'Sumo deadlift':        { primary: ['glutes','adductors'], secondary: ['hamstrings','lowerBack'] },
    'Romanian deadlift':    { primary: ['hamstrings','glutes'], secondary: ['lowerBack'] },
    'Hip abduction':        { primary: ['glutes'], secondary: [] },
    'Glute kickback':       { primary: ['glutes'], secondary: ['hamstrings'] },
    'Cable pull through':   { primary: ['glutes','hamstrings'], secondary: ['lowerBack'] },
    'Leg press':            { primary: ['quads','glutes'], secondary: ['hamstrings'] },
    'Hack squat':           { primary: ['quads'], secondary: ['glutes'] },
    'Bulgarian split squat':{ primary: ['quads','glutes'], secondary: ['hamstrings'] },
    'Lunges':               { primary: ['quads','glutes'], secondary: ['hamstrings'] },
    'Walking lunges':       { primary: ['quads','glutes'], secondary: ['hamstrings'] },
    'Leg press calf raise': { primary: ['calves'], secondary: [] },
    'Standing calf raise':  { primary: ['calves'], secondary: [] },
    'Seated calf raise':    { primary: ['calves'], secondary: [] },
    'Adductor machine':     { primary: ['adductors'], secondary: [] },
    'Abductor machine':     { primary: ['glutes'], secondary: [] },
    'Plank':                { primary: ['abs'], secondary: ['lowerBack','shoulders'] },
    'Crunches':             { primary: ['abs'], secondary: [] },
    'Leg raises':           { primary: ['abs'], secondary: [] },
    'Cable crunch':         { primary: ['abs'], secondary: [] },
    'Russian twist':        { primary: ['abs'], secondary: [] },
    'Hanging knee raise':   { primary: ['abs'], secondary: [] },
    'Pull over':            { primary: ['lats','chest'], secondary: ['triceps'] },
    'Serratus push':        { primary: ['chest','abs'], secondary: [] },
    'Wrist curl':           { primary: ['biceps'], secondary: [] },
    'Farmer walk':          { primary: ['upperBack','lowerBack'], secondary: ['shoulders','abs'] },
  },

  getMuscles(n) { return this.exercises[n] || { primary:[], secondary:[] }; },

  getMuscleLabels(n) {
    const m = this.getMuscles(n);
    return {
      primary: m.primary.map(k => this.groups[k] && this.groups[k].label).filter(Boolean),
      secondary: m.secondary.map(k => this.groups[k] && this.groups[k].label).filter(Boolean)
    };
  },

  isBackExercise(exName) {
    const m = this.getMuscles(exName);
    const back = new Set(['upperBack','lats','lowerBack','glutes','hamstrings','rearDelt','triceps']);
    const front = new Set(['chest','shoulders','biceps','abs','quads','adductors','calves']);
    let b=0,f=0;
    m.primary.forEach(k => { if(back.has(k)) b++; if(front.has(k)) f++; });
    return b >= f;
  },

  renderAnatomyImage(exName, size) {
    size = size || 200;
    const m = this.getMuscles(exName);
    const primary = new Set(m.primary);
    const secondary = new Set(m.secondary);
    const showBack = this.isBackExercise(exName);
    const view = showBack ? 'back' : 'front';
    const imgSrc = this.images[view];
    const overlays = this.overlays[view];
    const imgW = size;
    const imgH = Math.round(size * 2.1);

    let svgOverlays = '';
    Object.keys(overlays).forEach(muscle => {
      let color = null, opacity = 0;
      if (primary.has(muscle)) { color = '#4ade80'; opacity = 0.55; }
      else if (secondary.has(muscle)) { color = '#60a5fa'; opacity = 0.4; }
      if (!color) return;
      overlays[muscle].forEach(r => {
        const x = (r.x/100)*imgW;
        const y = (r.y/100)*imgH;
        const w = (r.w/100)*imgW;
        const h = (r.h/100)*imgH;
        svgOverlays += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r.rx||4)+'" fill="'+color+'" opacity="'+opacity+'"/>';
        // Pulsing border
        svgOverlays += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r.rx||4)+'" fill="none" stroke="'+color+'" stroke-width="2" opacity="0.8"/>';
      });
    });

    return '<div style="position:relative;display:inline-block;width:'+imgW+'px;height:'+imgH+'px;border-radius:12px;overflow:hidden;background:#111">' +
      '<img src="'+imgSrc+'" style="width:100%;height:100%;object-fit:cover;object-position:top;filter:brightness(0.85) contrast(1.1) grayscale(0.2)" crossorigin="anonymous">' +
      '<svg style="position:absolute;top:0;left:0" width="'+imgW+'" height="'+imgH+'" viewBox="0 0 '+imgW+' '+imgH+'">' +
        svgOverlays +
      '</svg>' +
    '</div>';
  },

  renderMuscleChips(exName) {
    const labels = this.getMuscleLabels(exName);
    if (!labels.primary.length && !labels.secondary.length) return '';
    var html = '<div class="muscle-chips">';
    labels.primary.forEach(function(l) { html += '<span class="chip chip-primary">'+l+'</span>'; });
    labels.secondary.forEach(function(l) { html += '<span class="chip chip-secondary">'+l+'</span>'; });
    html += '</div>';
    return html;
  }
};
