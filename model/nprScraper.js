const { chromium } = require('playwright');

async function getHeadlines_NPR() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.npr.org/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.title')).map(ele => {
          const parentLink = ele.closest('a');
          return {
            text: ele.innerText.trim(),
            href: parentLink ? parentLink.getAttribute('href') : null
          };
        });
    });

    headlines.splice(20);

    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_NPR;