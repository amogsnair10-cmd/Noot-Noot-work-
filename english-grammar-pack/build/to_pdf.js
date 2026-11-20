const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, input, output, shotsDir] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(input));
  await p.evaluateHandle('document.fonts.ready');
  await p.waitForTimeout(500);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((el, i) => {
    // content bottom vs available area (selfcheck/footer reserved)
    let max = 0;
    el.querySelectorAll(':scope > *:not(footer):not(.selfcheck)').forEach(c => { max = Math.max(max, c.offsetTop + c.offsetHeight); });
    const sc = el.querySelector('.selfcheck');
    const limit = sc ? sc.offsetTop : el.clientHeight - 40;
    return {i: i+1, content: max, limit, over: max > limit};
  }));
  console.log(JSON.stringify(over.filter(o => o.over)));
  console.log('pages', over.length);
  await p.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
