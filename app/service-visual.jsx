'use client';

import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import styles from './service-visual.module.css';

/** Decorative product illustrations; all business copy stays in the parent card. */
export default function ServiceVisual({ type, expanded = false }) {
  const ref = useRef(null);
  const canvas = useRef(null);
  const visible = useInView(ref, { amount: .15 });
  const reduced = useReducedMotion();
  useEffect(() => {
    const fit = () => {
      const available = ref.current.clientHeight;
      const height = canvas.current.offsetHeight;
      ref.current.style.setProperty('--visual-scale', String(height ? Math.min(1, available / height) : 1));
    };
    const resize = new ResizeObserver(fit);
    resize.observe(ref.current);
    resize.observe(canvas.current);
    fit();
    return () => resize.disconnect();
  }, []);
  return <div ref={ref} className={styles.visual} aria-hidden="true" data-playing={visible && !reduced} data-expanded={expanded}>
    <div ref={canvas} className={styles.canvas}>
    {type === 'store-builder' && <StoreBuilder />}
    {type === 'campaigns' && <Campaigns />}
    {type === 'lessons' && <Lessons />}
    {type === 'storefront' && <Storefront />}
    {type === 'performance' && <Performance />}
    {type === 'learning-path' && <LearningPath />}
    </div>
  </div>;
}

