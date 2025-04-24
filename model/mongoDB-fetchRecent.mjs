import { MongoClient } from 'mongodb';

import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.mongoConnectionString;
const client = new MongoClient(uri);

const fetchHeadlines_Recent = async () => {
    // Fetches the most recent news stories stored in MongoDB
    try {
        await client.connect();
        console.log("Connected to MongoDB ");

        const db = client.db("newsAggregator");
        const collection = db.collection("headlines");
        let recentResults = await collection.find().sort({
             time: -1 
        }).limit(1).toArray();
        // console.log("Recent Headlines fetched:", recentResults);
        return recentResults;

    } catch (err) {
        console.error("Error fetching recent headlines:", err.message);
        return [];
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

export default fetchHeadlines_Recent;