import { useState, useEffect } from 'react';
import styles from '../page.module.css';

export default function NotesSection({ setDynamicInfo }) {
  const [notes, setNotes] = useState('');

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes) {
        // Simulating AI-generated insights
        setDynamicInfo(`AI-powered insights for "${notes.slice(0, 20)}..." are being generated.`);
      } else {
        setDynamicInfo('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [notes, setDynamicInfo]);

  return (
    <div className={styles.card}>
      <h2>Study Notes</h2>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Enter your study notes here..."
        rows={5}
      />
    </div>
  );
}