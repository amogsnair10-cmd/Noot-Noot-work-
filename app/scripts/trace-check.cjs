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
      profiles: [{ id, name: 'T', avatar: '🦁', age: 'child', createdAt: '2026-11-18', level: 1, startLevel: 1, placement: { date: '2026-11-18', form: 'A', level: 1, scores: sc }, lessons: {}, items: {}, skills: sk, daily: {}, writings: [] }] }));
  });
  await page.reload();
  await page.locator('button', { hasText: 'Start · शुरू करो' }).first().click();
  for (let i = 0; i < 60; i++) {
    const k = await page.evaluate(() => window.__step && window.__step.kind);
    if (k === 'trace') break;
    const fb = page.locator('.feedback .btn');
    if (await fb.count()) { await fb.click(); continue; }
    const st = await page.evaluate(() => window.__step);
    if (st.kind.startsWith('teach')) await page.locator('.btn.block').last().click();
    else if (st.kind === 'choice') await page.locator('.opt').nth(st.answer).click();
    await page.waitForTimeout(150);
  }
  // 1) scribble -> should fail
  const cv = page.locator('.trace-wrap canvas').last();
  let box = await cv.boundingBox();
  await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down(); await page.mouse.move(box.x + 60, box.y + 40, { steps: 5 }); await page.mouse.up();
  await page.locator('.btn.teal.block').click();
  await page.waitForTimeout(300);
  console.log('after scribble feedback?', await page.locator('.feedback').count(), 'msg:', await page.locator('.trace-wrap + div').first().innerText().catch(() => ''));
  await page.waitForTimeout(900);
  // 2) "perfect" trace: paint the glyph itself with a 24px stroke onto the ink canvas
  const tracePerfect = async () => {
    await page.evaluate(() => {
      const c = document.querySelectorAll('.trace-wrap canvas')[1];
      const ch = window.__traceCh;
      const x = c.getContext('2d');
      x.setTransform(2, 0, 0, 2, 0, 0);
      x.font = "800 230px 'Baloo 2', sans-serif"; x.textAlign = 'center';
      x.strokeStyle = '#FF7A1A'; x.lineWidth = 10; x.fillStyle = '#FF7A1A';
      x.fillText(ch, 150, 232); x.strokeText(ch, 150, 232);
    });
    // need hasInk=true: make a tiny stroke inside
    box = await cv.boundingBox();
    await page.mouse.move(box.x + 150, box.y + 180); await page.mouse.down(); await page.mouse.move(box.x + 151, box.y + 181); await page.mouse.up();
    await page.locator('.btn.teal.block').click();
    await page.waitForTimeout(500);
  };
  const ch = await page.evaluate(() => window.__step.ch);
  await page.evaluate((c) => (window.__traceCh = c), ch);
  await tracePerfect();
  await page.screenshot({ path: process.argv[2] + '/trace-upper.png' });
  await page.evaluate((c) => (window.__traceCh = c.toUpperCase()), ch);
  await tracePerfect();
  console.log('letter', ch, 'feedback after perfect traces:', await page.locator('.feedback').innerText().catch(() => 'none'));
  console.log('errors', errs);
  await b.close();
})();
