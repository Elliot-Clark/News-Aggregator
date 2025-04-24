// server.js
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
app.get('/news', async (req, res) => {
  try {
    res.json(newsData);
  } catch (error) {
    console.error('Error calling microservice:', error);
    res.status(500).json({ error: 'Failed to fetch microservice data' });
  }
});

const fetchNewsData = async () => {
  console.log("Running fetchNewsData");
  // const today = new Date();
  // let data = await fetchHeadlines_Date(today.toISOString().slice(0, 10))

  let data = await fetchHeadlines_Recent();
  console.log(data);
  newsData = await data[0].news;
}

fetchNewsData();
// setInterval(fetchNewsData, 60000);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
