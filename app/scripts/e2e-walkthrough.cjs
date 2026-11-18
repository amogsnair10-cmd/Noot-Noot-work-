// Drives the app like a learner: onboarding → placement → lessons. Screenshots key screens.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const MODE = process.argv[3] || 'strong'; // 'strong' answers right, 'weak' answers wrong in tests
const errors = [];

async function stepOnce(page, shots) {
  const st = await page.evaluate(() => window.__step && { ...window.__step });
  if (!st) return false;
  // feedback bar?
  const fb = page.locator('.feedback .btn');
  if (await fb.count()) {
    await fb.click();
    return true;
  }
  const k = st.kind;
  if (shots && !shots.has(k)) {
    shots.add(k);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/step-${k}.png` });
  }
  if (k.startsWith('teach') || k === 'readAlong') {
    const b = page.locator('.btn.block').last();
    await b.waitFor({ timeout: 15000 });
    await b.click();
  } else if (k === 'choice') {
    let idx = st.answer;
    if (MODE === 'weak') {
      const n = st.options.length;
      const cands = [];
      for (let i = 0; i < n; i++) if (i !== st.answer && (await page.locator('.opt').nth(i).isEnabled())) cands.push(i);
      if (cands.length && Math.random() < 0.6) idx = cands[0];
    }
    await page.locator('.opt').nth(idx).click();
    if (MODE === 'weak') await page.waitForTimeout(400);
  } else if (k === 'build') {
    const used = new Set();
    for (const ch of st.word) {
      const tiles = page.locator('.tiles .tile');
      const n = await tiles.count();
      for (let i = 0; i < n; i++) {
        if (used.has(i)) continue;
        if ((await tiles.nth(i).innerText()).trim() === ch) {
          used.add(i);
          await tiles.nth(i).click();
          break;
        }
      }
    }
  } else if (k === 'order') {
    const target = st.sentence.replace(/[.?!,]/g, '').split(/\s+/);
    const used = new Set();
    for (const w of target) {
      const tiles = page.locator('.tiles .tile');
      const n = await tiles.count();
      for (let i = 0; i < n; i++) {
        if (used.has(i)) continue;
        if ((await tiles.nth(i).innerText()).trim() === w) {
          used.add(i);
          await tiles.nth(i).click();
          break;
        }
      }
    }
    await page.waitForTimeout(500);
  } else if (k === 'trace') {
    for (let t = 0; t < 6; t++) {
      if ((await page.evaluate(() => window.__step && window.__step.kind)) !== 'trace' || (await page.locator('.feedback').count())) break;
      const box = await page.locator('.trace-wrap canvas').last().boundingBox();
      await page.mouse.move(box.x + 140, box.y + 120);
      await page.mouse.down();
      await page.mouse.move(box.x + 160, box.y + 200, { steps: 8 });
      await page.mouse.up();
      const done = page.locator('.btn.cyan.block');
      if (await done.isEnabled()) await done.click();
      await page.waitForTimeout(900);
    }
  } else if (k === 'say') {
    const said = page.getByText(/I said it/);
    if (await said.count()) await said.first().click();
    else {
      const skip0 = page.getByText(/Skip for now/);
      if (await skip0.count()) { await skip0.click(); await page.waitForTimeout(250); return true; }
      const mic = page.locator('.mic:not([disabled])');
      if (await mic.count()) await mic.click();
      await page.waitForTimeout(8000);
      const skip = page.getByText(/Skip for now/);
      if (await skip.count()) await skip.click();
      else {
        const s2 = page.getByText(/I said it/);
        if (await s2.count()) await s2.first().click();
      }
    }
  } else if (k === 'write') {
    await page.locator('textarea').fill('I have a big family.');
    await page.locator('.btn.good', { hasText: /Save/ }).click();
  }
  await page.waitForTimeout(250);
  return true;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'], deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()));
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/01a-welcome-early.png` });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/01-welcome.png` });
  await page.locator('.cta-wrap .btn').click();
  await page.locator('.avatar').first().click();
  await page.getByText('Adult').click();
  await page.locator('#learner-name').fill(MODE === 'weak' ? 'Ramesh' : 'Asha');
  await page.screenshot({ path: `${OUT}/02-profile.png` });
  await page.locator('.btn.block', { hasText: 'Next' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/03-test-intro.png` });
  await page.locator('.btn.gold', { hasText: 'Start' }).click();

  const shots = new Set();
  // placement
  for (let i = 0; i < 80; i++) {
    if (await page.locator('.btn.gold', { hasText: /Start learning/ }).count()) break;
    const nxt = page.locator('.screen.center .btn.block', { hasText: /^\s*Next/ });
    if (await nxt.count()) {
      await nxt.first().click();
      continue;
    }
    await stepOnce(page, shots);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/04-placement-result.png`, fullPage: true });
  await page.locator('.btn.gold', { hasText: /Start learning/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/05-home.png` });
  await page.screenshot({ path: `${OUT}/05-home-full.png`, fullPage: true });

  // do lessons
  const LESSONS = +(process.argv[4] || 3);
  for (let L = 0; L < LESSONS; L++) {
    const start = page.locator('.hero-card .btn').first();
    if (!(await start.count())) break;
    await start.click();
    for (let i = 0; i < 150; i++) {
      if (await page.locator('.screen.center .btn.block', { hasText: /Next lesson|Try again/ }).count()) break;
      await stepOnce(page, shots);
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/06-done-${L}.png` });
    await page.locator('.btn.ghost.block', { hasText: /Home/ }).click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${OUT}/07-home-after.png` });
  await page.locator('.nav button').nth(2).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/08-progress.png`, fullPage: true });
  await page.locator('.nav button').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/09-practice.png` });
  await page.locator('.nav button').nth(3).click();
  await page.locator('.btn', { hasText: 'Teacher area' }).click();
  await page.locator('input[type=password]').fill('1234');
  await page.locator('.btn', { hasText: 'Open' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/10-teacher.png`, fullPage: true });
  const state = await page.evaluate(() => localStorage.getItem('akshar-english-v1'));
  const s = JSON.parse(state);
  const p = s.profiles[0];
  console.log(JSON.stringify({ level: p.level, placement: p.placement, lessons: p.lessons, items: Object.keys(p.items).length, skills: Object.fromEntries(Object.entries(p.skills).map(([k, v]) => [k, v.length])) }, null, 1));
  console.log('ERRORS', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => {
  console.error('FAILED', e);
  console.log('ERRORS', errors.join('\n'));
  process.exit(1);
});
