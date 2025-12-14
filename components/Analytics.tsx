import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID;

export function Analytics() {
  const location = useLocation();

  // Init GA once
  useEffect(() => {
    if (!GA_ID) return;

    // Create gtag stub immediately so calls queue into dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: any[]) => {
        window.dataLayer.push(args);
      });

    window.gtag("js", new Date());

    // Disable auto page_view for SPA; we will send it manually
    window.gtag("config", GA_ID, { send_page_view: false });

    // Load gtag.js once
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`
    );
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }

    // Send initial page_view
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }, []);

  // Send page_view on route changes (BrowserRouter uses pathname/search)
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  // Capture ref/UTM on first landing and persist it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || params.get("utm_source");

    // Store only once (first-touch), but still allow event fire if desired
    if (ref && !localStorage.getItem("ref_source")) {
      localStorage.setItem("ref_source", ref);
      if (window.gtag) {
        window.gtag("event", "ref_capture", { ref_source: ref });
      }
    }
  }, []);

  return null;
}
