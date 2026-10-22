import dmall from './dmall-content.json';
import { footerGroups } from './content/footer';
import styles from './footer.module.css';

function FooterLink({ href, children }) {
  const external = href.startsWith('https://');
  return <a className={styles.link} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    <span>{children}</span><span aria-hidden="true">{children}</span>
  </a>;
}

export default function Footer() {
  return <footer id="contact" className={styles.footer}>
    <div className={styles.navigation}>
      <nav className={styles.groups} aria-label="Footer navigation">
        {footerGroups.map(group => <div className={styles.group} key={group.id}>{group.links.map((link, index) => <FooterLink key={`${link.href}-${index}`} href={link.href}>{link.label}</FooterLink>)}</div>)}
      </nav>
      <div className={styles.profile}>
        <p>Contact Dmall</p>
        <div className={styles.phone}><img src="https://res.cloudinary.com/dj4rfocct/image/upload/v1792675566/wazemtech/dmall/dmall-logo-127cab5356.png" alt="D-Mall OFFICIAL" width="32" height="32" loading="lazy" /><p>{dmall.contact.phone}</p></div>
        <p>{dmall.contact.email}</p>
      </div>
    </div>
    <address className={styles.contact}>
      <a href="tel:+923268669646">{dmall.contact.phone}</a>
      <a href={`mailto:${dmall.contact.email}`}>{dmall.contact.email}</a>
      <span>Islamabad: G-13/4</span>
      <span>Kohat: Pindi Road, College Town, Bin-Asif Plaza, Office #7</span>
    </address>
    <svg className={styles.wordmark} viewBox="0 0 1200 370" role="img" aria-label="D-Mall">
      <foreignObject width="100%" height="100%"><h2>D-Mall</h2></foreignObject>
    </svg>
  </footer>;
}
