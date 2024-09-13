'use client'

import { useState } from 'react';
import ScriptureLookup from './components/ScriptureLookup';
import NotesSection from './components/NotesSection';
import DynamicInfo from './components/DynamicInfo';
import styles from './page.module.css';

export default function Home() {
  const [dynamicInfo, setDynamicInfo] = useState('');

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>StudyLink</h1>
      <p className={styles.subtitle}>Your AI-powered Bible study companion</p>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <ScriptureLookup />
          <NotesSection setDynamicInfo={setDynamicInfo} />
        </div>
        <div className={styles.sideContent}>
          <DynamicInfo info={dynamicInfo} />
        </div>
      </div>
    </main>
  );
}
