const { chromium } = require('playwright');

async function getHeadlines_WashingtonPost() {
    const browser = await chromium.launch({
        headless: false,
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.washingtonpost.com/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[data-pb-local-content-field="web_headline"]')).map(ele => {
          return {
            text: ele.innerText.trim(),
            href: ele.getAttribute('href')
          };
        })
    });

    headlines.splice(20);

    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_WashingtonPost;