import { MongoClient } from 'mongodb';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reference, version, includeHeadings = true } = req.body;

    let client;
    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db('scripture_db');
      const collection = db.collection('verses');

      // Try to find the verses in MongoDB first
      let verses = await collection.find({ reference: { $regex: new RegExp('^' + reference) }, version }).toArray();

      if (verses.length === 0) {
        console.log(`Fetching scripture for ${reference} (${version}) from Bible Gateway`);
        const response = await axios.get(`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=${version}`);
        const dom = new JSDOM(response.data);
        const passageContent = dom.window.document.querySelector('.passage-content');

        if (passageContent) {
          let scriptureContent = [];
          let currentVerseNumber = 0;

          passageContent.querySelectorAll('p, .heading').forEach((element) => {
            if (element.classList.contains('heading') && includeHeadings) {
              scriptureContent.push({ type: 'heading', text: element.textContent.trim() });
            } else {
              const verseNum = element.querySelector('.versenum');
              const chapterNum = element.querySelector('.chapternum');
              let text = element.textContent.trim();

              if (verseNum) {
                currentVerseNumber = parseInt(verseNum.textContent.trim(), 10);
                text = text.replace(verseNum.textContent, '').trim();
              } else if (chapterNum) {
                currentVerseNumber = 1;
                text = text.replace(chapterNum.textContent, '').trim();
              }

              if (currentVerseNumber > 0) {
                scriptureContent.push({ type: 'verse', number: currentVerseNumber, text });
              }
            }
          });

          // Store the fetched verses in MongoDB
          const versesToStore = scriptureContent.filter(item => item.type === 'verse').map(v => {
            const baseReference = reference.split(':')[0]; // This gets just the book and chapter
            return {
              reference: `${baseReference}:${v.number}`,
              version,
              number: v.number,
              text: v.text
            };
          });
          
          if (versesToStore.length > 0) {
            await collection.insertMany(versesToStore);
          }

          const scripture = {
            reference,
            version,
            content: scriptureContent,
            text: scriptureContent.map(item => 
              item.type === 'heading' ? item.text : `${item.number} ${item.text}`
            ).join(' ')
          };

          res.status(200).json(scripture);
        } else {
          throw new Error('Scripture not found on Bible Gateway');
        }
      } else {
        // If verses were found in MongoDB, format them correctly
        const scripture = {
          reference,
          version,
          content: verses.map(v => ({ type: 'verse', number: v.number, text: v.text })),
          text: verses.map(v => `${v.number} ${v.text}`).join(' ')
        };
        res.status(200).json(scripture);
      }
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