// Aggregator Server
import express from 'express';
import cors from 'cors';
import fetchHeadlines_Date from '../model/mongoDB-fetchDate.mjs';
import fetchHeadlines_Recent from '../model/mongoDB-fetchRecent.mjs';
import scrapeData from '../model/mongoDB-Update.mjs'

const app = express();
const PORT = 5000;
let newsData;

app.use(cors());
app.get('/currentNews', async (req, res) => {
  try {
    console.log("Sending Current News to Frontend", time)
      if ((Date.now() - newsData.time) > 7200000) {
      // If it has been more than two hours since the last news update, fetch the most recent news.
      await fetchCurrentNews();
    }
    res.json(newsData.news);

  } catch (error) {
    console.error('Error calling microservice:', error);
    res.status(500).json({ error: 'Failed to fetch microservice data ' });
  }
});

app.get('/pastNews', (req, res) => {
  const date = req.query.date;
  console.log(`Received GET request for date: ${date}`);
  try {
    fetchHeadlines_Date(date)
    .then(response => {
      if (!response || !response[0] || !response[0].news) {
        res.json([])
      } else {
        res.json(response[0].news)
      }
    })
  } catch (error) {
    console.error('Error calling microservice for pastNews:', error);
    res.status(500).json({ error: 'Failed to fetch microservice data for pastNews' });
  }
});

const fetchCurrentNews = async () => {
  console.log("Running fetchCurrentNews");
  let data = await fetchHeadlines_Recent();
  console.log(data);
   if (!data || !data[0] || !data[0].news) {
    console.log("There was an error fetching current news")
    return
  } else {
    newsData = data[0];
    // if ((Date.now() - data[0].time) > 21600000) {
    //   // If it has been more than six hours since the last news update, start up the web scrapers.
    //   scrapeData();
    // }
  }
}

fetchCurrentNews();
// setInterval(fetchCurrentNews, 60000);
// scrapeData();
// setInterval(scrapeData, 60000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
