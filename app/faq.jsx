'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { faqContent } from './content/faq';
import SectionLabel from './section-label';
import styles from './faq.module.css';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const reducedMotion = useReducedMotion();

  return <section id="faqs" className={styles.section} aria-labelledby="faq-heading">
    <div className={styles.container}>
      <header className={styles.header} data-motion-reveal>
        <div className={styles.intro}>
          <div className={styles.heading}>
            <h2 id="faq-heading" className={styles.title}>{faqContent.heading.map(line => <span key={line}>{line}</span>)}</h2>
            <SectionLabel className={styles.badge}>{faqContent.label}</SectionLabel>
          </div>
          <p className={styles.description}>{faqContent.intro}</p>
        </div>
      </header>
      <div className={styles.list}>
        {faqContent.items.map(item => {
          const open = openId === item.id;
          return <article key={item.id} className={styles.item}>
            <h3 className={styles.question}>
              <button type="button" id={`faq-question-${item.id}`} className={styles.trigger}
                aria-expanded={open} aria-controls={`faq-answer-${item.id}`}
                onClick={() => setOpenId(current => current === item.id ? null : item.id)}>
                <span>{item.question}</span>
                <svg className={styles.icon} viewBox="0 0 24 25" fill="none" aria-hidden="true">
                  <path d="M5 12.5h14" />
                  <path className={styles.vertical} d="M12 5.5v14" />
                </svg>
              </button>
            </h3>
            <motion.div id={`faq-answer-${item.id}`} role="region" aria-labelledby={`faq-question-${item.id}`}
              aria-hidden={!open} inert={!open} className={styles.panel} initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', bounce: .2, duration: .4 }}>
              <div className={styles.answer}>
                <p>{item.answer}</p>
                {item.links && <p className={styles.links}>{item.links.map((link, index) => <span key={link.href}>
                  {index > 0 && ' · '}<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </span>)}</p>}
              </div>
            </motion.div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