function Icon({ name, size = 18, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {name === 'bag' ? <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>
      : name === 'check' ? <path d="m5 12 4 4L19 6" />
      : name === 'play' ? <path d="m9 5 10 7-10 7V5Z" />
      : name === 'cursor' ? <path d="m5 3 14 9-7 1-3 7L5 3Z" />
      : name === 'chart' ? <><path d="M4 4v16h16M8 15l4-6 4 3 4-7" /></>
      : name === 'arrow' ? <path d="M5 19 19 5M5 5h14v14" />
      : name === 'book' ? <><path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3V4Zm9 2v15" /></>
      : <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M8 9h8M8 13h5" /></>}
  </svg>;
}

function Chrome({ title, children, className = '' }) {
  return <div className={`${styles.window} ${className}`}>
    <div className={styles.chrome}><span className={styles.dots}><i /><i /><i /></span><span>{title}</span><span className={styles.secure}><Icon name="check" size={10} /></span></div>
    {children}
  </div>;
}

function Product({ kind = 'bottle', className = '' }) {
  return <div className={`${styles.product} ${styles[kind] || ''} ${className}`}>
    {kind === 'bottle' ? <svg viewBox="0 0 80 80"><rect x="31" y="10" width="18" height="8" rx="3" fill="#222c30" /><rect x="26" y="17" width="28" height="52" rx="10" fill="#7dc9d7" /><rect x="29" y="30" width="22" height="21" rx="2" fill="#e8f5f5" /><path d="M35 38h10m-10 5h7" stroke="#4e919c" strokeWidth="2" /></svg>
      : kind === 'bag' ? <svg viewBox="0 0 80 80"><path d="M19 28h42l5 40H14l5-40Z" fill="#c6b59b" /><path d="M29 31V21a11 11 0 0 1 22 0v10" fill="none" stroke="#716656" strokeWidth="4" /><path d="M27 44h26" stroke="#b1a085" strokeWidth="2" /></svg>
      : <svg viewBox="0 0 80 80"><path d="m26 15 14 4 14-4 16 14-11 12-6-5v31H27V36l-6 5L10 29l16-14Z" fill="#394a50" /><path d="M32 17q8 14 16 0" fill="none" stroke="#24353a" strokeWidth="4" /><path d="M32 40h16" stroke="#7dc9d7" strokeWidth="2" /></svg>}
  </div>;
}

function StoreBuilder() {
  return <Chrome title="Store editor" className={styles.builder}>
    <div className={styles.builderBody}>
      <div className={styles.toolRail}>{['bag', 'card', 'chart'].map((name, i) => <span key={name} className={i === 0 ? styles.selectedTool : ''}><Icon name={name} size={14} /></span>)}</div>
      <div className={styles.builderPreview}><div className={styles.smallBrand}>YOUR BRAND <span>Shop · About</span></div><div className={styles.builderProducts}><Product /><div><span className={styles.eyebrow}>MADE FOR EVERYDAY</span><strong>A store of your own.</strong><span className={styles.miniButton}>Shop collection <Icon name="arrow" size={8} /></span></div></div></div>
      <span className={styles.codeCursor}><Icon name="cursor" size={20} /><span>Customize</span></span>
    </div>
  </Chrome>;
}

function Graph({ compact = false }) {
  return <div className={`${styles.graph} ${compact ? styles.compactGraph : ''}`}>
    <div className={styles.graphLines}><i /><i /><i /></div>
    <svg viewBox="0 0 320 115" preserveAspectRatio="none"><path className={styles.graphArea} d="M0 104 30 94 60 99 90 69 120 77 150 49 180 59 210 31 240 40 270 13 300 20 320 3V115H0Z" fill="#40b9db" fillOpacity=".10" /><path className={styles.graphLine} pathLength="1" d="m0 104 30-10 30 5 30-30 30 8 30-28 30 10 30-28 30 9 30-27 30 7 20-17" fill="none" stroke="#40b9db" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg>
    <div className={styles.graphAxis}><span>Discover</span><span>Reach</span><span>Grow</span></div>
  </div>;
}

function Channels() {
  return <div className={styles.channels}><span>Meta</span><span>Google</span><span>TikTok</span></div>;
}

function Campaigns() {
  return <div className={styles.campaignScene}>
    <Chrome title="Campaign workspace">
      <div className={styles.dashboardBody}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>YOUR NEXT AUDIENCE</span><strong>Make your brand visible.</strong></div><span className={styles.liveDot}>Live</span></div><Channels /><Graph />
        <div className={styles.campaignRows}>{['Brand awareness', 'Product discovery', 'Store visits'].map((label, i) => <div key={label} style={{ '--step': i }}><span className={styles.campaignIcon}><Icon name={i === 2 ? 'bag' : 'chart'} size={13} /></span><span>{label}</span><span className={styles.activityBar}><i /></span></div>)}</div>
      </div>
    </Chrome>
    <div className={styles.floatingNotice}><span className={styles.noticeIcon}><Icon name="check" size={14} /></span><div><strong>Campaign ready</strong><span>Your next step, connected.</span></div></div>
  </div>;
}

function Lessons() {
  return <Chrome title="Dmall learning workspace" className={styles.lessonWindow}>
    <div className={styles.lessonBody}><div className={styles.lessonPlayer}><span className={styles.playButton}><Icon name="play" size={18} /></span><span className={styles.playerTimeline}><i /></span></div><div className={styles.lessonInfo}><span className={styles.eyebrow}>LEARN BY DOING</span><strong>Your first Shopify store</strong><div className={styles.lessonSteps}>{['Watch', 'Practice', 'Launch'].map((step, i) => <span key={step} style={{ '--step': i }}><Icon name="check" size={10} />{step}</span>)}</div></div></div>
  </Chrome>;
}

function Storefront() {
  return <div className={styles.storeScene}>
    <Chrome title="Your Shopify storefront">
      <div className={styles.storeBody}><div className={styles.storeNav}><strong>YOUR BRAND</strong><span>Collections <Icon name="bag" size={13} /></span></div><div className={styles.collectionBanner}><span className={styles.eyebrow}>THE EVERYDAY COLLECTION</span><strong>Built to be discovered.</strong><span>Thoughtful products. A seamless store.</span></div><div className={styles.productGrid}>{['bottle', 'bag', 'shirt'].map((kind, i) => <div key={kind} style={{ '--step': i }}><Product kind={kind} /><span>{['Everyday essentials', 'Carry collection', 'New arrivals'][i]}</span><i /></div>)}</div><div className={styles.storeBottom}><span>Pakistan & international</span><span className={styles.cartButton}><Icon name="bag" size={12} />Add to cart <Icon name="check" size={12} /></span></div></div>
    </Chrome>
    <div className={styles.orderNotice}><span className={styles.noticeIcon}><Icon name="bag" size={16} /></span><div><strong>Ready for your first order.</strong><span>Designed around your business.</span></div><span className={styles.orderCheck}><Icon name="check" size={12} /></span></div>
  </div>;
}

function Performance() {
  return <Chrome title="Performance overview" className={styles.performanceWindow}><div className={styles.performanceBody}><div className={styles.performanceCopy}><span className={styles.eyebrow}>CONNECT. REACH. GROW.</span><strong>One strategy.<br />Every channel.</strong><Channels /></div><Graph compact /></div></Chrome>;
}

function LearningPath() {
  return <Chrome title="Your launch roadmap" className={styles.roadmapWindow}><div className={styles.roadmapBody}>{[{ label: 'Learn', note: 'Expert-led lessons', icon: 'book' }, { label: 'Build', note: 'Practical guidance', icon: 'bag' }, { label: 'Launch', note: 'Team support', icon: 'check' }].map((step, i) => <div className={styles.roadmapStep} key={step.label} style={{ '--step': i }}><span className={styles.stepIcon}><Icon name={step.icon} size={17} /></span><strong>{step.label}</strong><span>{step.note}</span><i className={styles.stepProgress} /></div>)}</div></Chrome>;
}
