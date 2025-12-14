import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoMeta = {
  title: string;
  description: string;
};

const DEFAULT: SeoMeta = {
  title: 'Interwebb UK | Web Design, Development & Digital Product Studio',
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
  }, [location.pathname]);

  return null;
}

