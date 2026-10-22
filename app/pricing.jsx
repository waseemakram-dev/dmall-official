import { mediaUrl } from './media';
import dmall from './dmall-content.json';
import SectionLabel from './section-label';
import AnimatedLink from './animated-link';

const groups = [
  { name: 'Shopify stores', icon: 'bag', description: 'Professional Shopify stores, ready to sell in Pakistan and worldwide.', packages: [0, 1] },
  { name: 'TikTok setup', icon: 'tiktok', description: 'TikTok ad accounts and business tools, ready for your campaigns.', packages: [2, 3] },
  { name: 'Complete business', icon: 'growth', description: 'End-to-end solutions to launch and grow your eCommerce business.', packages: [4, 5] },
];
const offers = [
  { name: 'Shopify Pakistan', icon: 'shopify', highlights: ['Premium theme', '40+ product listings', 'Free domain'] },
  { name: 'Shopify International', icon: 'international', highlights: ['20+ product listings', 'Payment setup', 'Shipping setup'] },
  { name: 'TikTok Ads Manager', icon: 'tiktok', highlights: ['Verified account', 'Fast activation'] },
  { name: 'TikTok Business Centre', icon: 'people', highlights: ['3 ads managers', 'Self top-up'] },
  { name: 'Complete Business Plan', icon: 'document', highlights: ['Store + TikTok setup', 'First ad campaign', 'Product research'] },
  { name: 'UAE Shopify Setup', icon: 'location', highlights: ['Store + supplier setup', 'Meta + TikTok setup', '20+ products'] },
];

function Icon({ type, size = 30 }) {
  if (['bag', 'shopify', 'international', 'tiktok'].includes(type)) {
    const brand = type === 'tiktok' ? 'tiktok' : 'shopify';
    return <span className="editorial-brand-icon" style={{ width: size, height: size }}>
      <img src={mediaUrl(`${brand}-brand.svg`)} width={size} height={size} alt="" aria-hidden="true" />
      {type === 'international' && <svg className="editorial-global-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c-4 3-4 9 0 12m0-12c4 3 4 9 0 12" /></svg>}
    </span>;
  }
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'growth' ? <><rect x="4" y="19" width="5" height="10" rx="1" /><rect x="13" y="12" width="5" height="17" rx="1" /><rect x="22" y="5" width="5" height="24" rx="1" /><path d="M4 12 13 6l5 1 8-5" /></>
      : type === 'people' ? <><circle cx="16" cy="9" r="3.5" /><path d="M9 27v-3a7 7 0 0 1 14 0v3M6 5a4 4 0 0 0 0 8m20-8a4 4 0 0 1 0 8M2 23v-2a5 5 0 0 1 5-5m23 7v-2a5 5 0 0 0-5-5" /></>
        : type === 'document' ? <><path d="M9 3h14l5 5v20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M22 3v6h6M12 14h10m-10 5h10m-10 5h6M4 7v19" /></>
          : <><path d="M25 13c0 7-9 16-9 16S7 20 7 13a9 9 0 1 1 18 0Z" /><circle cx="16" cy="13" r="3.5" /><path d="M10 30h12" /></>}
  </svg>;
}

function Package({ index }) {
  const offer = offers[index], service = dmall.services[index];
  const price = service.desc.match(/[\d,]+/)?.[0];
  const enquiry = `${dmall.contact.whatsapp}?text=${encodeURIComponent('Hello D Mall! I want to discuss ' + service.title.replace(/^[^A-Za-z]+/, ''))}`;
  return <article className="dmall-package editorial-offer">
    <span className="editorial-offer-icon"><Icon type={offer.icon} /></span>
    <div className="editorial-offer-body">
      <div className="editorial-offer-title"><h4>{offer.name}</h4><strong>Rs. {price}</strong></div>
      <ul className="editorial-highlights">{offer.highlights.map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
      <details className="editorial-inclusions"><summary>All inclusions <span aria-hidden="true">+</span></summary><ul>{service.features.split(',').map(feature => <li key={feature}>{feature.trim()}</li>)}</ul></details>
      <AnimatedLink className="editorial-discuss" href={enquiry} target="_blank" rel="noopener noreferrer" arrow="→">Discuss package</AnimatedLink>
    </div>
  </article>;
}

export default function Pricing() {
  return <section id="pricing" className="editorial-services" aria-labelledby="editorial-services-title">
    <div className="editorial-services-inner">
      <header className="editorial-services-header">
        <div className="editorial-heading-block"><SectionLabel>Our services</SectionLabel><h2 id="editorial-services-title"><span>Your next chapter</span><span>starts here.</span></h2></div>
        <p className="editorial-services-intro">From store setup to ad accounts, we provide everything you need to start and scale your eCommerce business. Choose the package that fits your goals and get started with D-Mall OFFICIAL.</p>
      </header>
      <div className="editorial-service-panels">
        {groups.map((group, index) => <div key={group.name} className="editorial-service-panel">
          <div className="editorial-group-top"><span>0{index + 1}</span><Icon type={group.icon} size={36} /></div>
          <h3>{group.name}</h3><p className="editorial-group-description">{group.description}</p>
          <div className="editorial-offers">{group.packages.map(index => <Package key={index} index={index} />)}</div>
        </div>)}
      </div>
      <p className="editorial-services-note">All prices in PKR. Every plan includes free consultation, professional support and step-by-step guidance.</p>
    </div>
  </section>;
}
