import { bentoContent } from './content/bento';
import BentoHeading from './bento-heading';
import DecorationMotion from './decoration-motion';
import styles from './bento.module.css';

export default function Freedom() {
  const content = bentoContent.freedom;
  return <section id="freedom" className={styles.section} aria-labelledby="freedom-heading">
    <div className={styles.container}>
      <BentoHeading id="freedom-heading" label={content.label} description={content.description} video={content.video}>
        {['For brands', 'and', 'new founders']}
      </BentoHeading>
      <div className={styles.cards}>
        <div className={styles.column}>
          <article className={styles.launchCard}>
            <div className={styles.cardText}><h5>{content.cards[0].title}</h5><p>{content.cards[0].description}</p></div>
            <img className={styles.sleepIcon} src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675616/wazemtech/dmall/sleep-8f61b50807.svg" alt="" width="145" height="132" aria-hidden="true" />
          </article>
          <article className={styles.statementCard}>
            <h4 className={styles.statement}><span>Start</span><span className={styles.greenMoney} aria-hidden="true"><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675601/wazemtech/dmall/money-green-1011be0e85.svg" alt="" width="19" height="19" /></span><span>online</span><span>with support</span></h4>
          </article>
        </div>
        <article className={styles.marketCard}>
          <div className={styles.cardText}><h5>{content.cards[2].title}</h5><p>{content.cards[2].description}</p></div>
          <div className={styles.marketGraphic}>
            <DecorationMotion className={styles.locations} y={20} delay={.4}>
              <div className={styles.locationList}>{content.locations.map(location => <div key={location.city}><strong>{location.city}</strong><span>{location.address}</span></div>)}</div>
              <span className={styles.plane} aria-hidden="true"><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675608/wazemtech/dmall/plane-1066decdb9.svg" alt="" width="20" height="20" /></span>
            </DecorationMotion>
            <div className={styles.messageAnchor}>
              <DecorationMotion className={styles.marketMessage} y={20} delay={.8}>
                <img src={content.avatar} alt="" width="32" height="32" loading="lazy" /><p>{content.message}</p>
              </DecorationMotion>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>;
}
