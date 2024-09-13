'use client'

import { useState } from 'react';
import styles from './page.module.css';
import ScriptureLookup from './components/ScriptureLookup';
import NotesSection from './components/NotesSection';
import DynamicInfo from './components/DynamicInfo';

export default function Home() {
  const [dynamicInfo, setDynamicInfo] = useState('');

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>ScriptureAI</h1>
      <p className={styles.subtitle}>Elevate your scripture study with AI-powered insights</p>
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
