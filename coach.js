// Coach - AI integration via Anthropic API
const Coach = {
  SYSTEM_PROMPT: `Du er en motiverende og energisk personlig treningscoach innebygd i en treningsapp. Du heter Coach og snakker norsk.

Din personlighet:
- Motiverende, energisk og entusiastisk
- Konkret og handlingsorientert – gi alltid spesifikke råd
- Feirende når brukeren gjør fremgang
- Støttende men ærlig – ikke gi tomme smiger
- Kort og punchete – mobilapp, ikke roman

Du har tilgang til brukerens treningsdata og gir råd basert på:
- Dagens dagsform (søvn, restitusjon, energi)
- Forrige økt og progresjon
- Menstruasjonssyklus (vær ekstra støttende i menstruasjonsuken)
- PR-er og treningsmål
- Generelle treningsprinsipper (progressiv overbelastning, restitusjon, ernæring)

Hold svar under 150 ord med mindre brukeren ber om mer. Bruk gjerne emojis sparsomt for energi.`,

  async ask(userMessage, context = {}) {
    const contextStr = this.buildContext(context);
    const messages = [
      ...DB.getChatHistory(),
      { role: 'user', content: contextStr ? `[Kontekst: ${contextStr}]\n\n${userMessage}` : userMessage }
    ];

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: this.SYSTEM_PROMPT,
          messages
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || '').join('') || 'Noe gikk galt – prøv igjen!';

      // Save chat history
      const hist = DB.getChatHistory();
      hist.push({ role: 'user', content: userMessage });
      hist.push({ role: 'assistant', content: reply });
      DB.saveChatHistory(hist);

      return reply;
    } catch (e) {
      return 'Kunne ikke koble til coach akkurat nå. Sjekk internett og prøv igjen! 💪';
    }
  },

  buildContext(ctx) {
    const parts = [];
    const today = new Date().toISOString().split('T')[0];

    const dagsform = DB.getDagsformForDate(today);
    if (dagsform) {
      parts.push(`Dagsform i dag: søvn ${dagsform.sovn || '?'} timer, kvalitet ${dagsform.sovnKvalitet || '?'}/10, restitusjon ${dagsform.restitusjon || '?'}/10, energi ${dagsform.energi || '?'}/10, protein ${dagsform.protein || '?'}g`);
    }

    if (DB.isMens(today)) parts.push('Bruker er i menstruasjonsuken i dag');

    const pr = DB.getPR();
    if (Object.keys(pr).length) {
      parts.push('PR-er: ' + Object.entries(pr).map(([n, v]) => `${n} ${v.kg}kg`).join(', '));
    }

    const goals = DB.getGoals();
    if (goals.length) parts.push('Mål: ' + goals.map(g => g.text).join(', '));

    const hist = DB.getHistory().slice(-4);
    if (hist.length) {
      const lastSess = hist[hist.length - 1];
      parts.push(`Siste økt: ${lastSess.session} (${lastSess.date})`);
    }

    if (ctx.session) parts.push(`Skal trene: ${ctx.session}`);
    if (ctx.lastEntry) parts.push(`Forrige ${ctx.session}: ${ctx.lastEntry}`);

    return parts.join('. ');
  },

  async getPreWorkoutMessage(session) {
    const today = new Date().toISOString().split('T')[0];
    const dagsform = DB.getDagsformForDate(today);
    const mens = DB.isMens(today);

    let prompt = `Jeg skal trene ${session} nå.`;
    if (dagsform) {
      prompt += ` Dagsform: søvn ${dagsform.sovn}t (kvalitet ${dagsform.sovnKvalitet}/10), restitusjon ${dagsform.restitusjon}/10, energi ${dagsform.energi}/10.`;
    }
    if (mens) prompt += ' Jeg er i menstruasjonsuken.';
    prompt += ' Gi meg en kort motiverende pre-økt melding og 1-2 konkrete tips for dagens økt.';

    return await this.ask(prompt, { session });
  },

  async celebratePR(exName, kg) {
    return await this.ask(`Jeg satte akkurat ny PR på ${exName}: ${kg} kg! 🎉`);
  },

  async getWeeklySummary() {
    const hist = DB.getHistory();
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekHist = hist.filter(e => new Date(e.date) >= weekAgo);
    if (!weekHist.length) return 'Ingen økter logget denne uken – la oss endre på det! 💪';

    const sessions = weekHist.map(e => e.session).join(', ');
    const vol = weekHist.reduce((a, entry) => {
      return a + (entry.exercises || []).reduce((b, ex) => {
        return b + (ex.sets || []).filter(s => s && s.kg && s.reps).reduce((c, s) => c + parseFloat(s.kg) * parseInt(s.reps), 0);
      }, 0);
    }, 0);

    return await this.ask(`Gi meg en ukentlig oppsummering. Denne uken: ${weekHist.length} økter (${sessions}), totalt volum ca ${Math.round(vol)} kg. Vær motiverende og fremhev fremgang!`);
  }
};
