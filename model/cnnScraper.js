const { chromium } = require('playwright');

async function getHeadlines_CNN() {
  const browser = await chromium.launch({
      headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.cnn.com/', { waitUntil: 'domcontentloaded' });
  const headlines = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-editable="headline"]')).map(el => {
        const parentLink = el.closest('a');
        return {
          text: el.innerText.trim(),
          href: parentLink ? "https://www.cnn.com" + parentLink.getAttribute('href') : null
        };
      }).filter(item => item.text !== '' && item.href !== null);
  });

  headlines.splice(20);
  await context.close();
  await browser.close();
  return headlines;
}

module.exports = getHeadlines_CNN;