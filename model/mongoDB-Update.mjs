import { MongoClient } from 'mongodb';
import getAllHeadlines from './processData.mjs'

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;

async function storeData() {
  const today = new Date();

  const dbName = "newsAggregator";
  const collectionName = "headlines";
  const client = new MongoClient(uri);
  try {
    const summerizedHeadlines = await getAllHeadlines();
    if (summerizedHeadlines.length === 0) {
      console.log("Error fetching any headlines");
      return
    }

    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({ 
      date: today.toISOString().slice(0, 10),
      time: today.getTime(),
      news: summerizedHeadlines 
    });
    console.log("Inserted document with _id:", result.insertedId);
  } catch (err) {
      console.error("An error occurred:", err);
  } finally {
      await client.close();
  }
}

storeData();