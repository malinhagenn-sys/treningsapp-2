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
  },

  getMuscles(n) { return this.exercises[n] || { primary:[], secondary:[] }; },

  getMuscleLabels(n) {
    const m = this.getMuscles(n);
    return {
      primary: m.primary.map(k => this.groups[k] && this.groups[k].label).filter(Boolean),
      secondary: m.secondary.map(k => this.groups[k] && this.groups[k].label).filter(Boolean)
    };
  },

  // Returns color info for a muscle key given active sets
  _col(muscle, primary, secondary) {
    if (primary.has(muscle)) return { fill:'#4ade80', op:0.9 };
    if (secondary.has(muscle)) return { fill:'#60a5fa', op:0.6 };
    return { fill:'#2e2e2e', op:1 };
  },

  renderSVG(exName, size) {
    size = size || 160;
    const m = this.getMuscles(exName);
    const P = new Set(m.primary);
    const S = new Set(m.secondary);
    const c = (key) => this._col(key, P, S);

    // Decide if we show front or back based on primary muscles
    const backMuscles = new Set(['upperBack','lats','lowerBack','glutes','hamstrings','rearDelt','triceps']);
    const frontMuscles = new Set(['chest','shoulders','biceps','abs','quads','adductors','calves']);
    let backScore = 0, frontScore = 0;
    m.primary.forEach(k => { if (backMuscles.has(k)) backScore++; if (frontMuscles.has(k)) frontScore++; });
    const showBack = backScore >= frontScore;

    return showBack ? this._backSVG(c, size) : this._frontSVG(c, size);
  },

  _frontSVG(c, size) {
    const w = size, h = size * 2.2;
    return '<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg" style="width:' + size + 'px;height:' + Math.round(size*2.2) + 'px">' +
    '<defs>' +
      '<radialGradient id="fg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#555"/><stop offset="100%" stop-color="#222"/></radialGradient>' +
      '<radialGradient id="fg2" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="#444"/><stop offset="100%" stop-color="#1a1a1a"/></radialGradient>' +
    '</defs>' +
    // Head
    '<ellipse cx="50" cy="12" rx="9" ry="11" fill="url(#fg1)" stroke="#444" stroke-width="0.5"/>' +
    // Neck
    '<rect x="45" y="22" width="10" height="7" fill="#2a2a2a" rx="2"/>' +
    // --- TRAPS / UPPER BODY OUTLINE ---
    '<path d="M25,30 Q18,35 17,50 L15,90 Q14,95 20,96 L80,96 Q86,95 85,90 L83,50 Q82,35 75,30 Q63,26 50,26 Q37,26 25,30Z" fill="#1e1e1e" stroke="#3a3a3a" stroke-width="0.5"/>' +
    // Shoulders (deltoids)
    '<ellipse cx="20" cy="42" rx="8" ry="11" fill="' + c('shoulders').fill + '" opacity="' + c('shoulders').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<ellipse cx="80" cy="42" rx="8" ry="11" fill="' + c('shoulders').fill + '" opacity="' + c('shoulders').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Chest (pectorals) - two lobes
    '<path d="M30,33 Q50,30 50,33 Q50,30 70,33 Q78,38 76,52 Q68,58 50,56 Q32,58 24,52 Q22,38 30,33Z" fill="' + c('chest').fill + '" opacity="' + c('chest').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Chest division line
    '<line x1="50" y1="33" x2="50" y2="56" stroke="#111" stroke-width="0.6" opacity="0.5"/>' +
    // Abs - 6-pack blocks
    '<rect x="41" y="58" width="8" height="7" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    '<rect x="51" y="58" width="8" height="7" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    '<rect x="41" y="67" width="8" height="7" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    '<rect x="51" y="67" width="8" height="7" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    '<rect x="42" y="76" width="7" height="6" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    '<rect x="51" y="76" width="7" height="6" fill="' + c('abs').fill + '" opacity="' + c('abs').op + '" rx="2" stroke="#111" stroke-width="0.3"/>' +
    // Obliques / Lats side visible
    '<path d="M24,52 Q18,68 20,90 L26,90 Q28,70 30,58Z" fill="' + c('lats').fill + '" opacity="' + c('lats').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M76,52 Q82,68 80,90 L74,90 Q72,70 70,58Z" fill="' + c('lats').fill + '" opacity="' + c('lats').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Arms - biceps
    '<path d="M13,42 Q8,44 7,58 Q8,68 13,70 Q17,68 18,58 Q19,46 17,40Z" fill="' + c('biceps').fill + '" opacity="' + c('biceps').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M87,42 Q92,44 93,58 Q92,68 87,70 Q83,68 82,58 Q81,46 83,40Z" fill="' + c('biceps').fill + '" opacity="' + c('biceps').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Forearms
    '<path d="M7,70 Q5,80 6,90 Q9,93 13,92 Q16,88 15,76 Q13,70 7,70Z" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="0.3"/>' +
    '<path d="M93,70 Q95,80 94,90 Q91,93 87,92 Q84,88 85,76 Q87,70 93,70Z" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="0.3"/>' +
    // Hips
    '<path d="M20,90 Q20,100 22,104 L78,104 Q80,100 80,90Z" fill="#252525" stroke="#3a3a3a" stroke-width="0.4"/>' +
    // Quads - left leg
    '<path d="M22,104 Q16,110 15,130 Q15,148 20,155 L35,155 Q40,148 40,130 Q40,110 36,104Z" fill="' + c('quads').fill + '" opacity="' + c('quads').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Quad detail lines
    '<path d="M27,108 Q24,130 25,150" stroke="#111" stroke-width="0.5" fill="none" opacity="0.4"/>' +
    // Quads - right leg
    '<path d="M78,104 Q84,110 85,130 Q85,148 80,155 L65,155 Q60,148 60,130 Q60,110 64,104Z" fill="' + c('quads').fill + '" opacity="' + c('quads').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M73,108 Q76,130 75,150" stroke="#111" stroke-width="0.5" fill="none" opacity="0.4"/>' +
    // Adductors (inner thigh)
    '<path d="M36,104 Q42,110 44,130 Q44,148 40,155 L35,155 Q40,148 40,130 Q40,110 36,104Z" fill="' + c('adductors').fill + '" opacity="' + c('adductors').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M64,104 Q58,110 56,130 Q56,148 60,155 L65,155 Q60,148 60,130 Q60,110 64,104Z" fill="' + c('adductors').fill + '" opacity="' + c('adductors').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Knees
    '<ellipse cx="27" cy="157" rx="9" ry="5" fill="#252525" stroke="#333" stroke-width="0.4"/>' +
    '<ellipse cx="73" cy="157" rx="9" ry="5" fill="#252525" stroke="#333" stroke-width="0.4"/>' +
    // Calves
    '<path d="M18,162 Q15,175 17,190 Q20,196 27,196 Q34,196 36,190 Q37,175 36,162Z" fill="' + c('calves').fill + '" opacity="' + c('calves').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M82,162 Q85,175 83,190 Q80,196 73,196 Q66,196 64,190 Q63,175 64,162Z" fill="' + c('calves').fill + '" opacity="' + c('calves').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Feet
    '<ellipse cx="27" cy="198" rx="9" ry="4" fill="#222" stroke="#333" stroke-width="0.3"/>' +
    '<ellipse cx="73" cy="198" rx="9" ry="4" fill="#222" stroke="#333" stroke-width="0.3"/>' +
    '</svg>';
  },

  _backSVG(c, size) {
    return '<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg" style="width:' + size + 'px;height:' + Math.round(size*2.2) + 'px">' +
    '<defs>' +
      '<radialGradient id="bg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#555"/><stop offset="100%" stop-color="#222"/></radialGradient>' +
    '</defs>' +
    // Head (back)
    '<ellipse cx="50" cy="12" rx="9" ry="11" fill="url(#bg1)" stroke="#444" stroke-width="0.5"/>' +
    // Neck back
    '<rect x="45" y="22" width="10" height="7" fill="#2a2a2a" rx="2"/>' +
    // Back body outline
    '<path d="M25,30 Q18,35 17,50 L15,90 Q14,95 20,96 L80,96 Q86,95 85,90 L83,50 Q82,35 75,30 Q63,26 50,26 Q37,26 25,30Z" fill="#1e1e1e" stroke="#3a3a3a" stroke-width="0.5"/>' +
    // Rear deltoids
    '<ellipse cx="19" cy="40" rx="8" ry="10" fill="' + c('rearDelt').fill + '" opacity="' + c('rearDelt').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<ellipse cx="81" cy="40" rx="8" ry="10" fill="' + c('rearDelt').fill + '" opacity="' + c('rearDelt').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Traps (upper back center)
    '<path d="M30,30 Q50,27 70,30 Q65,44 50,46 Q35,44 30,30Z" fill="' + c('upperBack').fill + '" opacity="' + c('upperBack').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Rhomboids / mid back
    '<path d="M33,46 Q50,44 67,46 Q66,62 50,64 Q34,62 33,46Z" fill="' + c('upperBack').fill + '" opacity="' + (c('upperBack').op * 0.85) + '" stroke="#111" stroke-width="0.3"/>' +
    // Spine line
    '<line x1="50" y1="28" x2="50" y2="94" stroke="#111" stroke-width="0.8" opacity="0.7"/>' +
    // Lats
    '<path d="M22,44 Q17,58 18,78 Q20,88 28,90 L35,90 Q36,74 34,62 Q32,50 30,44Z" fill="' + c('lats').fill + '" opacity="' + c('lats').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M78,44 Q83,58 82,78 Q80,88 72,90 L65,90 Q64,74 66,62 Q68,50 70,44Z" fill="' + c('lats').fill + '" opacity="' + c('lats').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Lower back / erectors
    '<path d="M37,64 Q44,62 46,90 L40,90Z" fill="' + c('lowerBack').fill + '" opacity="' + c('lowerBack').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M63,64 Q56,62 54,90 L60,90Z" fill="' + c('lowerBack').fill + '" opacity="' + c('lowerBack').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Triceps
    '<path d="M13,40 Q8,42 7,56 Q8,66 13,68 Q17,66 18,56 Q19,44 17,38Z" fill="' + c('triceps').fill + '" opacity="' + c('triceps').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M87,40 Q92,42 93,56 Q92,66 87,68 Q83,66 82,56 Q81,44 83,38Z" fill="' + c('triceps').fill + '" opacity="' + c('triceps').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Forearms back
    '<path d="M7,68 Q5,78 6,90 Q9,93 13,92 Q16,88 15,74 Q13,68 7,68Z" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="0.3"/>' +
    '<path d="M93,68 Q95,78 94,90 Q91,93 87,92 Q84,88 85,74 Q87,68 93,68Z" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="0.3"/>' +
    // Glutes
    '<path d="M20,96 Q20,106 24,114 Q32,122 50,122 Q68,122 76,114 Q80,106 80,96Z" fill="' + c('glutes').fill + '" opacity="' + c('glutes').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<line x1="50" y1="96" x2="50" y2="122" stroke="#111" stroke-width="0.7" opacity="0.5"/>' +
    // Hamstrings left
    '<path d="M20,118 Q14,128 14,148 Q15,158 22,160 L34,160 Q40,155 40,140 Q40,124 36,116Z" fill="' + c('hamstrings').fill + '" opacity="' + c('hamstrings').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M27,120 Q24,140 25,155" stroke="#111" stroke-width="0.5" fill="none" opacity="0.4"/>' +
    // Hamstrings right
    '<path d="M80,118 Q86,128 86,148 Q85,158 78,160 L66,160 Q60,155 60,140 Q60,124 64,116Z" fill="' + c('hamstrings').fill + '" opacity="' + c('hamstrings').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M73,120 Q76,140 75,155" stroke="#111" stroke-width="0.5" fill="none" opacity="0.4"/>' +
    // Knees back
    '<ellipse cx="27" cy="162" rx="9" ry="5" fill="#252525" stroke="#333" stroke-width="0.4"/>' +
    '<ellipse cx="73" cy="162" rx="9" ry="5" fill="#252525" stroke="#333" stroke-width="0.4"/>' +
    // Calves back
    '<path d="M18,167 Q15,178 17,192 Q20,198 27,198 Q34,198 36,192 Q37,178 36,167Z" fill="' + c('calves').fill + '" opacity="' + c('calves').op + '" stroke="#111" stroke-width="0.3"/>' +
    '<path d="M82,167 Q85,178 83,192 Q80,198 73,198 Q66,198 64,192 Q63,178 64,167Z" fill="' + c('calves').fill + '" opacity="' + c('calves').op + '" stroke="#111" stroke-width="0.3"/>' +
    // Feet
    '<ellipse cx="27" cy="200" rx="9" ry="4" fill="#222" stroke="#333" stroke-width="0.3"/>' +
    '<ellipse cx="73" cy="200" rx="9" ry="4" fill="#222" stroke="#333" stroke-width="0.3"/>' +
    '</svg>';
  },

  renderMuscleChips(exName) {
    const labels = this.getMuscleLabels(exName);
    if (!labels.primary.length && !labels.secondary.length) return '';
    var html = '<div class="muscle-chips">';
    labels.primary.forEach(function(l) { html += '<span class="chip chip-primary">' + l + '</span>'; });
    labels.secondary.forEach(function(l) { html += '<span class="chip chip-secondary">' + l + '</span>'; });
    html += '</div>';
    return html;
  }
};
