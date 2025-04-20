const { chromium } = require('playwright');

async function getHeadlines_Fox() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.foxnews.com/', { waitUntil: 'domcontentloaded' });
    let headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h3.title > a')).map(ele => {
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
    
    headlines.splice(20);

    //---------------------
    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_Fox;