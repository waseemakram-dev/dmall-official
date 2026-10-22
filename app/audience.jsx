import { bentoContent } from './content/bento';
import BentoHeading from './bento-heading';
import DecorationMotion from './decoration-motion';
import styles from './bento.module.css';

export default function Audience() {
  const content = bentoContent.audience;
  return <section id="is-this-you" className={styles.section} aria-labelledby="audience-heading">
    <div className={styles.container}>
      <BentoHeading id="audience-heading" label={content.label} description={content.description} video={content.video} tilt>
        {['Ready to', 'grow', 'your business?']}
      </BentoHeading>
      <div className={styles.cards}>
        <article className={styles.chatCard}>
          <div className={styles.messages}>
            {content.messages.map((message, index) => <div className={`${styles.messageRow} ${index === 1 ? styles.incoming : ''}`} key={message}>
              <DecorationMotion className={`${styles.message} ${styles[`message${index}`]}`} x={index === 1 ? -60 : 60} delay={.4 + index * .2}>
                <span className={`${styles.status} ${styles[`status${index}`]}`} aria-hidden="true" />
                <p>{index === 1 ? <><span className={styles.desktopReply}>{message}</span><span className={styles.mobileReply}>{content.mobileReply}</span></> : message}</p>
              </DecorationMotion>
            </div>)}
          </div>
          <div className={styles.cardText}><h5>{content.cards[0].title}</h5><p>{content.cards[0].description}</p></div>
        </article>
        <div className={styles.column}>
          <article className={styles.clockCard}>
            <div className={styles.cardText}><h5>{content.cards[1].title}</h5><p>{content.cards[1].description}</p></div>
            <DecorationMotion mode="clock" className={styles.clock} aria-hidden="true"><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675545/wazemtech/dmall/alarm-clock-2ebb5a476f.svg" alt="" width="252" height="252" /></DecorationMotion>
          </article>
          <article className={styles.statementCard}>
            <h4 className={styles.statement}><span>Build your</span><span className={styles.desktopBusiness}>online</span><span className={styles.tabletBusiness}>online business</span><span className={styles.redMoney} aria-hidden="true"><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675604/wazemtech/dmall/money-red-835638c932.svg" alt="" width="19" height="19" /></span><span className={styles.desktopBusiness}>business</span></h4>
          </article>
        </div>
      </div>
    </div>
  </section>;
}
