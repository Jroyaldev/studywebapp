import styles from '../page.module.css';

export default function DynamicInfo({ info }) {
  return (
    <div className={styles.card}>
      <h2>Dynamic Information</h2>
      <p>{info || 'No information available yet. Start typing in the notes section to generate insights.'}</p>
    </div>
  );
}