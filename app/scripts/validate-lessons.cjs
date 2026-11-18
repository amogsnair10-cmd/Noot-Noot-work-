const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage();
  await page.goto('http://localhost:5173/');
  const out = await page.evaluate(async () => {
    const E = await import('/src/lib/engine.ts');
    const C = await import('/src/content/curriculum.ts');
    const S = await import('/src/lib/store.ts');
    const P = await import('/src/lib/placement.ts');
    const p = S.newProfile('x', '🦁', 'child');
    p.level = 4;
    const problems = [];
    const summary = [];
    for (let rep = 0; rep < 20; rep++)
      for (const l of C.ALL_LESSONS) {
        let steps;
        try { steps = E.generateLesson(p, l); } catch (e) { problems.push(l.id + ' THROW ' + e.message); continue; }
        if (rep === 0) summary.push(`${l.id}:${steps.length}`);
        if (steps.length < 6) problems.push(l.id + ' too few steps ' + steps.length);
        if (!steps.some((s) => s.phase === 'check')) problems.push(l.id + ' no check');
        for (const s of steps) {
          if (s.kind === 'choice') {
            if (s.answer < 0 || s.answer >= s.options.length) problems.push(l.id + ' bad answer idx');
            const keys = s.options.map((o) => (o.label ?? '') + '|' + (o.emoji ?? ''));
            if (new Set(keys).size !== keys.length) problems.push(`${l.id} dup options ${s.ins.key} ${keys.join(',')}`);
          }
          if (s.kind === 'build' && !s.word.split('').every((c) => s.tiles.includes(c))) problems.push(l.id + ' build missing letter');
          if (s.kind === 'order' && s.tiles.length < 2) problems.push(l.id + ' order short');
        }
      }
    for (const f of ['A', 'B']) for (let st = 0; st < 4; st++) { const x = P.stageSteps(f, st); if (!x.length) problems.push('placement empty ' + f + st); }
    return { n: C.ALL_LESSONS.length, summary: summary.join(' '), problems: [...new Set(problems)].slice(0, 30) };
  });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
