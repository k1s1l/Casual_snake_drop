// Наскрізна перевірка магазину в мобільному вікні. Не залежить від конкретних товарів.
// Запуск: npm run build && PORT=4173 node server.mjs &  node scripts/smoke-test.cjs [теку-для-скріншотів]
const { chromium } = require('playwright');
const fs = require('fs');
const shop = require('../shop.config.json');

const URL = process.env.APP_URL || 'http://localhost:4173/';
const OUT = process.argv[2] || 'smoke-shots';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok });
  console.log(`${ok ? '✔' : '✘'} ${name}${extra ? ' — ' + extra : ''}`);
};
const num = (t) => parseInt(String(t).replace(/\D/g, ''), 10);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  const ignore = /fonts\.(googleapis|gstatic)/;
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !ignore.test(m.text()) && errors.push(m.text()));
  page.on('requestfailed', (r) => !ignore.test(r.url()) && errors.push('requestfailed ' + r.url()));
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });
  const nav = (label) => page.locator('.bottom-nav .bn-item', { hasText: label }).click();
  const settle = () => page.waitForTimeout(450);

  await page.goto(URL);
  await page.waitForSelector('.hero');
  await settle();
  check('Головна з назвою магазину', await page.locator('.logo-mark', { hasText: shop.name }).isVisible());
  await shot('01-home');

  await nav('Каталог');
  await page.waitForSelector('.catalog-cat');
  const cats = await page.locator('.catalog-cat').count();
  check('Є категорії', cats > 0, `${cats}`);
  await page.locator('.catalog-cat-head').first().click();
  await page.waitForSelector('.grid .card');
  check('Є товари', (await page.locator('.grid .card').count()) > 0);
  await settle();
  await shot('02-category');

  // Перший товар у наявності: обрати перший доступний варіант і додати в кошик
  await page.locator('.grid .card:not(.is-oos) .card-media').first().click();
  await page.waitForSelector('.pd-title');
  const price = num(await page.locator('.pd-price-row .price-now').textContent());
  for (const g of await page.locator('.opt-group').all()) {
    const chosen = await g.locator('legend b').count();
    if (!chosen) await g.locator('.opt:not(:disabled)').first().click();
  }
  await settle();
  await shot('03-product');
  await page.locator('.buy-bar .btn-primary').click();
  check('Товар додано в кошик', (await page.locator('.toast').textContent()).includes('Додано'));
  await page.locator('.pd-float .icon-btn').first().click();

  await nav('Кошик');
  await page.waitForSelector('.cart-row');
  check('Сума в кошику', num(await page.locator('.summary-total span').last().textContent()) === price, `${price}`);
  await page.locator('.buy-bar .btn-primary', { hasText: 'Оформити' }).click();
  await page.locator('button[type=submit]').click();
  check('Перевірка полів', (await page.locator('.field-error').count()) === 4);
  await page.fill('#co-fullName', 'Олена Коваль');
  await page.fill('#co-phone', '0671234567');
  await page.fill('#co-city', 'Київ');
  await page.fill('#co-point', 'Відділення №12');
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('.success', { timeout: 5000 });
  check('Оформлення працює', true);
  await page.locator('.success .btn-primary').click();

  check('Немає горизонтальної прокрутки', !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
  check('Немає російських літер', (await page.evaluate(() => (document.body.innerText.match(/[ыэъё]/gi) || []).length)) === 0);
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(150);
  }
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
  check('Усі фото завантажились', broken === 0);
  check('Без помилок у консолі', errors.length === 0, errors.slice(0, 5).join(' | '));

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} перевірок пройдено`);
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
