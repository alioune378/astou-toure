// Audit of the live site at its official address. Run by hand after a deploy (workflow "Live site audit").
// Checks HTTPS and the certificate, the www / http / netlify.app redirects, SEO tags, every page on phone and desktop,
// media, and submits ONE marked test appointment request and ONE marked test boutique inquiry (delete them in Netlify).
import tls from 'node:tls';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { chromium, devices } from 'playwright';

const DOMAIN = process.env.DOMAIN || 'astoustyle.com';
const BASE = `https://${DOMAIN}`;
const SUBMIT = process.env.SUBMIT !== 'no';
const OUT = 'ci';
mkdirSync(`${OUT}/shots`, { recursive: true });
const results = [];
const check = (name, ok, evidence = '') => {
  results.push({ name, ok: Boolean(ok), evidence });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${evidence ? `  — ${typeof evidence === 'string' ? evidence : JSON.stringify(evidence)}` : ''}`);
};

// ---------- 1. Certificate
for (const host of [DOMAIN, `www.${DOMAIN}`]) {
  try {
    const r = await new Promise((res, rej) => {
      const s = tls.connect(443, host, { servername: host }, () => {
        const c = s.getPeerCertificate();
        res({ authorized: s.authorized, error: s.authorizationError, issuer: c.issuer?.O, cn: c.subject?.CN, san: c.subjectaltname, validTo: c.valid_to });
        s.end();
      });
      s.on('error', rej);
      s.setTimeout(10000, () => rej(new Error('timeout')));
    });
    check(`HTTPS certificate is valid for ${host}`, r.authorized && (r.san || '').includes(`DNS:${host}`) && new Date(r.validTo) > new Date(Date.now() + 7 * 864e5), r);
  } catch (e) {
    check(`HTTPS certificate is valid for ${host}`, false, String(e));
  }
}

// ---------- 2. Redirects (one hop each, permanent, to the canonical address)
const hop = async (url) => {
  const r = await fetch(url, { redirect: 'manual' });
  return { status: r.status, location: r.headers.get('location') };
};
const follow = async (url) => {
  const r = await fetch(url, { redirect: 'follow' });
  return { status: r.status, url: r.url };
};
for (const from of [`http://${DOMAIN}/`, `https://www.${DOMAIN}/`, `http://www.${DOMAIN}/`, 'https://astou-toure.netlify.app/', `https://www.${DOMAIN}/robots.txt`]) {
  try {
    const h = await hop(from);
    const f = await follow(from);
    const target = from.endsWith('robots.txt') ? `${BASE}/robots.txt` : `${BASE}/`;
    check(`${from} redirects permanently to ${target}`, [301, 308].includes(h.status) && f.status === 200 && f.url === target, { first: h, final: f });
  } catch (e) {
    check(`${from} redirects permanently`, false, String(e));
  }
}
{
  const r = await fetch(`${BASE}/`);
  const html = await r.text();
  check('https://astoustyle.com/ answers 200', r.status === 200, r.status);
  check('Canonical URL is https://astoustyle.com/', html.includes('<link rel="canonical" href="https://astoustyle.com/"'));
  check('Open Graph url and image use https://astoustyle.com', html.includes('og:url" content="https://astoustyle.com/"') && html.includes('og:image" content="https://astoustyle.com/og-image.jpg"'));
  check('Structured data names https://astoustyle.com/', html.includes('"url": "https://astoustyle.com/"'));
  check('No reference to the old netlify.app address in the page', !html.includes('netlify.app'));
  check('Pre-launch noindex still in place until Astou approves (meta + header)', html.includes('name="robots" content="noindex"') && (r.headers.get('x-robots-tag') || '').includes('noindex'), r.headers.get('x-robots-tag'));
  for (const [path, type] of [['/sitemap.xml', 'xml'], ['/robots.txt', 'text/plain'], ['/og-image.jpg', 'image/jpeg']]) {
    const x = await fetch(`${BASE}${path}`);
    const body = path === '/og-image.jpg' ? '' : await x.text();
    check(`${path} is served`, x.status === 200 && (x.headers.get('content-type') || '').includes(type) && (!path.endsWith('.xml') || body.includes('<loc>https://astoustyle.com/</loc>')), `${x.status} ${x.headers.get('content-type')}`);
  }
}

