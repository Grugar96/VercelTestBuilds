// Accessibility audit via axe-core.  node tools/test-a11y.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  let total = 0;
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto('http://127.0.0.1:8123/', { waitUntil: 'networkidle' });
    // Reveal everything so animation-hidden nodes are audited too, and kill
    // transitions first — otherwise axe samples mid-fade and reports blended
    // colours that never actually appear on screen.
    await page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important}',
    });
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      document.body.classList.add('is-ready');
    });
    await page.waitForTimeout(300);
    await page.addScriptTag({ path: path.resolve('node_modules/axe-core/axe.min.js') });
    const res = await page.evaluate(async () =>
      await window.axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      }));
    console.log('\n=== ' + vp.width + 'px — ' + res.violations.length + ' violation type(s) ===');
    res.violations.forEach((v) => {
      total += v.nodes.length;
      console.log('[' + v.impact + '] ' + v.id + ' — ' + v.help + ' (' + v.nodes.length + ')');
      v.nodes.slice(0, 3).forEach((n) => console.log('    ' + n.html.slice(0, 110)));
    });
    await page.close();
  }
  await browser.close();
  console.log('\ntotal violating nodes: ' + total);
})();
