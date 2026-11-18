const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['Pixel 5'], deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    const id = 'x1';
    const sk = { listening: [], speaking: [], reading: [], writing: [], vocabulary: [], comprehension: [] };
    const sc = Object.fromEntries(Object.keys(sk).map((k) => [k, { right: 0, total: 1 }]));
    localStorage.setItem('akshar-english-v1', JSON.stringify({ v: 1, activeId: id, settings: { dailyLimitMin: 60, goalMin: 25, slowSpeech: false, sound: true, teacherPin: '1234' },
      profiles: [{ id, name: 'T', avatar: '🦁', age: 'adult', createdAt: '2026-11-18', level: 1, startLevel: 1, placement: { date: '2026-11-18', form: 'A', level: 1, scores: sc }, lessons: {}, items: {}, skills: sk, daily: {}, writings: [] }] }));
  });
  await page.reload();
  await page.locator('.hero-card .btn').first().click();
  for (let i = 0; i < 8; i++) {
    const fb = page.locator('.feedback .btn');
    if (await fb.count()) { await fb.click(); await page.waitForTimeout(150); continue; }
    const st = await page.evaluate(() => window.__step);
    if (st.kind.startsWith('teach')) await page.locator('.btn.block').last().click();
    else if (st.kind === 'choice') await page.locator('.opt').nth(st.answer).click();
    await page.waitForTimeout(200);
  }
  const before = await page.locator('.chip').first().innerText();
  await page.locator('.icon-btn').first().click();
  await page.locator('.sheet .btn.ghost').click();
  await page.waitForTimeout(400);
  const cont = await page.locator('.hero-card .btn', { hasText: 'Continue' }).count();
  await page.locator('.hero-card .btn', { hasText: 'Continue' }).click();
  await page.waitForTimeout(400);
  const after = await page.locator('.chip').first().innerText();
  console.log({ before, cont, after, errs });
  // daily limit: set used time to 61 min and try to start
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('akshar-english-v1')); const d = new Date(); const k = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); s.profiles[0].daily[k] = { sec: 3700, lessons: 1 }; localStorage.setItem('akshar-english-v1', JSON.stringify(s)); localStorage.removeItem('akshar-resume-x1'); });
  await page.reload();
  await page.locator('.hero-card .btn').first().click();
  await page.waitForTimeout(400);
  console.log('rest screen shown:', await page.getByText('Time to rest!').count());
  await b.close();
})();
