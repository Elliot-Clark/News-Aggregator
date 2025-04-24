import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;
const client = new MongoClient(uri);

const fetchHeadlines_Date = async (targetDate) => {
    // Fetches the the news from a given YYYY-MM-DD
    try {
        await client.connect();
        console.log("Connected to MongoDB ", targetDate);

        const db = client.db("newsAggregator");
        const collection = db.collection("headlines");
        let dateResults;
        if (targetDate) {
            dateResults = await collection.find({
                date: targetDate
            }).toArray();
        } else {
            dateResults = await collection.find().toArray();
        }
        // console.log("Headlines fetched:", results);
        return dateResults;

    } catch (err) {
        console.error("Error fetching headlines-date:", err.message);
        return [];
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

export default fetchHeadlines_Date;