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

  // init once + send initial page_view
  useEffect(() => {
    if (!GA_ID) return;

    // Create stub immediately so calls queue in dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: any[]) => {
        window.dataLayer.push(args);
      });

    window.gtag("js", new Date());

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

    // IMPORTANT: send something on first load
    window.gtag("config", GA_ID, {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
    });
  }, []);

  // send page_view on BrowserRouter route changes
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;

    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search]);

  // capture ref/UTM from real query string (BrowserRouter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || params.get("utm_source");
    if (ref && !localStorage.getItem("ref_source")) {
      localStorage.setItem("ref_source", ref);
      window.gtag?.("event", "ref_capture", { ref_source: ref });
    }
  }, []);

  return null;
}
