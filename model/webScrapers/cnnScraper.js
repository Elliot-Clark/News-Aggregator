const { chromium } = require('playwright');

async function getHeadlines_CNN() {
  const browser = await chromium.launch({
      headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.cnn.com/', { waitUntil: 'domcontentloaded' });
  const headlines = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-editable="headline"]')).map(ele => {
        const parentLink = ele.closest('a');
        let href = parentLink ? "cnn.com" + parentLink.getAttribute('href') : null
        if (href) {
          href = href.replace(/^https:\/\/(www\.)?/, '');
        }

        return {
          text: ele.innerText.trim(),
          href: href
        };
      }).filter(item => item.text !== '' && item.href !== null);
  });

  headlines.splice(20);
  await context.close();
  await browser.close();
  return headlines;
}

module.exports = getHeadlines_CNN;