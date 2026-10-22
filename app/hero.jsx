'use client';

import { motion, useReducedMotion } from 'motion/react';
import RollingText from './rolling-text';
import DecorativeVideo from './decorative-video';
import Navbar from './navbar';
import SectionLabel from './section-label';
import { heroContent } from './content/hero';
import dmall from './dmall-content.json';
import CustomCursor from './custom-cursor';
import SectionMotion from './section-motion';
import Preview from './preview';
import Problem from './problem';
import Solution from './solution';
import Testimonial from './testimonial';
import Audience from './audience';
import Freedom from './freedom';
import Curriculum from './curriculum';
import CaseStudies from './case-studies';
import Pricing from './pricing';
import Instructor from './instructor';
import Blog from './blog';
import FAQ from './faq';
import ClosingTestimonials from './closing-testimonials';
import Footer from './footer';
import styles from './hero.module.css';

export default function Hero() {
  const reduced = useReducedMotion();
  const appear = (delay, y = 10) => ({ initial: false, animate: reduced ? { opacity: 1, y: 0 } : { opacity: [.001, 1], y: [y, 0] }, transition: { type: 'spring', stiffness: 200, damping: 30, delay: reduced ? 0 : delay } });
  return (
    <div className="reference-root">
      <CustomCursor />
      <SectionMotion />
      <Navbar />

      <main>
        <section className={styles.section} aria-label="Hero Section">
          <div className={styles.container}>
            <div className={styles.leftCol}>
              <div className={styles.copyArea}>
                <motion.div className={styles.heroLabel} {...appear(.6, -10)}
                  animate={reduced ? { opacity: 1, y: 0, rotate: -2 } : { opacity: [.001, 1], y: [-10, 0], rotate: [0, -2] }}>
                  <SectionLabel>{heroContent.label}</SectionLabel>
                </motion.div>
                <div className={styles.headingCopy}>
                <h1 className={styles.headline}>
                  {heroContent.headlineWords.map((word, index) => (
                    <span
                      key={index}
                      className={styles.headlineWord}
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className={styles.subtitle}>{heroContent.subtitle.split(' ').map((word, wordIndex, words) => <span className={styles.subtitleWord} key={wordIndex}>{[...word].map((letter, letterIndex) => <span key={letterIndex} style={{ animationDelay: `${.15 + (words.slice(0, wordIndex).join(' ').length + letterIndex) * .004}s` }}>{letter}</span>)}{wordIndex < words.length - 1 ? ' ' : ''}</span>)}</p>
                </div>
              </div>

              <motion.div className={styles.buttonsRow} {...appear(.6)}>
                <a href={heroContent.primaryCta.href} className={styles.primaryBtn}>
                  <RollingText>{heroContent.primaryCta.label}</RollingText>
                </a>
                <a href={heroContent.secondaryCta.href} className={styles.secondaryBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <RollingText>{heroContent.secondaryCta.label}</RollingText>
                </a>
              </motion.div>

              <motion.div className={styles.liveBadgeRow} {...appear(.8)}>
                <div className={styles.officialColumn}>
                <span className={styles.liveOfficial}>{heroContent.statsBadge.title}</span>
                <div className={styles.ratingStars} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <svg key={index} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.83 5.74 6.34.92a1.1 1.1 0 0 1 .61 1.88l-4.59 4.47 1.08 6.31a1.1 1.1 0 0 1-1.59 1.16L12 20l-5.68 2.98a1.1 1.1 0 0 1-1.59-1.16l1.08-6.31-4.59-4.47a1.1 1.1 0 0 1 .61-1.88l6.34-.92L11 2.5a.56.56 0 0 1 1 0Z" /></svg>)}
                </div>
                </div>
                <span className={styles.badgeDivider} />
                <div className={styles.liveRecorded}>
                  <span className={styles.liveText}>{heroContent.statsBadge.subtitle}</span>
                  <div className={styles.avatarStack} aria-hidden="true">
                    {heroContent.statsBadge.avatars.map((item, index) => (
                      <img
                        key={index}
                        src={item.src}
                        alt=""
                        width={item.size}
                        height={item.size}
                        className={styles.avatarItem}
                        style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.videoCard}>
                <DecorativeVideo
                  src={heroContent.video}
                  loop
                  className={styles.heroVideo}
                />
              </div>

              <motion.div className={styles.tickerViewport} aria-hidden="true" {...appear(1, 0)}>
                <div className={styles.tickerTrack}>
                  {[...heroContent.tickerCards, ...heroContent.tickerCards].map((card, index) => (
                    <div key={index} className={styles.tickerCard}>
                      <div className={styles.tickerLogoWrap}>
                        <img
                          src={card.logo}
                          alt=""
                          width="68"
                          height="44"
                          className={styles.tickerLogo}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.tickerContent}>
                        <div className={styles.tickerTop}>
                          <span className={styles.tickerTitle}>{card.title}</span>
                          <span className={styles.tickerTag}>{card.tag}</span>
                        </div>
                        <span className={styles.tickerSubtitle}>{card.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="dmall-stats" aria-label="Dmall business figures">
          {[
            [dmall.stats.projects, 'Projects'],
            [dmall.stats.clients, 'Happy clients'],
            [dmall.stats.students, 'Students'],
            [dmall.stats.years, 'Years experience'],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{Number(value).toLocaleString('en-US')}+</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <Preview />
        <Problem />
        <Solution />
        <Testimonial />
        <Audience />
        <Freedom />
        <Curriculum />
        <CaseStudies />
        <Pricing />
        <Instructor />
        <Blog />
        <FAQ />
        <ClosingTestimonials />
      </main>

      <Footer />
    </div>
  );
}
