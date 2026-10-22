import ServiceVisual from './service-visual';
import SectionLabel from './section-label';
import styles from './services-overview.module.css';

export default function ServicesOverview({ content, variant }) {
  return <section className={styles.section} aria-labelledby={`${variant}-heading`}>
    <div className={styles.container}>
      <header className={styles.header} data-motion-reveal>
        <h3 id={`${variant}-heading`}>{content.heading}</h3>
        <div className={styles.label}><SectionLabel>{content.label}</SectionLabel></div>
        <p>{content.description}</p>
      </header>
      <div className={styles.grid}>
        {content.cards.map((card, index) => <article data-motion-reveal data-motion-card key={card.title}
          className={`${styles.card} ${(variant === 'problem' ? index === 1 : index === 0) ? styles.tall : ''}`}>
          <div className={styles.visualSlot}><ServiceVisual type={card.visual} expanded={variant === 'problem' ? index === 1 : index === 0} /></div>
          <div className={styles.cardText}><h5>{card.title}</h5><p>{card.description}</p></div>
        </article>)}
      </div>
    </div>
  </section>;
}
