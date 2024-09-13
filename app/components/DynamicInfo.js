import styles from '../page.module.css';

export default function DynamicInfo({ info }) {
  return (
    <div className={styles.card}>
      <h2>AI Insights</h2>
      <p className={styles.dynamicInfoText}>
        {info || 'Start typing in the notes section to generate AI-powered insights.'}
      </p>
    </div>
  );
}