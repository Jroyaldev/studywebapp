import styles from '../page.module.css';

export default function DynamicInfo({ info }) {
  if (!info) return null;

  return (
    <div className={styles.dynamicInfo}>
      <h3>AI Insights</h3>
      <p>{info}</p>
    </div>
  );
}