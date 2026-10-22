import { supportContent as content } from './content/support';
import SectionLabel from './section-label';
import AnimatedLink from './animated-link';
import LoopingRow from './looping-row';
import styles from './closing-testimonials.module.css';

export default function ClosingTestimonials() {
  return <section id="closing-testimonials" className={styles.section} aria-labelledby="support-heading">
    <div className={styles.container}>
      <header className={styles.header} data-motion-reveal>
        <SectionLabel>{content.label}</SectionLabel>
        <h2 id="support-heading">{content.heading}</h2>
        <AnimatedLink className={styles.button} href={content.cta.href} target="_blank" rel="noopener noreferrer">{content.cta.label}</AnimatedLink>
      </header>
      <div className={styles.backdrop}>
      {content.rows.map((row, index) => <LoopingRow reverse={index === 1} key={index} label={`Dmall training benefits ${index + 1}`}>
        {row.map(card => <article className={styles.card} key={card.text}>
          <p>{card.text}</p>
          <div className={styles.author}><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675566/wazemtech/dmall/dmall-logo-127cab5356.png" width="36" height="36" alt="" loading="lazy" /><span>{card.author}</span></div>
          <SectionLabel className={styles.tag}>{card.tag}</SectionLabel>
        </article>)}
      </LoopingRow>)}
      </div>
    </div>
  </section>;
}
