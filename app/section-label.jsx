import styles from './section-label.module.css';

export default function SectionLabel({ children, className = '' }) {
  return <span className={`dmall-section-label ${styles.label} ${className}`}>
    <span className={styles.text}>{children}</span>
  </span>;
}
