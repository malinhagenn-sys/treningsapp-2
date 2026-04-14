// Muscle groups data and SVG rendering
const Muscles = {

  // Muscle group definitions with SVG paths for front/back body silhouette
  groups: {
    chest:      { label: 'Bryst',          color: '#4ade80', front: true },
    shoulders:  { label: 'Skuldre',        color: '#60a5fa', front: true },
    biceps:     { label: 'Biceps',         color: '#f472b6', front: true },
    triceps:    { label: 'Triceps',        color: '#fb923c', front: false },
    upperBack:  { label: 'Øvre rygg',      color: '#a78bfa', front: false },
    lats:       { label: 'Lats',           color: '#34d399', front: false },
    lowerBack:  { label: 'Korsrygg',       color: '#fbbf24', front: false },
    abs:        { label: 'Mage',           color: '#4ade80', front: true },
    glutes:     { label: 'Rumpe',          color: '#f472b6', front: false },
    hamstrings: { label: 'Hamstrings',     color: '#fb923c', front: false },
    quads:      { label: 'Quadriceps',     color: '#60a5fa', front: true },
    calves:     { label: 'Legger',         color: '#a78bfa', front: false },
    adductors:  { label: 'Indre lår',      color: '#fbbf24', front: true },
    rearDelt:   { label: 'Bakre skulder',  color: '#34d399', front: false },
  },

  // Exercise to muscle mapping: [primary muscles], [secondary muscles]
  exercises: {
    'Hip thrust':           { primary: ['glutes'], secondary: ['hamstrings', 'lowerBack'] },
    'Machine hip thrust':   { primary: ['glutes'], secondary: ['hamstrings'] },
    'RDL':                  { primary: ['hamstrings', 'glutes'], secondary: ['lowerBack'] },
    'SL RDL':               { primary: ['hamstrings', 'glutes'], secondary: ['lowerBack'] },
    'Step ups':             { primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
    'Squats':               { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'lowerBack'] },
    'Leg extensions':       { primary: ['quads'], secondary: [] },
    'Leg curl':             { primary: ['hamstrings'], secondary: [] },
    'Hyperextensions':      { primary: ['lowerBack', 'glutes'], secondary: ['hamstrings'] },
    'Assisted pullups':     { primary: ['lats', 'upperBack'], secondary: ['biceps'] },
    'Pull ups':             { primary: ['lats', 'upperBack'], secondary: ['biceps'] },
    'Lat pulldown':         { primary: ['lats'], secondary: ['biceps', 'upperBack'] },
    'SA dumbbell row':      { primary: ['lats', 'upperBack'], secondary: ['biceps'] },
    'SA row machine':       { primary: ['lats', 'upperBack'], secondary: ['biceps'] },
    'Cable row':            { primary: ['upperBack', 'lats'], secondary: ['biceps'] },
    'Smith machine press':  { primary: ['chest', 'shoulders'], secondary: ['triceps'] },
    'Chest flies':          { primary: ['chest'], secondary: ['shoulders'] },
    'Militærpress':         { primary: ['shoulders'], secondary: ['triceps', 'upperBack'] },
    'Facepulls':            { primary: ['rearDelt', 'upperBack'], secondary: ['shoulders'] },
    'Lateral raises':       { primary: ['shoulders'], secondary: [] },
    'Rear delt flies':      { primary: ['rearDelt'], secondary: ['upperBack'] },
    'Rear delt fly':        { primary: ['rearDelt'], secondary: ['upperBack'] },
  },

  getMuscles(exName) {
    return this.exercises[exName] || { primary: [], secondary: [] };
  },

  getMuscleLabels(exName) {
    const m = this.getMuscles(exName);
    const primary = m.primary.map(k => this.groups[k]?.label).filter(Boolean);
    const secondary = m.secondary.map(k => this.groups[k]?.label).filter(Boolean);
    return { primary, secondary };
  },

  // SVG body map - simplified zones as ellipses/paths on a body silhouette
  renderSVG(exName, size = 180) {
    const m = this.getMuscles(exName);
    const primary = new Set(m.primary);
    const secondary = new Set(m.secondary);

    const getColor = (muscle) => {
      if (primary.has(muscle)) return { fill: '#4ade80', opacity: '0.85' };
      if (secondary.has(muscle)) return { fill: '#60a5fa', opacity: '0.55' };
      return { fill: '#2a2a2a', opacity: '1' };
    };

    const w = size, h = size * 2.1;
    const cx = w / 2;

    // Body proportions
    const head = { cy: h*0.06, r: w*0.11 };
    const neck = { y: h*0.11, h: h*0.03 };
    const shoulder = { y: h*0.145, w: w*0.78, h: h*0.06 };
    const chest = { y: h*0.19, w: w*0.52, h: h*0.09 };
    const abs = { y: h*0.275, w: w*0.42, h: h*0.1 };
    const hip = { y: h*0.37, w: w*0.54, h: h*0.07 };
    const thighL = { x: cx-w*0.23, y: h*0.44, w: w*0.2, h: h*0.2 };
    const thighR = { x: cx+w*0.03, y: h*0.44, w: w*0.2, h: h*0.2 };
    const kneeL = { x: cx-w*0.21, y: h*0.635, w: w*0.17, h: h*0.04 };
    const kneeR = { x: cx+w*0.04, y: h*0.635, w: w*0.17, h: h*0.04 };
    const calfL = { x: cx-w*0.2, y: h*0.672, w: w*0.16, h: h*0.16 };
    const calfR = { x: cx+w*0.04, y: h*0.672, w: w*0.16, h: h*0.16 };
    const armL = { x: cx-w*0.43, y: h*0.19, w: w*0.12, h: h*0.18 };
    const armR = { x: cx+w*0.31, y: h*0.19, w: w*0.12, h: h*0.18 };
    const foreL = { x: cx-w*0.42, y: h*0.365, w: w*0.11, h: h*0.14 };
    const foreR = { x: cx+w*0.31, y: h*0.365, w: w*0.11, h: h*0.14 };

    const c = {
      shoulders: getColor('shoulders'),
      chest: getColor('chest'),
      abs: getColor('abs'),
      quads: getColor('quads'),
      adductors: getColor('adductors'),
      calves: getColor('calves'),
      biceps: getColor('biceps'),
      glutes: getColor('glutes'),
      hamstrings: getColor('hamstrings'),
      lats: getColor('lats'),
      upperBack: getColor('upperBack'),
      lowerBack: getColor('lowerBack'),
      rearDelt: getColor('rearDelt'),
      triceps: getColor('triceps'),
    };

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:${size}px;height:${size*2.1}px">
      <defs>
        <radialGradient id="bg"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient>
      </defs>

      <!-- FRONT VIEW -->
      <!-- Head -->
      <ellipse cx="${cx}" cy="${head.cy*h}" rx="${head.r}" ry="${head.r*1.15}" fill="#222"/>
      <!-- Neck -->
      <rect x="${cx-w*0.055}" y="${neck.y*h}" width="${w*0.11}" height="${neck.h*h}" fill="#222" rx="3"/>

      <!-- Shoulders -->
      <ellipse cx="${cx-w*0.28}" cy="${shoulder.y*h+shoulder.h*h*0.5}" rx="${w*0.1}" ry="${shoulder.h*h*0.55}" fill="${c.shoulders.fill}" opacity="${c.shoulders.opacity}" rx2="8"/>
      <ellipse cx="${cx+w*0.28}" cy="${shoulder.y*h+shoulder.h*h*0.5}" rx="${w*0.1}" ry="${shoulder.h*h*0.55}" fill="${c.shoulders.fill}" opacity="${c.shoulders.opacity}"/>

      <!-- Chest -->
      <ellipse cx="${cx-w*0.13}" cy="${chest.y*h+chest.h*h*0.45}" rx="${w*0.13}" ry="${chest.h*h*0.5}" fill="${c.chest.fill}" opacity="${c.chest.opacity}"/>
      <ellipse cx="${cx+w*0.13}" cy="${chest.y*h+chest.h*h*0.45}" rx="${w*0.13}" ry="${chest.h*h*0.5}" fill="${c.chest.fill}" opacity="${c.chest.opacity}"/>

      <!-- Lats (front visible) -->
      <ellipse cx="${cx-w*0.26}" cy="${chest.y*h+chest.h*h*0.8}" rx="${w*0.07}" ry="${chest.h*h*0.7}" fill="${c.lats.fill}" opacity="${c.lats.opacity}"/>
      <ellipse cx="${cx+w*0.26}" cy="${chest.y*h+chest.h*h*0.8}" rx="${w*0.07}" ry="${chest.h*h*0.7}" fill="${c.lats.fill}" opacity="${c.lats.opacity}"/>

      <!-- Abs -->
      <rect x="${cx-w*0.11}" y="${abs.y*h}" width="${w*0.22}" height="${abs.h*h}" fill="${c.abs.fill}" opacity="${c.abs.opacity}" rx="6"/>

      <!-- Hip/glutes front -->
      <rect x="${cx-w*0.27}" y="${hip.y*h}" width="${w*0.54}" height="${hip.h*h}" fill="${c.glutes.fill}" opacity="${c.glutes.opacity*0.5}" rx="8"/>

      <!-- Biceps -->
      <rect x="${armL.x}" y="${armL.y}" width="${armL.w}" height="${armL.h}" fill="${c.biceps.fill}" opacity="${c.biceps.opacity}" rx="6"/>
      <rect x="${armR.x}" y="${armR.y}" width="${armR.w}" height="${armR.h}" fill="${c.biceps.fill}" opacity="${c.biceps.opacity}" rx="6"/>

      <!-- Forearms -->
      <rect x="${foreL.x}" y="${foreL.y}" width="${foreL.w}" height="${foreL.h}" fill="#222" opacity="1" rx="5"/>
      <rect x="${foreR.x}" y="${foreR.y}" width="${foreR.w}" height="${foreR.h}" fill="#222" opacity="1" rx="5"/>

      <!-- Quads -->
      <rect x="${thighL.x}" y="${thighL.y}" width="${thighL.w}" height="${thighL.h}" fill="${c.quads.fill}" opacity="${c.quads.opacity}" rx="8"/>
      <rect x="${thighR.x}" y="${thighR.y}" width="${thighR.w}" height="${thighR.h}" fill="${c.quads.fill}" opacity="${c.quads.opacity}" rx="8"/>

      <!-- Adductors (inner thigh) -->
      <ellipse cx="${cx-w*0.04}" cy="${thighL.y+thighL.h*0.5}" rx="${w*0.05}" ry="${thighL.h*0.38}" fill="${c.adductors.fill}" opacity="${c.adductors.opacity}"/>
      <ellipse cx="${cx+w*0.04}" cy="${thighR.y+thighR.h*0.5}" rx="${w*0.05}" ry="${thighR.h*0.38}" fill="${c.adductors.fill}" opacity="${c.adductors.opacity}"/>

      <!-- Knees -->
      <rect x="${kneeL.x}" y="${kneeL.y}" width="${kneeL.w}" height="${kneeL.h}" fill="#1a1a1a" rx="4"/>
      <rect x="${kneeR.x}" y="${kneeR.y}" width="${kneeR.w}" height="${kneeR.h}" fill="#1a1a1a" rx="4"/>

      <!-- Calves -->
      <rect x="${calfL.x}" y="${calfL.y}" width="${calfL.w}" height="${calfL.h}" fill="${c.calves.fill}" opacity="${c.calves.opacity}" rx="7"/>
      <rect x="${calfR.x}" y="${calfR.y}" width="${calfR.w}" height="${calfR.h}" fill="${c.calves.fill}" opacity="${c.calves.opacity}" rx="7"/>

      <!-- Hamstrings overlay on front thighs (faded) -->
      <rect x="${thighL.x+2}" y="${thighL.y+thighL.h*0.55}" width="${thighL.w-4}" height="${thighL.h*0.4}" fill="${c.hamstrings.fill}" opacity="${c.hamstrings.opacity*0.4}" rx="6"/>
      <rect x="${thighR.x+2}" y="${thighR.y+thighR.h*0.55}" width="${thighR.w-4}" height="${thighR.h*0.4}" fill="${c.hamstrings.fill}" opacity="${c.hamstrings.opacity*0.4}" rx="6"/>

      <!-- Body outline -->
      <ellipse cx="${cx}" cy="${head.cy*h}" rx="${head.r}" ry="${head.r*1.15}" fill="none" stroke="#333" stroke-width="0.8"/>
      <rect x="${cx-w*0.055}" y="${neck.y*h}" width="${w*0.11}" height="${neck.h*h}" fill="none" stroke="#333" stroke-width="0.5"/>
    </svg>`;
  },

  renderMuscleChips(exName) {
    const { primary, secondary } = this.getMuscleLabels(exName);
    if (!primary.length && !secondary.length) return '';
    let html = '<div class="muscle-chips">';
    primary.forEach(l => { html += `<span class="chip chip-primary">${l}</span>`; });
    secondary.forEach(l => { html += `<span class="chip chip-secondary">${l}</span>`; });
    html += '</div>';
    return html;
  }
};
