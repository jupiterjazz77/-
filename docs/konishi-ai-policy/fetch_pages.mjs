import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const urls = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
  headless: true,
  proxy: { server: process.env.HTTPS_PROXY },
});
const ctx = await browser.newContext({ locale: 'ja-JP' });
for (const url of urls) {
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const text = (await page.innerText('body')).replace(/\n{3,}/g, '\n\n');
    console.log(`=== ${url}\nstatus=${resp && resp.status()} title=${await page.title()}\n${text.slice(0, 4000)}\n`);
  } catch (e) {
    console.log(`=== ${url}\nERROR: ${String(e).split('\n')[0]}\n`);
  }
  await page.close();
}
await browser.close();
