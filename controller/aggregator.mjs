// Aggregator Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import fetchHeadlines_Date from '../model/mongoDB-fetchDate.mjs';
import fetchHeadlines_Recent from '../model/mongoDB-fetchRecent.mjs';

const app = express();
const PORT = 5000;
let newsData;

app.use(cors());
app.get('/currentNews', async (req, res) => {
  try {
    res.json(newsData);
  } catch (error) {
    console.error('Error calling microservice:', error);
    res.status(500).json({ error: 'Failed to fetch microservice data' });
  }
});

app.get('/pastNews', (req, res) => {
  const date = req.query.date;
  console.log(`Received GET request for date: ${date}`);
  try {
    fetchHeadlines_Date(date)
    .then(response => {
      console.log(response)
      res.json(response[0].news)
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
  newsData = await data[0].news;
}

fetchCurrentNews();
// setInterval(fetchCurrentNews, 60000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
