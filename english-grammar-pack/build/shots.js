const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, input, dir, ...pages] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: {width: 794, height: 1123}, deviceScaleFactor: 1.4 });
  await p.goto('file://' + path.resolve(input));
  await p.evaluateHandle('document.fonts.ready');
  await p.waitForTimeout(400);
  const els = await p.$$('.page');
  for (const n of pages) { await els[+n-1].screenshot({ path: `${dir}/p${n}.png` }); }
  const free = await p.evaluate(() => [...document.querySelectorAll('.page')].map((el,i) => { let m=0; el.querySelectorAll(':scope > *:not(footer):not(.selfcheck)').forEach(c=>{m=Math.max(m,c.offsetTop+c.offsetHeight)}); const sc=el.querySelector('.selfcheck'); return (i+1)+':'+((sc?sc.offsetTop:el.clientHeight-40)-m); }));
  console.log(free.join(' '));
  await b.close();
})();
