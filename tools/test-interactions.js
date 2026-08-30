// Smoke test for the page's interactive behaviour.
//   node tools/test-interactions.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const results = [];
  const check = (name, pass, detail) => {
    results.push({ name, pass, detail: detail || '' });
  };

  // ---- desktop ----------------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  await page.goto('http://127.0.0.1:8123/', { waitUntil: 'networkidle' });

  // country tabs: click Singapore
  await page.click('#tab-singapore');
  check('tab click switches panel',
    (await page.getAttribute('#tab-singapore', 'aria-selected')) === 'true'
      && (await page.isVisible('#panel-singapore'))
      && !(await page.isVisible('#panel-india')));

  // keyboard: ArrowDown from Singapore -> Morocco
  await page.focus('#tab-singapore');
  await page.keyboard.press('ArrowDown');
  check('arrow key moves tab',
    (await page.getAttribute('#tab-morocco', 'aria-selected')) === 'true'
      && (await page.isVisible('#panel-morocco')));

  // sticky header gains its scrolled state
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 600, behavior: 'instant' });
  });
  await page.waitForTimeout(250);
  check('header sets is-scrolled',
    await page.evaluate(() => document.getElementById('siteHeader').classList.contains('is-scrolled')));

  // parallax moved the hero image
  check('hero parallax applies transform',
    await page.evaluate(() => {
      const t = getComputedStyle(document.getElementById('heroImg')).transform;
      return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
    }));

  // every reveal fires after a scroll pass
  await page.evaluate(async () => {
    const root = document.documentElement;
    const step = Math.round(innerHeight * 0.6);
    for (let y = 0; y < root.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 110));
    }
  });
  const hidden = await page.evaluate(
    () => document.querySelectorAll('.reveal:not(.is-visible)').length);
  check('all reveals fire', hidden === 0, hidden + ' still hidden');

  // no horizontal overflow
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow @1440', overflow <= 0, 'overflow ' + overflow + 'px');

  await page.close();

  // ---- mobile -----------------------------------------------------------
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  m.on('pageerror', (e) => consoleErrors.push(e.message));
  await m.goto('http://127.0.0.1:8123/', { waitUntil: 'networkidle' });

  check('closed drawer is not focusable', !(await m.isVisible('#primaryNav a')));
  await m.click('#navToggle');
  await m.waitForTimeout(420);
  check('burger opens nav',
    (await m.getAttribute('#navToggle', 'aria-expanded')) === 'true'
      && (await m.isVisible('#primaryNav a')));

  await m.click('#primaryNav a >> nth=0');
  await m.waitForTimeout(420);
  check('nav closes on link tap',
    (await m.getAttribute('#navToggle', 'aria-expanded')) === 'false');

  const mOverflow = await m.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow @390', mOverflow <= 0, 'overflow ' + mOverflow + 'px');

  await m.close();
  await browser.close();

  check('no uncaught page errors', consoleErrors.length === 0, consoleErrors.join(' | '));

  let failed = 0;
  for (const r of results) {
    if (!r.pass) { failed++; }
    console.log((r.pass ? 'PASS  ' : 'FAIL  ') + r.name + (r.detail ? '  — ' + r.detail : ''));
  }
  console.log('\n' + (results.length - failed) + '/' + results.length + ' passed');
  process.exit(failed ? 1 : 0);
})();
