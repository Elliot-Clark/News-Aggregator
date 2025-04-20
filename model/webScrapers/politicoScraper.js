const { chromium } = require('playwright');

async function getHeadlines_Politico() {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.politico.com/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.headline')).map(ele => {
          const childLink = ele.querySelector('a')
          let href = childLink ? childLink.getAttribute('href') : null;
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

module.exports = getHeadlines_Politico;