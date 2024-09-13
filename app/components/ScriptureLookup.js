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

  const renderScriptureContent = (content) => {
    return content.map((item, index) => {
      if (item.type === 'heading') {
        return <h4 key={`heading-${index}`} className={styles.scriptureHeading}>{item.text}</h4>;
      } else {
        return (
          <div key={`verse-${item.number}`} className={styles.verseContainer}>
            <span className={styles.verseNumber}>{item.number}</span>
            <span className={styles.verseContent}>{item.text}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className={styles.card}>
      <h2>Scripture Lookup</h2>
      <form onSubmit={handleSubmit} className={styles.lookupForm}>
        <div className={styles.inputContainer}>
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
          {renderScriptureContent(scripture.content)}
        </div>
      ))}
    </div>
  );
}