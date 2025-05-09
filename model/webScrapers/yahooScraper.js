const { chromium } = require('playwright');

async function getHeadlines_Yahoo() {
  const browser = await chromium.launch({
      headless: true
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://www.yahoo.com/', { waitUntil: 'domcontentloaded' });
  const headlines = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.stretched-box')).map(ele => {
        const parentLink = ele.closest('a');
        console.log(ele)
        let href = parentLink ? "yahoo.com" + parentLink.getAttribute('href') : null
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
  return  headlines;
}

module.exports = getHeadlines_Yahoo;