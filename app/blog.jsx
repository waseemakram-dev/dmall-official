import { serviceLinks } from './content/service-links';
import SectionLabel from './section-label';
import AnimatedLink from './animated-link';
import styles from './blog.module.css';

export default function Blog() {
  return <section id="blog" className={styles.section} aria-labelledby="service-links-heading">
    <div className={styles.container}>
      <header className={styles.header} data-motion-reveal>
        <h3 id="service-links-heading">Explore our services</h3>
        <div className={styles.label}><SectionLabel>Our services</SectionLabel></div>
        <AnimatedLink className={styles.button} href="https://wa.me/923268669646" target="_blank" rel="noopener noreferrer">View all services</AnimatedLink>
      </header>
      <div className={styles.cards}>{serviceLinks.map(card => <a data-motion-reveal data-motion-card className={styles.card} key={card.title} href={card.href} target="_blank" rel="noopener noreferrer">
        <div className={styles.cardHeading}>
          <SectionLabel>{card.category}</SectionLabel>
          <div className={styles.cardText}><h5>{card.title}</h5><p>{card.description}</p></div>
        </div>
        <div className={styles.image}><img src={card.image} alt={card.imageAlt} width="1659" height="948" loading="lazy" /></div>
      </a>)}</div>
    </div>
  </section>;
}
