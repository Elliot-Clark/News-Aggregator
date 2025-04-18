const { chromium } = require('playwright');

async function getHeadlines_MSNBC() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.msnbc.com/', { waitUntil: 'domcontentloaded' });
    let headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h2.multistoryline__headline > a')).map(ele => {
            return {
                text: ele.innerText.trim(),
                href: ele.getAttribute('href')
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