// ---------- 3. Every photo and video file the site lists
{
  const manifest = JSON.parse(readFileSync('src/photo-manifest.json', 'utf8'));
  const content = readFileSync('src/content.ts', 'utf8');
  const used = Object.keys(manifest).filter((f) => content.includes(`'${f}'`));
  const bad = [];
  for (const f of used) {
    for (const u of [`/photos/${f}.jpg`, ...manifest[f].widths.map((w) => `/photos/${f}-${w}.webp`)]) {
      const r = await fetch(`${BASE}${u}`, { method: 'HEAD' });
      if (r.status !== 200) bad.push(`${r.status} ${u}`);
    }
  }
  check(`All ${used.length} published photographs load (JPG and every WebP size)`, bad.length === 0, bad.slice(0, 5).join(' | '));
  const clips = [...content.matchAll(/file: '([a-z0-9-]+)', dur:/g)].map((m) => m[1]);
  const vbad = [];
  for (const c of clips) {
    const r = await fetch(`${BASE}/media/video/${c}.mp4`, { headers: { Range: 'bytes=0-1023' } });
    if (![200, 206].includes(r.status) || !(r.headers.get('content-type') || '').includes('video/mp4')) vbad.push(`${r.status} ${c}`);
    const p = await fetch(`${BASE}/media/video/${c}.webp`, { method: 'HEAD' });
    if (p.status !== 200) vbad.push(`poster ${p.status} ${c}`);
  }
  check(`All ${clips.length} videos and their posters load`, vbad.length === 0, vbad.join(' | '));
}

