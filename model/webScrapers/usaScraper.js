const { chromium } = require('playwright');

async function getHeadlines_USA() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.usatoday.com/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-tb-title]')).map(ele => {
          const parentLink = ele.closest('a');
          let href = parentLink ? "usatoday.com" + parentLink.getAttribute('href') : null
          if (href) {
            href = href.replace(/^https:\/\/(www\.)?/, '');
          }

          return {
            text: ele.innerText.trim(),
            href: href
          };
        });
    });

    headlines.splice(15);

    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_USA;