const { chromium } = require('playwright');

async function getHeadlines_AP() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://apnews.com/', { waitUntil: 'domcontentloaded' });
    let headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.PagePromoContentIcons-text')).map(ele => {
            const parentLink = ele.closest('a');
            let href = parentLink ? parentLink.getAttribute('href') : null
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

module.exports = getHeadlines_AP;