import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GA_ID = import.meta.env.VITE_GA_ID;

export function Analytics() {
  const location = useLocation();
  const initialized = useRef(false);

  // Initialize GA once
  useEffect(() => {
    if (!GA_ID || initialized.current) return;
    ReactGA.initialize(GA_ID, { gaOptions: { anonymizeIp: true } });
    initialized.current = true;
  }, []);

  // Send page_view on route changes
  useEffect(() => {
    if (!GA_ID || !initialized.current) return;
    const page = location.pathname + location.search;
    ReactGA.send({ hitType: 'pageview', page });
  }, [location]);

  // Capture ref/UTM on landing
  useEffect(() => {
    if (!GA_ID || !initialized.current) return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('utm_source');
    if (ref && !localStorage.getItem('ref_source')) {
      localStorage.setItem('ref_source', ref);
      ReactGA.event('ref_capture', { ref_source: ref });
    }
  }, []);

  return null;
}
