import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const scriptureData = req.body;

    let client;
    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db('scripture_db');
      
      // Check if the collection exists, if not, create it
      const collections = await db.listCollections({ name: 'scriptures' }).toArray();
      if (collections.length === 0) {
        await db.createCollection('scriptures');
        console.log('Created "scriptures" collection');
      }
      
      const collection = db.collection('scriptures');

      // Insert or update the scripture
      const result = await collection.updateOne(
        { reference: scriptureData.reference },
        { $set: scriptureData },
        { upsert: true }
      );

      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        res.status(200).json({ message: 'Scripture stored successfully' });
      } else {
        res.status(200).json({ message: 'Scripture already exists' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: `Error storing scripture in database: ${error.message}` });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}