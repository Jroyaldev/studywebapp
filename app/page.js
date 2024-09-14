'use client'

import dynamic from 'next/dynamic';
import NotesSection from './components/NotesSection';
import DynamicInfo from './components/DynamicInfo';
import Header from './components/Header'; // Correct default import

import styles from './page.module.css';
import { useState } from 'react';

const ScriptureLookup = dynamic(() => import('./components/ScriptureLookup'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [dynamicInfo, setDynamicInfo] = useState('');

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>StudyLink</h1>
        <p className={styles.subtitle}>Your AI-powered Bible study companion</p>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <ScriptureLookup />
            <NotesSection setDynamicInfo={setDynamicInfo} />
          </div>
          <div className={styles.sideContent}>
            <DynamicInfo />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
