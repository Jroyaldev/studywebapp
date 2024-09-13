import { useState, useEffect } from 'react';
import styles from '../page.module.css';

export default function NotesSection({ setDynamicInfo }) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (notes) {
        // Simulating AI-generated insights
        setDynamicInfo(`AI-powered insights for "${notes.slice(0, 20)}..." are being generated.`);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [notes, setDynamicInfo]);

  return (
    <div className={styles.card}>
      <h2>Study Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here to receive AI-powered insights..."
        rows={15}
        className={styles.notesTextarea}
      />
    </div>
  );
}