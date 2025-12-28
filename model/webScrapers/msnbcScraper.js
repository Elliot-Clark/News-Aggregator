const { chromium } = require('playwright');

async function getHeadlines_MSNBC() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.ms.now/', { waitUntil: 'domcontentloaded' });
    let headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a.rkv-card-headline-link')).map(ele => {
            let href = ele.getAttribute('href')
            if (href) {
              href = href.replace(/^https:\/\/(www\.)?/, '');
            }
            return {
              text: ele.innerText.trim(),
              href: href
            };
        });
    });
    // Only want 20 results. Do not want to keep entries without a title or link.
    headlines = headlines.filter((item, index) => index < 20 && item.text !== '' && item.href !== null);

    //---------------------
    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_MSNBC;