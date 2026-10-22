'use client';

import { curriculumContent } from './content/curriculum';
import SectionLabel from './section-label';
import ContinuousCarousel from './continuous-carousel';
import DecorativeVideo from './decorative-video';
import styles from './curriculum.module.css';

const AVATARS = [
  'https://res.cloudinary.com/dj4rfocct/image/upload/v1792675507/wazemtech/dmall/MXxyg4e8x5dPHs3Nwz8m7v7jzk-9b7e9ab858.png',
  'https://res.cloudinary.com/dj4rfocct/image/upload/v1792675527/wazemtech/dmall/YbOU0Jz4Pcq7LUkTV5CwbVbtdA-f42d9f3312.jpg',
  'https://res.cloudinary.com/dj4rfocct/image/upload/v1792675551/wazemtech/dmall/d9h6fVXkcd1fnnAntXRdt5xig-80994b7685.png',
  'https://res.cloudinary.com/dj4rfocct/image/upload/v1792675587/wazemtech/dmall/iXCNcEo0M6lV7Kr3aHDAShkHFYQ-c4a37a7d25.png'
];

export default function Curriculum() {
  return (
    <section id="curriculum" className={styles.section} aria-labelledby="curriculum-heading">
      <div className={styles.container}>
        <header className={styles.header} data-motion-reveal>
          <div className={styles.titleArea}>
            <SectionLabel>{curriculumContent.label}</SectionLabel>
            <h2 id="curriculum-heading">{curriculumContent.heading}</h2>
          </div>
          <p className={styles.description}>{curriculumContent.description}</p>
        </header>

        <div className={styles.carouselArea}>
          <div className={styles.sliderContainer}>
            <ContinuousCarousel
              items={curriculumContent.cards}
              label="Course curriculum"
              arrows={true}
              maxCardWidth={420}
              renderItem={(card, index, visible) => (
                <article className={styles.card}>
                  <div className={styles.videoContainer}>
                    <DecorativeVideo
                      src={card.video}
                      active={visible}
                      className={styles.video}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <div className={styles.badgeRow}>
                    <span className={styles.officialBadge}>D-Mall OFFICIAL</span>
                    <span className={styles.badgeDivider} />
                    <div className={styles.recordedBadge}>
                      <span className={styles.recordedText}>Live + recorded</span>
                      <div className={styles.avatars}>
                        {AVATARS.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="Profile"
                            width="20"
                            height="20"
                            className={styles.avatar}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
