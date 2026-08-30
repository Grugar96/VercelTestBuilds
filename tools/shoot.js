// Visual verification helper. Renders a page (or the image contact sheet)
// to PNG so the layout can be eyeballed.
//   node tools/shoot.js <url-or-path> <out.png> [width] [height] [full]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [target, out, w = '1440', h = '900', full = 'true'] = process.argv.slice(2);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const page = await browser.newPage({
    viewport: { width: +w, height: +h },
    deviceScaleFactor: 1,
  });
  const url = target.startsWith('http') ? target : 'file://' + path.resolve(target);
  await page.goto(url, { waitUntil: 'networkidle' });
  // Walk the page so IntersectionObserver reveals actually fire before capture.
  await page.evaluate(async () => {
    // scroll-behavior:smooth would make scrollTo() lag behind the loop
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < root.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    root.style.scrollBehavior = prev;
    await new Promise((r) => setTimeout(r, 500));
  });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: out, fullPage: full === 'true' });
  await browser.close();
  console.log('shot ->', out);
})();
