import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoMeta = {
  title: string;
  description: string;
};

const DEFAULT: SeoMeta = {
  title: 'Interwebb UK | Web Design & Development Studio',
  description:
    'Interwebb UK is a digital product studio building fast, modern websites and web applications for growing brands. Strategy, design, development, and SEO.',
};

const ROUTES: Record<string, SeoMeta> = {
  '/': DEFAULT,
  '/services': {
    title: 'Services | Interwebb UK',
    description:
      'Web design, development, SEO, and digital strategy services. High-performance builds for modern brands.',
  },
  '/work': {
    title: 'Work | Interwebb UK',
    description:
      'Selected projects and case studies. Websites and web apps built for speed, clarity, and growth.',
  },
  '/pricing': {
    title: 'Pricing | Interwebb UK',
    description:
      'Transparent packages and pricing for websites and digital product builds. Get a quote and start your project.',
  },
  '/web-design-for-trades': {
    title: 'Web Design for Trades | Interwebb UK',
    description:
      'Web design for trades businesses that want more calls and quote requests. Websites for plumbers, electricians, builders, roofers, landscapers, and local service businesses.',
  },
  '/about': {
    title: 'About | Interwebb UK',
    description:
      'Meet Interwebb UK. A digital product studio focused on design quality, clean code, and measurable performance.',
  },
  '/contact': {
    title: 'Contact | Interwebb UK',
    description:
      'Start a project with Interwebb UK. Tell us what you need and we’ll get back quickly with next steps.',
  },
  '/privacy': {
    title: 'Privacy | Interwebb UK',
    description: 'How Interwebb UK uses analytics and handles personal data.',
  },
  '/terms': {
    title: 'Terms | Interwebb UK',
    description: 'Website terms of use for Interwebb UK.',
  },
  '/cookies': {
    title: 'Cookies | Interwebb UK',
    description: 'Cookie and tracking information for Interwebb UK.',
  },
};

function upsertMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = ROUTES[location.pathname] ?? DEFAULT;
    const origin =
      (import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin;

    const canonical = `${origin}${location.pathname}`.replace(/\/+$/, '/') || `${origin}/`;
    const shareImage = `${origin}/og-image.svg`;

    document.title = meta.title;
    upsertMeta('description', meta.description);

    upsertCanonical(canonical);

    upsertProperty('og:title', meta.title);
    upsertProperty('og:description', meta.description);
    upsertProperty('og:url', canonical);
    upsertProperty('og:image', shareImage);

    upsertMeta('twitter:title', meta.title);
    upsertMeta('twitter:description', meta.description);
    upsertMeta('twitter:image', shareImage);

    const structuredDataEl = document.getElementById('interwebb-schema');
    if (structuredDataEl) {
      const sameAs = [
        import.meta.env.VITE_SOCIAL_X_URL,
        import.meta.env.VITE_SOCIAL_INSTAGRAM_URL,
        import.meta.env.VITE_SOCIAL_LINKEDIN_URL,
        import.meta.env.VITE_SOCIAL_FACEBOOK_URL,
        import.meta.env.VITE_SOCIAL_YOUTUBE_URL,
      ].filter(Boolean);

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            name: 'Interwebb UK',
            url: `${origin}/`,
            logo: `${origin}/favicon.svg`,
            email: 'hello@interwebb.uk',
            sameAs,
          },
          {
            '@type': 'LocalBusiness',
            name: 'Interwebb UK',
            url: `${origin}/`,
            image: shareImage,
            areaServed: 'Wales, UK',
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'Wales',
              addressCountry: 'GB',
            },
            sameAs,
          },
        ],
      };

      structuredDataEl.textContent = JSON.stringify(jsonLd);
    }
  }, [location.pathname]);

  return null;
}
