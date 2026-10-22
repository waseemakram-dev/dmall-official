'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import styles from './looping-row.module.css';

/** Two React-rendered copies keep the row continuous; only the first is accessible. */
export default function LoopingRow({ children, reverse = false, label }) {
  const viewport = useRef(null);
  const group = useRef(null);
  const [distance, setDistance] = useState(0);
  const visible = useInView(viewport, { amount: .1 });

  useEffect(() => {
    const measure = () => setDistance(group.current.getBoundingClientRect().width);
    const size = new ResizeObserver(measure);
    size.observe(group.current);
    measure();
    return () => size.disconnect();
  }, []);

  return <div ref={viewport} className={styles.viewport} role="group" aria-label={label} data-visible={visible}>
    <div className={`${styles.track} ${reverse ? styles.reverse : ''}`} style={{ '--loop-distance': `${distance}px` }}>
      <div ref={group} className={styles.group}>{children}</div>
      <div className={styles.group} aria-hidden="true" inert>{children}</div>
    </div>
  </div>;
}
