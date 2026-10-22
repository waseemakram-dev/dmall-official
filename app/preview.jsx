'use client';

import { motion, useReducedMotion } from 'motion/react';
import { previewContent as content } from './content/preview';
import DecorativeVideo from './decorative-video';
import SectionLabel from './section-label';
import AnimatedLink from './animated-link';
import styles from './preview.module.css';

export default function Preview() {
  const reducedMotion = useReducedMotion();
  return <section className={styles.section} aria-labelledby="training-preview-heading">
    <div className={styles.container}>
      <header className={styles.header}>
        <SectionLabel>{content.label}</SectionLabel>
        <div className={styles.text}>
          <motion.h2 id="training-preview-heading" className={styles.title}
            initial={false} whileInView={reducedMotion ? undefined : { opacity: [0, 1], y: [10, 0], filter: ['blur(6px)', 'blur(0px)'] }}
            viewport={{ amount: .25 }} transition={{ duration: .6 }}>
            <span>{content.title[0]}</span>
            <motion.span className={styles.videoFrame} aria-hidden="true" initial={false}
              whileInView={reducedMotion ? { rotate: 5 } : { rotate: [5, -12] }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', duration: 1, bounce: .25, repeat: Infinity, repeatType: 'mirror', repeatDelay: .4 }}>
              <DecorativeVideo src={content.video} className={styles.video} />
            </motion.span>
            <span>{content.title[1]}</span><span>{content.title[2]}</span>
          </motion.h2>
          <p>{content.description}</p>
        </div>
      </header>
      <AnimatedLink className="dmall-cta" href={content.cta.href} target="_blank" rel="noopener noreferrer">{content.cta.label}</AnimatedLink>
    </div>
  </section>;
}
