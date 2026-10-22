import { mediaUrl } from './media';
import SectionLabel from './section-label';
import AnimatedLink from './animated-link';

function ResultPhone({ number, secondary = false }) {
  return <a className={`dmall-case-phone${secondary ? ' is-secondary' : ''}`}
    href={mediaUrl(`dmall-result-${number}.webp`)} target="_blank" rel="noopener noreferrer"
    aria-label="Open original Dmall community screenshot">
    <img src={mediaUrl(`dmall-result-${number}.webp`)} width={number === 5 ? 572 : 590} height="1280"
      alt="Original student result or feedback shared by Dmall" loading="lazy" />
  </a>;
}

function ResultShowcase({ primary, secondary, label }) {
  return <div className="dmall-case-showcase">
    <span className="dmall-case-wordmark" aria-hidden="true">D MALL <span>COMMUNITY</span></span>
    <div className="dmall-case-devices"><ResultPhone number={secondary} secondary /><ResultPhone number={primary} /></div>
    <span className="dmall-case-evidence"><span aria-hidden="true">↗</span>{label}</span>
  </div>;
}

export default function CaseStudies() {
  return <section id="case-studies" className="dmall-case-studies" aria-label="Dmall student progress and training">
    <article className="dmall-case-study">
      <div className="dmall-case-copy">
        <div className="dmall-case-heading"><SectionLabel>Dmall recognition</SectionLabel>
          <h2><span>Real progress.</span><span>Shared by students.</span></h2></div>
        <p>Explore the original results and feedback shared by the Dmall community, alongside recognition from more than 15 successful batches.</p>
        <div className="dmall-case-stats"><div><strong>15+</strong><span>Successful batches</span></div><div><strong>1:1</strong><span>Personal guidance</span></div></div>
        <AnimatedLink className="dmall-case-link" href="https://www.dmallofficial.com/success" target="_blank" rel="noopener noreferrer">Explore success stories</AnimatedLink>
      </div>
      <ResultShowcase primary={1} secondary={5} label="Original community screenshots" />
    </article>
    <article className="dmall-case-study is-reversed">
      <div className="dmall-case-copy">
        <div className="dmall-case-heading"><SectionLabel>Learning with Dmall</SectionLabel>
          <h2><span>From learning</span><span>to launching.</span></h2></div>
        <p>Practical Shopify training with live and recorded lessons, a dedicated private group and first live sale support from the D Mall team.</p>
        <div className="dmall-case-stats"><div><strong>45</strong><span>Days of training</span></div><div><strong>14</strong><span>Detailed lectures</span></div></div>
        <AnimatedLink className="dmall-case-link" href="#curriculum">Explore the training</AnimatedLink>
      </div>
      <ResultShowcase primary={2} secondary={3} label="Student feedback & first sales" />
    </article>
  </section>;
}
