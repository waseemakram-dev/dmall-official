import styles from './rolling-text.module.css';

export default function RollingText({ children }) {
  return <span className={styles.window}><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}
