import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.biblegateway.com/passage/?search=';

const TRANSLATION_IDS = {
  KJV: 'KJV',
  NLT: 'NLT'
};

async function fetchScripture(reference, translation = 'KJV') {
  const translationId = TRANSLATION_IDS[translation] || 'KJV';
  const url = `${BASE_URL}${encodeURIComponent(reference)}&version=${translationId}`;
  
  try {
    console.log('Fetching from URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    
    console.log('Fetched HTML length:', html.length);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract verses
    const verses = [];
    const passageContent = document.querySelector('.passage-content');
    if (passageContent) {
      const verseElements = passageContent.querySelectorAll('span[class^="text"]');
      verseElements.forEach((element) => {
        const verseNum = element.getAttribute('class').split('-').pop();
        // Remove verse numbers from the text content
        const verseText = element.textContent.replace(/^\d+\s/, '').trim();
        verses.push({ number: verseNum, text: verseText });
      });
    }

    // Extract passage reference
    const referenceElement = document.querySelector('.bcv');
    const passageReference = referenceElement ? referenceElement.textContent.trim() : reference;

    console.log('Extracted verses:', verses.length);
    console.log('Passage reference:', passageReference);

    if (verses.length === 0) {
      console.warn('No verses found for reference:', reference);
      console.log('HTML snippet:', html.substring(0, 1000)); // Log first 1000 characters of HTML
    }

    return {
      reference: passageReference,
      verses: verses,
      translation: translation
    };
  } catch (error) {
    console.error('Error fetching scripture:', error);
    throw new Error(`Failed to fetch scripture from BibleGateway: ${error.message}`);
  }
}

export { fetchScripture };