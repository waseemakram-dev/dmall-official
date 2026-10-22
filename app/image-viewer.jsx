'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './image-viewer.module.css';

export default function ImageViewer({ items, initialIndex, onClose }) {
  const dialog = useRef(null);
  const stage = useRef(null);
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const item = items[index];
  const move = direction => {
    setIndex(current => (current + direction + items.length) % items.length);
    setZoom(false);
    stage.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    const element = dialog.current;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  return createPortal(<dialog ref={dialog} className={styles.dialog} aria-labelledby="result-viewer-title" data-lenis-prevent
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <header className={styles.toolbar}>
      <div className={styles.title}><strong id="result-viewer-title">Dmall community results</strong><span aria-live="polite">{index + 1} / {items.length}</span></div>
      <div className={styles.tools}>
        <button type="button" onClick={() => setZoom(current => !current)} aria-label={zoom ? 'Fit image to screen' : 'Enlarge image'} aria-pressed={zoom}><Icon type={zoom ? 'fit' : 'zoom'} /></button>
        <button type="button" onClick={onClose} aria-label="Close image viewer" autoFocus><Icon type="close" /></button>
      </div>
    </header>
    <div className={styles.content}>
      <button className={`${styles.navigate} ${styles.previous}`} type="button" aria-label="Previous result" onClick={() => move(-1)}><Icon type="previous" /></button>
      <div ref={stage} className={`${styles.stage} ${zoom ? styles.zoomed : ''}`} data-lenis-prevent
        onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
        <img key={item.image} src={item.image} alt={`Original Dmall student or client result, image ${index + 1}`} draggable={false} />
      </div>
      <button className={`${styles.navigate} ${styles.next}`} type="button" aria-label="Next result" onClick={() => move(1)}><Icon type="next" /></button>
    </div>
    <p className={styles.caption}>{item.subtitle || 'Original student & client screenshot'}</p>
  </dialog>, document.body);
}

function Icon({ type }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'close' ? <path d="m6 6 12 12M6 18 18 6" /> : type === 'previous' ? <path d="m14 5-7 7 7 7" /> : type === 'next' ? <path d="m10 5 7 7-7 7" /> : type === 'fit' ? <path d="M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5" /> : <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6m-3-3v6" /></>}
  </svg>;
}
