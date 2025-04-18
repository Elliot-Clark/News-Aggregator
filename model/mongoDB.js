import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;

// Database and collection names
const dbName = "newsAggregator";
const collectionName = "headlines";

// Sample array to store
const sampleArray = [[
    {
      text: 'Maryland Democrat says he was ‘stopped by soldiers’ from entering Salvadoran prison where Abrego Garcia is being held.',
      href: 'https://www.cnn.com/2025/04/17/politics/kilmar-abrego-garcia-van-hollen-cecot-el-salvador/index.html'
    }
  ],
  [
    {
      text: 'Appeals court backs judge in Abrego Garcia case',
      href: 'https://www.cnn.com/2025/04/17/politics/4th-circuit-wilkinson-abrego-garcia-xinis/index.html'
    }
  ]];

async function run() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the array as a document
        const result = await collection.insertOne({ myArray: sampleArray });
        console.log("Inserted document with _id:", result.insertedId);

    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        await client.close();
    }
}

run();
