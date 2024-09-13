import { useState, useEffect } from 'react';
import styles from '../page.module.css';

const books = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export default function ScriptureLookup() {
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [translation, setTranslation] = useState('KJV');
  const [type, setType] = useState('verse');
  const [scripture, setScripture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    if (book) {
      // In a real app, you'd fetch the actual number of chapters for the selected book
      setChapters(Array.from({ length: 50 }, (_, i) => i + 1));
    }
  }, [book]);

  useEffect(() => {
    if (chapter) {
      // In a real app, you'd fetch the actual number of verses for the selected chapter
      setVerses(Array.from({ length: 30 }, (_, i) => i + 1));
    }
  }, [chapter]);

  const handleLookup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setScripture(null);

    let reference;
    if (type === 'verse') {
      reference = `${book} ${chapter}:${verse}`;
    } else {
      reference = `${book} ${chapter}`;
    }
    const url = `/api/scripture?reference=${encodeURIComponent(reference)}&translation=${translation}&type=${type}`;
    console.log('Fetching from URL:', url);

    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Received data:', data);
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scripture');
      }
      setScripture(data);
    } catch (error) {
      console.error('Error fetching scripture:', error);
      setError(`Failed to fetch scripture: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Scripture Lookup</h2>
      <form onSubmit={handleLookup} className={styles.lookupForm}>
        <select value={book} onChange={(e) => setBook(e.target.value)} required>
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select value={chapter} onChange={(e) => setChapter(e.target.value)} required>
          <option value="">Chapter</option>
          {chapters.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {type === 'verse' && (
          <select value={verse} onChange={(e) => setVerse(e.target.value)} required>
            <option value="">Verse</option>
            {verses.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        )}
        <select value={translation} onChange={(e) => setTranslation(e.target.value)}>
          <option value="KJV">KJV</option>
          <option value="NLT">NLT</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="verse">Verse</option>
          <option value="chapter">Chapter</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Lookup'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {scripture && (
        <div className={styles.scriptureDisplay}>
          {scripture.type === 'verse' ? (
            <>
              <p className={styles.scriptureText}>
                <span className={styles.verseNumber}>{scripture.reference.split(':')[1]}</span>
                {scripture.content}
              </p>
              <p className={styles.scriptureReference}>{scripture.reference}</p>
            </>
          ) : (
            <>
              {scripture.verses && scripture.verses.map((verse, index) => (
                <div key={index} className={styles.verseContainer}>
                  <span className={styles.verseNumber}>{verse.reference.split(':')[1]}</span>
                  <span className={styles.verseContent}>{verse.content}</span>
                </div>
              ))}
              {scripture.verses && scripture.verses.length > 0 && (
                <p className={styles.scriptureReference}>{scripture.reference}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}