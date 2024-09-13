import { useState } from 'react';
import styles from '../page.module.css';

export default function ScriptureLookup() {
  const [reference, setReference] = useState('');
  const [scripture, setScripture] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setScripture(null);
    setIsLoading(true);

    try {
      // First, lookup the scripture
      const lookupResponse = await fetch('/api/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const lookupData = await lookupResponse.json();

      if (!lookupResponse.ok) {
        throw new Error(lookupData.error || 'Failed to fetch scripture');
      }

      setScripture(lookupData);

      // Then, send the scripture to be stored in MongoDB
      const storeResponse = await fetch('/api/store-scripture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lookupData),
      });

      const storeData = await storeResponse.json();

      if (!storeResponse.ok) {
        console.error('Failed to store scripture in MongoDB:', storeData.error);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the rendering part to match your MongoDB data structure
  return (
    <div className={styles.card}>
      <h2>Scripture Lookup</h2>
      <form onSubmit={handleSubmit} className={styles.lookupForm}>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Enter scripture reference"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Look up'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {scripture && (
        <div className={styles.scriptureDisplay}>
          <p className={styles.scriptureText}>{scripture.text}</p>
          <p className={styles.scriptureReference}>{scripture.reference}</p>
        </div>
      )}
    </div>
  );

  // ... rest of the component code (render method) remains the same
}