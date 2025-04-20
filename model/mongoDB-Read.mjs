import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;
const client = new MongoClient(uri);

async function fetchHeadlines(targetDate) {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("newsAggregator");
        const collection = db.collection("headlines");
        const results = await collection.find({
            date: targetDate
        }).toArray();

        console.log("Headlines fetched:", results);
        return results;

    } catch (err) {
        console.error("Error fetching headlines:", err.message);
        return [];
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

  fetchHeadlines('2025-04-18');