import SectionLabel from './section-label';
import DecorativeVideo from './decorative-video';
import DecorationMotion from './decoration-motion';
import styles from './bento.module.css';

export default function BentoHeading({ id, label, description, video, children, tilt = false }) {
  return <header className={styles.header} data-motion-reveal>
    <SectionLabel>{label}</SectionLabel>
    <div className={styles.headingContent}>
      <h2 id={id} className={styles.heading}>
        <span>{children[0]}</span>
        <DecorationMotion mode={tilt ? 'tilt' : 'none'} className={styles.headingVideo} aria-hidden="true">
          <DecorativeVideo src={video} className={styles.video} />
        </DecorationMotion>
        {children.slice(1).map(text => <span key={text}>{text}</span>)}
      </h2>
      <p>{description}</p>
    </div>
  </header>;
}
