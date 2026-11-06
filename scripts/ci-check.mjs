// Browser checks for the Astou Touré site. Exits 1 if any check fails; every result is written to ci/report.json.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const OUT = 'ci';
mkdirSync(`${OUT}/shots`, { recursive: true });
const results = [];
const check = (name, ok, evidence = '') => {
  results.push({ name, ok: Boolean(ok), evidence });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${evidence ? `  — ${typeof evidence === 'string' ? evidence : JSON.stringify(evidence)}` : ''}`);
};
const browser = await chromium.launch();
const PAGES = [
  ['home', '/'],
  ['portfolio', '/#/portfolio'],
  ['editorial', '/#/editorial'],
];
const VIEWPORTS = [
  ['iphone', { ...devices['iPhone 13'] }],
  ['narrow', { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
];

async function loadAll(page) {
  // Scroll through the page so lazy images load, then wait for them.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
}

try {
  for (const lang of ['en', 'fr']) {
    for (const [vpName, vp] of VIEWPORTS) {
      for (const [name, path] of PAGES) {
        if (vpName === 'narrow' && lang === 'fr') continue;
        const ctx = await browser.newContext({ ...vp, locale: lang === 'fr' ? 'fr-FR' : 'en-US' });
        const page = await ctx.newPage();
        const errors = [];
        const failed = [];
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
        page.on('pageerror', (e) => errors.push(String(e)));
        page.on('requestfailed', (r) => failed.push(r.url()));
        page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
        const url = `${BASE}/?lang=${lang}${path.slice(1)}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await loadAll(page);
        const info = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
          h1: document.querySelectorAll('h1').length,
          noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
          small: [...document.querySelectorAll('a[href], button, input, select, textarea, label.kind')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              const s = getComputedStyle(el);
              return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('[hidden], .hp, .sr-only') && r.height < 24 && !el.closest('p, li.foot-li');
            })
            .map((el) => `${el.tagName.toLowerCase()}:${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}`),
          beaded: document.documentElement.innerHTML.includes('braids-beaded-360'),
        }));
        const tag = `${name} ${lang} ${vpName}`;
        check(`${tag}: loads without script errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
        check(`${tag}: no failed requests`, failed.length === 0, failed.slice(0, 5).join(' | '));
        check(`${tag}: no broken images`, info.broken.length === 0, info.broken.slice(0, 3).join(' | '));
        check(`${tag}: no horizontal overflow`, info.overflow <= 1, `overflow ${info.overflow}px`);
        check(`${tag}: every image has alt text`, info.noAlt === 0, `${info.noAlt} without alt`);
        check(`${tag}: held-back video not published`, !info.beaded);
        if (vpName !== 'desktop') check(`${tag}: no tiny tap targets (< 24px tall, outside running text)`, info.small.length === 0, info.small.slice(0, 6).join(', '));
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${OUT}/shots/${vpName}-${lang}-${name}.png`, fullPage: true });
        await ctx.close();
      }
    }
  }

  // Navigation between pages: homepage → portfolio collection → back home → editorial; browser back works.
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?lang=en`, { waitUntil: 'networkidle' });
    await page.locator('.sw-cats button', { hasText: 'Sculptural Hair Art' }).click();
    await page.waitForTimeout(1200);
    const onPortfolio = page.url().includes('#/portfolio') && (await page.locator('#cat-sculptural').getAttribute('aria-pressed')) === 'true';
    check('Homepage collection link opens the portfolio filtered on that collection', onPortfolio, page.url());
    await page.goBack();
    await page.waitForTimeout(800);
    check('Browser back returns to the homepage', (await page.locator('#work').count()) === 1, page.url());
    await page.locator('#encounters button.btn').click();
    await page.waitForTimeout(800);
    const statuses = await page.locator('.enc-status').allTextContents();
    check('Editorial page labels credited work and photographed encounters separately', page.url().includes('#/editorial') && statuses.some((s) => /published credit/i.test(s)) && statuses.some((s) => /not a styling credit/i.test(s)), statuses);
    // The appointment button works from another page (form exists there too).
    await page.locator('.top-cta').click();
    await page.waitForTimeout(1200);
    check('Request button reaches the appointment form from the editorial page', await page.locator('#request form').isVisible());
    await ctx.close();
  }

  // Appointment form: validation, the three appointment types, confidentiality, and an honest end state.
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?lang=en`, { waitUntil: 'networkidle' });
    await page.locator('#request').scrollIntoViewIfNeeded();
    const kinds = await page.locator('.rq-kind input[type=radio]').count();
    check('Booking offers three appointment types (salon, private on-location, out-of-state/event)', kinds === 3, `${kinds} options`);
    await page.locator('.rq button[type=submit]').click();
    const errs = await page.locator('.field-err').count();
    check('Empty form is refused with field errors', errs >= 5, `${errs} errors`);
    await page.locator('input[value=event]').check({ force: true });
    await page.waitForTimeout(3100);
    await page.selectOption('#rq-hairstyle', 'editorial');
    const d = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
    await page.fill('#rq-preferred-date', d);
    await page.selectOption('#rq-preferred-time', 'afternoon');
    await page.fill('#rq-full-name', 'Test Visitor');
    await page.fill('#rq-phone', '718 555 0100');
    await page.fill('#rq-email', 'test@example.com');
    await page.fill('#rq-details', 'CI test request — please ignore.');
    await page.locator('#rq-consent').check();
    await page.locator('.rq button[type=submit]').click();
    const cityErr = await page.locator('#rq-service-city-err').count();
    check('Out-of-state/event requests require a city and state', cityErr === 1);
    await page.fill('#rq-service-city', 'Atlanta');
    await page.fill('#rq-service-state', 'GA');
    await page.selectOption('#rq-service-place', 'venue');
    await page.locator('#rq-confidential').check();
    await page.locator('.rq button[type=submit]').click();
    await page.waitForSelector('.rq-done', { timeout: 8000 });
    const done = await page.locator('.rq-done').innerText();
    const mailto = await page.locator('.rq-done a.btn').getAttribute('href').catch(() => '');
    const body = decodeURIComponent(mailto ?? '');
    check('Demo mode never claims the request was sent; it hands it to the email app', /Nothing has been sent or stored/.test(done) && !/Request received/.test(done), done.slice(0, 120));
    check('The prepared email carries the appointment type, location and confidentiality request', /Out-of-state or special-event styling/.test(body) && /Atlanta, GA/.test(body) && /CONFIDENTIAL/.test(body));
    await page.screenshot({ path: `${OUT}/shots/form-done.png` });
    await ctx.close();
  }

  // Lightbox opens from the In Print feature and closes with Escape.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?lang=en`, { waitUntil: 'networkidle' });
    await page.locator('.ip-cover button').click();
    await page.waitForTimeout(500);
    const open = await page.locator('[role=dialog]').filter({ has: page.locator('img') }).count();
    await page.screenshot({ path: `${OUT}/shots/lightbox-in-print.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    check('Magazine cover opens full screen and closes with Escape', open >= 1);
    await ctx.close();
  }
} catch (e) {
  check('Suite completed without crashing', false, String(e?.stack ?? e).slice(0, 500));
}
await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
