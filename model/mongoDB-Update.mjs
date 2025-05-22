import { MongoClient } from 'mongodb';
import getAllHeadlines from './processData.mjs'

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;

async function scrapeData() {
  const today = new Date();

  const dbName = "newsAggregator";
  const collectionName = "headlines";
  const client = new MongoClient(uri);
  try {
    // Launches the news headlines collection from all the scrapers.
    const summerizedHeadlines = await getAllHeadlines();
    if (summerizedHeadlines.length === 0) {
      console.log("Error fetching any headlines");
      return
    }

    // Inserting data into MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB", today);

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({ 
      date: today.toISOString().slice(0, 10),
      time: today.getTime(),
      news: summerizedHeadlines 
    });
    console.log("Inserted document with _id:", result.insertedId);

    // If mutliple entries for a day exist, delete the later ones
    const multipleDateCheck = await collection.find({
      date: today.toISOString().slice(0, 10),
    }).toArray();
    if (multipleDateCheck.length > 1 && multipleDateCheck.length < 8) {
      multipleDateCheck.pop();

      for (const entry of multipleDateCheck) {
        try {
          console.log("Deleting", entry._id);
          await collection.deleteOne({ _id: entry._id });
        } catch (e) {
          console.error("Error deleting entry:", entry._id, e);
        }
      }
    }

  } catch (err) {
      console.error("An error occurred:", err);
  } finally {
      await client.close();
  }
}

scrapeData();

export default scrapeData;