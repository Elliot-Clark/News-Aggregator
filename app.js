const getHeadlines = require('./model/cnnScraper');

(async () => {
  const headlines = await getHeadlines();
  console.log('CNN Headlines:', headlines);
})();