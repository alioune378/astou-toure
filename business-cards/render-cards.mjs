// Renders card-master.html to print-ready PDFs and PNG previews.
// Usage: node render-cards.mjs [https://final-website-url]
// Needs Playwright (npm i -D playwright && npx playwright install chromium) and Python 3 for the QR code.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2];
fs.mkdirSync(path.join(dir, 'print'), { recursive: true });
fs.mkdirSync(path.join(dir, 'preview'), { recursive: true });

const qrSvg = url ? execFileSync('python3', [path.join(dir, 'tools/make_qr.py'), url], { cwd: path.join(dir, 'tools') }).toString() : null;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 216 }, deviceScaleFactor: 600 / 96 });
await page.goto('file://' + path.join(dir, 'card-master.html'));
await page.evaluate((svg) => {
  if (!svg) return;
  const q = document.getElementById('qr');
  q.classList.remove('is-placeholder');
  q.innerHTML = svg;
}, qrSvg);
await page.evaluate(() => document.fonts.ready);

// 1) Print PDFs: full bleed, no guides.
await page.evaluate(() => (document.body.className = 'print'));
const pdfOpts = { width: '3.75in', height: '2.25in', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } };
await page.pdf({ ...pdfOpts, path: path.join(dir, 'print/astou-toure-card-front-and-back.pdf') });
for (const side of ['front', 'back']) {
  await page.evaluate((s) => document.querySelectorAll('.card').forEach((c) => (c.style.display = c.id === s ? '' : 'none')), side);
  await page.pdf({ ...pdfOpts, path: path.join(dir, `print/astou-toure-card-${side}.pdf`) });
  // 600 dpi PNG with bleed (for printers that prefer images)
  await page.locator('#' + side).screenshot({ path: path.join(dir, `print/astou-toure-card-${side}-600dpi-with-bleed.png`) });
  // Preview: trimmed to the finished size
  const box = await page.locator('#' + side).boundingBox();
  const bleed = 0.125 * 96;
  await page.screenshot({ path: path.join(dir, `preview/${side}-trimmed.png`), clip: { x: box.x + bleed, y: box.y + bleed, width: box.width - 2 * bleed, height: box.height - 2 * bleed } });
  // Proof with trim (red) and safe-area (blue) guides
  await page.evaluate(() => (document.body.className = 'guides'));
  await page.locator('#' + side).screenshot({ path: path.join(dir, `preview/${side}-proof-guides.png`) });
  await page.evaluate(() => (document.body.className = 'print'));
}
await browser.close();
console.log('Cards rendered', url ? `with QR → ${url}` : 'with QR placeholder');