// ---------- 4. Pages on phone and desktop
const browser = await chromium.launch();
const PAGES = [
  ['home', '/'],
  ['portfolio', '/#/portfolio'],
  ['editorial', '/#/editorial'],
  ['boutique', '/#/boutique'],
];
const VIEWPORTS = [
  ['iphone', { ...devices['iPhone 13'] }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
];
async function loadAll(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 6000); }))));
}
try {
  for (const [vpName, vp] of VIEWPORTS) {
    for (const [name, path] of PAGES) {
      const ctx = await browser.newContext({ ...vp, locale: 'en-US' });
      const page = await ctx.newPage();
      const errors = [];
      const failed = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
      page.on('requestfailed', (r) => failed.push(`failed ${r.url()}`));
      await page.goto(`${BASE}/?lang=en${path.slice(1)}`, { waitUntil: 'networkidle' });
      await loadAll(page);
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        images: document.querySelectorAll('main img').length,
        dupes: (() => {
          const seen = {};
          for (const img of document.querySelectorAll('main img')) {
            const base = (img.currentSrc || img.src).split('/').pop().replace(/-\d+\.webp$|\.(jpg|webp)$/, '');
            seen[base] = (seen[base] || 0) + 1;
          }
          return Object.entries(seen).filter(([, n]) => n > 1).map(([f, n]) => `${f}×${n}`);
        })(),
        held: ['ar_group_portrait', 'bq_07', 'braids-beaded-360', 'lk_updo_front'].filter((f) => document.documentElement.innerHTML.includes(f)),
        offsite: [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href).filter((h) => h.includes('netlify.app')),
      }));
      const tag = `${name} ${vpName}`;
      check(`${tag}: no script errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
      check(`${tag}: no failed requests`, failed.length === 0, failed.slice(0, 5).join(' | '));
      check(`${tag}: no broken images (${info.images} shown)`, info.broken.length === 0, info.broken.slice(0, 3).join(' | '));
      check(`${tag}: no horizontal overflow`, info.overflow <= 1, `${info.overflow}px`);
      check(`${tag}: no photograph repeated on the page`, info.dupes.length === 0, info.dupes.join(', '));
      check(`${tag}: held-back media absent`, info.held.length === 0, info.held.join(', '));
      check(`${tag}: no links to the old netlify.app address`, info.offsite.length === 0, info.offsite.join(', '));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/shots/${vpName}-${name}.png`, fullPage: true });
      await ctx.close();
    }
  }

  // A video plays from the live domain.
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?lang=en#/portfolio`, { waitUntil: 'networkidle' });
    const card = page.locator('.vc').first();
    await card.scrollIntoViewIfNeeded();
    await card.locator('.vc-poster').click();
    await page.waitForTimeout(2500);
    const v = await card.locator('video').evaluate((el) => ({ t: el.currentTime, ready: el.readyState, err: el.error && el.error.code }));
    check('A video plays on the live site (phone)', v.ready >= 2 && !v.err && v.t > 0, v);
    await ctx.close();
  }

  if (SUBMIT) {
    // Appointment request (Netlify form "appointment-request").
    {
      const ctx = await browser.newContext({ ...devices['iPhone 13'] });
      const page = await ctx.newPage();
      let post = null;
      page.on('response', (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/' && (post = r.status()));
      await page.goto(`${BASE}/?lang=en`, { waitUntil: 'networkidle' });
      await page.locator('#request').scrollIntoViewIfNeeded();
      await page.waitForTimeout(3200);
      await page.selectOption('#rq-hairstyle', 'sculptural');
      await page.fill('#rq-preferred-date', new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10));
      await page.selectOption('#rq-preferred-time', 'flexible');
      await page.fill('#rq-full-name', 'TEST — website check (please delete)');
      await page.fill('#rq-phone', '000 000 0000');
      await page.fill('#rq-email', 'test@example.com');
      await page.fill('#rq-details', 'Automated test of the appointment form on astoustyle.com. Not a real request; please delete.');
      await page.locator('#rq-consent').check();
      await page.locator('.rq button[type=submit]').click();
      await page.waitForSelector('.rq-done, .rq-status.is-error', { timeout: 20000 });
      const text = (await page.locator('.rq-done, .rq-status').first().innerText()).replace(/\s+/g, ' ');
      check('Appointment request is accepted by Netlify on astoustyle.com, and only then reported as received', post === 200 && /request received/i.test(text), { post, text: text.slice(0, 120) });
      await page.screenshot({ path: `${OUT}/shots/live-appointment-sent.png` });
      await ctx.close();
    }
    // Boutique inquiry (Netlify form "boutique-inquiry").
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      let post = null;
      page.on('response', (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/' && (post = r.status()));
      await page.goto(`${BASE}/?lang=en#/boutique`, { waitUntil: 'networkidle' });
      await page.locator('#bq-headwear .bqc-ask').first().click();
      await page.waitForTimeout(3500);
      await page.fill('#bi-full-name', 'TEST — website check (please delete)');
      await page.fill('#bi-email', 'test@example.com');
      await page.fill('#bi-message', 'Automated test of the boutique inquiry form on astoustyle.com. Not a real inquiry; please delete.');
      await page.locator('#bi-contact-consent').check();
      await page.locator('.bq-form button[type=submit]').click();
      await page.waitForSelector('#bq-inquiry .rq-done, #bq-inquiry .rq-status.is-error', { timeout: 20000 });
      const text = (await page.locator('#bq-inquiry .rq-done, #bq-inquiry .rq-status').first().innerText()).replace(/\s+/g, ' ');
      check('Boutique inquiry is accepted by Netlify on astoustyle.com, and only then reported as received', post === 200 && /inquiry received/i.test(text), { post, text: text.slice(0, 120) });
      await page.screenshot({ path: `${OUT}/shots/live-boutique-inquiry-sent.png` });
      await ctx.close();
    }
  }
} catch (e) {
  check('Audit completed without crashing', false, String(e?.stack ?? e).slice(0, 500));
}
await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
