const { chromium } = require('playwright');

async function getHeadlines_ABC() {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://abcnews.go.com/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.PFoxV')).map(ele => {
          const parentLink = ele.closest('a');
          return {
            text: ele.innerText.trim(),
            href: parentLink ? parentLink.getAttribute('href') : null
          };
        }).filter(item => item.text !== '' && item.href !== null);
    });

    headlines.splice(20);

    await context.close();
    await browser.close();
    return headlines;
}

getHeadlines_ABC();
module.exports = getHeadlines_ABC;