const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check']
  });

  async function checkAt(width) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));

    const info = await page.evaluate((w) => {
      const r = (el) => el ? el.getBoundingClientRect() : null;
      const cs = (el, prop) => el ? getComputedStyle(el)[prop] : null;
      const h = document.querySelector('.hero-heading');
      const v = document.querySelector('.hero-visual');
      const b = document.querySelector('.hero-bottom');
      const ag = document.querySelector('.about-grid');
      const at = document.querySelector('.about-text');
      return {
        heading: { left: r(h)?.left, right: r(h)?.right, w: r(h)?.width, h: r(h)?.height, fs: cs(h,'fontSize') },
        visual: { left: r(v)?.left, right: r(v)?.right, w: r(v)?.width },
        bottom: { top: r(b)?.top },
        aboutGrid: { left: r(ag)?.left, right: r(ag)?.right, w: r(ag)?.width },
        aboutText: { left: r(at)?.left, right: r(at)?.right, w: r(at)?.width },
        vpw: w
      };
    }, width);
    await page.close();
    return info;
  }

  const r = {};
  for (const w of [360, 390, 430, 500, 600, 768]) {
    r[`${w}px`] = await checkAt(w);
  }
  console.log(JSON.stringify(r, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
