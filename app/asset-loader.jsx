'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { assetTotal, getAssetProgress, preloadSiteAssets, subscribeToAssetProgress } from './preload-assets';
import styles from './asset-loader.module.css';

const AssetContext = createContext({ ready: true, videos: {} });
export const useLoadedAssets = () => useContext(AssetContext);

export default function AssetLoader({ children }) {
  const [assets, setAssets] = useState({ ready: false, videos: {} });
  const [progress, setProgress] = useState({ completed: 0, total: assetTotal });
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [prepared, setPrepared] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeToAssetProgress(value => { if (active) setProgress(value); });
    setFailed(false);
    preloadSiteAssets().then(videos => {
      if (!active) return;
      setProgress(getAssetProgress());
      setPrepared(videos);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; unsubscribe(); };
  }, [attempt]);

  useEffect(() => {
    if (prepared === null) return;
    let secondFrame, timer;
    // First render/paint the actual completed state, including 100% and final
    // counts. Keep it visible briefly before starting the existing fade-out.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        timer = setTimeout(() => setAssets({ ready: true, videos: prepared }), 550);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
      clearTimeout(timer);
    };
  }, [prepared]);

  useEffect(() => {
    if (assets.ready) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  }, [assets.ready]);

  const complete = prepared !== null;
  const percent = complete ? 100 : Math.min(99, Math.floor((progress.loadedBytes || 0) / (progress.totalBytes || 1) * 100));
  const downloadedMB = ((progress.loadedBytes || 0) / 1048576).toFixed(1);
  const totalMB = ((progress.totalBytes || 0) / 1048576).toFixed(1);
  return <AssetContext.Provider value={assets}>
    {/* Keep page content in server HTML; remount once ready so entrances start on reveal. */}
    <div key={assets.ready ? 'ready' : 'loading'} hidden={!assets.ready} inert={!assets.ready} aria-hidden={!assets.ready}>
      {children}
    </div>
    <AnimatePresence>
      {!assets.ready && <motion.div key="asset-loader" className={styles.screen} initial={false}
        exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }} aria-busy={!failed && !complete}>
        <div className={styles.wordmark} aria-label="D-Mall OFFICIAL">D-Mall<span>OFFICIAL</span></div>
        <div className={styles.center}>
          {/* Adapted from the Uiverse.io loader by Praashoo7, supplied by the user. */}
          <div className={`${styles.kinetic} ${failed || complete ? styles.stopped : ''}`} aria-hidden="true">
            <div className={styles.rails}>
              {Array.from({ length: 9 }, (_, index) => <div key={index} className={styles.rail} style={{ transform: `rotate(${index * 20}deg)` }} />)}
            </div>
            <div className={styles.ballLanes}>
              {Array.from({ length: 9 }, (_, index) => <div key={index} className={styles.ballLane} style={{ transform: `rotate(${index * 20}deg)` }}>
                <div className={styles.ball} style={{ animationDelay: `${index * .2}s` }} />
              </div>)}
            </div>
          </div>
          <span className={styles.eyebrow}>YOUR NEXT CHAPTER</span>
          <h1>{failed ? 'Let’s try that again.' : complete ? 'You’re all set.' : 'Good things take a moment.'}</h1>
          <p role="status" aria-live="polite">{failed ? 'Some files couldn’t load. Check your connection and try again.' : complete ? '100% loaded. Everything is ready.' : 'Getting every detail ready for you.'}</p>
          <div className={styles.progress} role="progressbar" aria-label="Website assets downloaded" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${progress.completed} of ${progress.total} assets ready`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className={styles.details}><span>{progress.completed} / {progress.total} assets ready</span><span>{percent}%</span></div>
          <span className={styles.transfer}>{downloadedMB} / {totalMB} MB ready{progress.cached > 0 ? ` · ${progress.cached} from cache` : ''}</span>
          {failed && <button className={styles.retry} type="button" onClick={() => setAttempt(value => value + 1)}>Retry loading <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5m10-5a8 8 0 0 0-14 1m0 9a8 8 0 0 0 14-1" /></svg></button>}
        </div>
        <div className={styles.footer}><span>Shopify · Marketing · Training</span><span>Dmall, made for your next step.</span></div>
      </motion.div>}
    </AnimatePresence>
  </AssetContext.Provider>;
}
