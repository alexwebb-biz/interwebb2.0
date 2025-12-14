import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID;

export function Analytics() {
  const location = useLocation();

  // load GA once
  useEffect(() => {
    if (!GA_ID || window.gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: any[]) => window.dataLayer.push(args);
    window.gtag('js', new Date());
  }, []);

  // send page_view on route changes (hash router uses pathname/search)
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    const page_path = location.pathname + location.search;
    window.gtag('config', GA_ID, { page_path });
  }, [location]);

  // capture ref/UTM on first landing and persist it
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref') || params.get('utm_source');
    if (ref) {
      localStorage.setItem('ref_source', ref);
      if (window.gtag) {
        window.gtag('event', 'ref_capture', { ref_source: ref });
      }
    }
  }, [location.search]);

  return null;
}
