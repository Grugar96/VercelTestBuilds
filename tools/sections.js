// Captures individual sections at native resolution for design review.
//   node tools/sections.js <outDir> [width] [height]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [outDir, w = '1440', h = '900'] = process.argv.slice(2);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.goto('http://127.0.0.1:8123/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    const step = Math.round(innerHeight * 0.6);
    for (let y = 0; y < root.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 110));
    }
    scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 500));
  });

  const targets = ['.hero', '#about', '#sectors', '#news', '#global', '#investors', '#leadership', '#vision', '.site-footer'];
  for (const sel of targets) {
    const el = await page.$(sel);
    if (!el) { console.log('missing', sel); continue; }
    const name = sel.replace(/[#.]/g, '') + '.png';
    await el.screenshot({ path: path.join(outDir, name) });
    console.log('shot', name);
  }
  await browser.close();
})();
