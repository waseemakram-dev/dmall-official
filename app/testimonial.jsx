'use client';

import { useState } from 'react';
import ImageViewer from './image-viewer';
import { testimonialsContent } from './content/testimonials';
import SectionLabel from './section-label';
import ContinuousCarousel from './continuous-carousel';
import styles from './testimonial.module.css';

export default function Testimonial() {
  const [openImage, setOpenImage] = useState(null);
  return (
    <section id="testimonials" className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.container}>
        <header className={`${styles.header} dmall-results-heading`}>
          <SectionLabel>{testimonialsContent.label}</SectionLabel>
          <h2 id="testimonials-heading">{testimonialsContent.heading}</h2>
          <p>{testimonialsContent.description}</p>
        </header>

        <div className={styles.sliderWrap}>
          <ContinuousCarousel
            items={testimonialsContent.items}
            label="Student testimonials"
            threeAcross={true}
            autoplay={openImage === null}
            className={styles.carousel}
            renderItem={(item, index) => (
              <div className="dmall-result-card" style={{ height: '100%' }}>
                <button
                  type="button"
                  className={`dmall-proof-link ${styles.proofButton}`}
                  onClick={() => setOpenImage(index)}
                  aria-haspopup="dialog"
                  aria-label="Open original Dmall result screenshot"
                >
                  <div className="dmall-proof-stage">
                    <span className="dmall-proof-phone">
                      <img
                        src={item.image}
                        alt="Original result screenshot shared by the Dmall community"
                        loading="lazy"
                        draggable={false}
                      />
                    </span>
                    <span className="dmall-proof-mark" aria-hidden="true">D MALL</span>
                  </div>
                  <div className="dmall-proof-caption">
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                    <span className="dmall-proof-open" aria-hidden="true">↗</span>
                  </div>
                </button>
              </div>
            )}
          />
        </div>
      </div>
      {openImage !== null && <ImageViewer items={testimonialsContent.items} initialIndex={openImage} onClose={() => setOpenImage(null)} />}
    </section>
  );
}
