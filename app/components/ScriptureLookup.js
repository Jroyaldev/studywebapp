import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { extractScriptureReferences } from '../utils/bibleReferenceUtils';

export default function ScriptureLookup() {
  const [inputReference, setInputReference] = useState('');
  const [parsedReferences, setParsedReferences] = useState([]);
  const [translation, setTranslation] = useState('KJV');
  const [scriptures, setScriptures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const references = extractScriptureReferences(inputReference);
    setParsedReferences(references);
  }, [inputReference]);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (parsedReferences.length === 0) {
      setError('Please enter valid scripture references');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScriptures([]);

    try {
      const results = await Promise.all(parsedReferences.map(async (reference) => {
        const url = `/api/scripture?reference=${encodeURIComponent(reference)}&translation=${translation}`;
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch scripture for ${reference}`);
        }
        return await response.json();
      }));

      setScriptures(results);
    } catch (error) {
      console.error('Error fetching scriptures:', error);
      setError(`Failed to fetch scriptures: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerse = (verse) => {
    return (
      <div key={verse.reference} className={styles.verseContainer}>
        <span className={styles.verseNumber}>{verse.reference.split(':').pop()}</span>
        <span className={styles.verseContent}>{verse.content}</span>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <h2>Scripture Lookup</h2>
      <form onSubmit={handleLookup} className={styles.lookupForm}>
        <input
          type="text"
          value={inputReference}
          onChange={(e) => setInputReference(e.target.value)}
          placeholder="Enter scripture references (e.g., John 3:16; Rom 5:1-5)"
          required
        />
        <select value={translation} onChange={(e) => setTranslation(e.target.value)}>
          <option value="KJV">KJV</option>
          <option value="NLT">NLT</option>
        </select>
        <button type="submit" disabled={isLoading || parsedReferences.length === 0}>
          {isLoading ? 'Loading...' : 'Lookup'}
        </button>
      </form>
      {parsedReferences.length > 0 && (
        <p className={styles.parsedReference}>Parsed References: {parsedReferences.join('; ')}</p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {scriptures.map((scripture, index) => (
        <div key={index} className={styles.scriptureDisplay}>
          <h3 className={styles.scriptureReference}>{scripture.reference}</h3>
          {scripture.type === 'verse' ? (
            renderVerse(scripture.verses[0])
          ) : (
            <>
              {scripture.verses && scripture.verses.map(renderVerse)}
            </>
          )}
        </div>
      ))}
    </div>
  );
}