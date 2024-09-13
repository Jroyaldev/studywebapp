import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { extractScriptureReferences } from '../utils/bibleReferenceUtils';

export default function ScriptureLookup() {
  const [inputReference, setInputReference] = useState('');
  const [parsedReferences, setParsedReferences] = useState([]);
  const [version, setVersion] = useState('KJV');
  const [scriptures, setScriptures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const references = extractScriptureReferences(inputReference);
    setParsedReferences(references);
  }, [inputReference]);

  const handleSubmit = async (e) => {
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
        const response = await fetch('/api/lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference, version }),
        });

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
      <div key={verse.number} className={styles.verseContainer}>
        <span className={styles.verseNumber}>{verse.number}</span>
        <span className={styles.verseContent}>{verse.text}</span>
      </div>
    );
  };

  const renderScripture = (scripture) => {
    if (scripture.verses && Array.isArray(scripture.verses)) {
      return scripture.verses.map(renderVerse);
    } else if (scripture.text) {
      // If we only have text, split it into verses based on verse numbers
      const verses = scripture.text.split(/(\d+)/).filter(Boolean);
      return verses.map((part, index, array) => {
        if (index % 2 === 0 && index + 1 < array.length) {
          return renderVerse({ number: part, text: array[index + 1].trim() });
        }
        return null;
      }).filter(Boolean);
    } else {
      return <p className={styles.error}>No scripture content available</p>;
    }
  };

  return (
    <div className={styles.card}>
      <h2>Scripture Lookup</h2>
      <form onSubmit={handleSubmit} className={styles.lookupForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={inputReference}
            onChange={(e) => setInputReference(e.target.value)}
            placeholder="Enter scripture references (e.g., John 3:16; Rom 5:1-5)"
            required
            className={styles.referenceInput}
          />
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={styles.versionSelect}
          >
            <option value="KJV">KJV</option>
            <option value="NLT">NLT</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading || parsedReferences.length === 0} className={styles.lookupButton}>
          {isLoading ? 'Loading...' : 'Look up'}
        </button>
      </form>
      {parsedReferences.length > 0 && (
        <p className={styles.parsedReference}>References: {parsedReferences.join('; ')}</p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {scriptures.map((scripture, index) => (
        <div key={index} className={styles.scriptureDisplay}>
          <h3 className={styles.scriptureReference}>{scripture.reference} ({scripture.version})</h3>
          {renderScripture(scripture)}
        </div>
      ))}
    </div>
  );
}