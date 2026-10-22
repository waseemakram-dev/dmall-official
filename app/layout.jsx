import './reference.css';
import './globals.css';
import 'lenis/dist/lenis.css';
import SmoothScroll from './smooth-scroll';
import AssetLoader from './asset-loader';

export const metadata = {
  title: 'D-Mall OFFICIAL — Shopify, Digital Marketing & Training',
  description: 'Shopify store development, digital marketing and practical e-commerce training with D-Mall OFFICIAL. Islamabad and Kohat, Pakistan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AssetLoader><SmoothScroll>{children}</SmoothScroll></AssetLoader>
      </body>
    </html>
  );
}
