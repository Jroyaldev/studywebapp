'use client'

import ScriptureLookup from './components/ScriptureLookup';
import NotesSection from './components/NotesSection';
import DynamicInfo from './components/DynamicInfo';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>StudyLink</h1>
      <p className={styles.subtitle}>Your AI-powered Bible study companion</p>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <ScriptureLookup />
          <NotesSection />
        </div>
        <div className={styles.sideContent}>
          <DynamicInfo />
        </div>
      </div>
    </main>
  );
}
