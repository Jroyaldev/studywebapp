import { MongoClient } from 'mongodb';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reference, version } = req.body;

    let client;
    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db('scripture_db');
      const collection = db.collection('scriptures');

      // Try to find the scripture in MongoDB first
      let scripture = await collection.findOne({ reference, version });

      if (!scripture) {
        // If not found in MongoDB, fetch from Bible Gateway
        const response = await axios.get(`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`);
        const dom = new JSDOM(response.data);
        const passageContent = dom.window.document.querySelector('.passage-content');

        if (passageContent) {
          const verses = passageContent.querySelectorAll('.text');
          let scriptureVerses = [];

          verses.forEach((verse) => {
            const verseNum = verse.querySelector('.versenum');
            const number = verseNum ? verseNum.textContent.trim() : '';
            const text = verse.textContent.replace(number, '').trim();
            scriptureVerses.push({ number, text });
          });

          scripture = {
            reference,
            version,
            verses: scriptureVerses,
            text: scriptureVerses.map(v => v.text).join(' ') // Add this line
          };

          // Store the fetched scripture in MongoDB
          await collection.insertOne(scripture);
        } else {
          throw new Error('Scripture not found on Bible Gateway');
        }
      }

      res.status(200).json(scripture);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: `Error fetching scripture: ${error.message}` });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}