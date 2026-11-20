const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
 await p.goto('file://' + path.resolve(process.argv[2])); await p.evaluateHandle('document.fonts.ready'); await p.waitForTimeout(400);
 const r = await p.evaluate(() => [...document.querySelectorAll('.pg')].map((el,i)=>{ const ft=el.querySelector('.ft'); let m=0; el.querySelectorAll(':scope > *:not(.ft)').forEach(c=>{m=Math.max(m,c.offsetTop+c.offsetHeight)}); const lim=el.clientHeight-(ft?22:0); return (i+1)+':'+(lim-m); }));
 console.log(r.join(' ')); await b.close(); })();
