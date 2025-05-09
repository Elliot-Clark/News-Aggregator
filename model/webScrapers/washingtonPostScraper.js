const { firefox } = require('playwright');

async function getHeadlines_WashingtonPost() {
    const browser = await firefox.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.washingtonpost.com/', { waitUntil: 'domcontentloaded' });
    const headlines = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[data-pb-local-content-field="web_headline"]')).map(ele => {
          let href = ele.getAttribute('href')
          if (href) {
            href = href.replace(/^https:\/\/(www\.)?/, '');
          }
          return {
            text: ele.innerText.trim(),
            href: href
          };
        })
    });

    headlines.splice(20);

    await context.close();
    await browser.close();
    return headlines;
}

module.exports = getHeadlines_WashingtonPost;