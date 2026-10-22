import { aboutContent } from './content/about';
import SectionLabel from './section-label';
import styles from './instructor.module.css';

export default function Instructor() {
  return <section id={aboutContent.id} className={styles.section} aria-labelledby="about-heading">
    <div className={styles.container}>
      <figure className={styles.card} data-motion-reveal>
        <img className={styles.portrait} src={aboutContent.image} alt={aboutContent.imageAlt} width="1122" height="1402" loading="lazy" />
        <figcaption className={styles.caption}><strong>{aboutContent.name}</strong><span>{aboutContent.caption}</span></figcaption>
      </figure>
      <div className={styles.copy} data-motion-reveal>
        <div className={styles.content}>
          <div className={styles.heading}>
            <h2 id="about-heading">{aboutContent.heading.map(line => <span key={line}>{line}</span>)}</h2>
            <SectionLabel>{aboutContent.label}</SectionLabel>
          </div>
          <div className={styles.paragraphs}>{aboutContent.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </div>
    </div>
  </section>;
}
