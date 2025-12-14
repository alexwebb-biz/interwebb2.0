import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;

export function Analytics() {
  const location = useLocation();
  const initialized = useRef(false);

  // Initialize GA once
  useEffect(() => {
    if (!GA_ID || initialized.current) return;

    ReactGA.initialize(GA_ID, {
      gaOptions: { anonymizeIp: true },
    });

    initialized.current = true;
  }, []);

  // Send page_view on route changes (BrowserRouter)
  useEffect(() => {
    if (!GA_ID || !initialized.current) return;

    const page = location.pathname + location.search;

    ReactGA.send({
      hitType: "pageview",
      page,
    });
  }, [location.pathname, location.search]);

  // Optional: Persist standard UTM params from the first landing (first-touch)
  useEffect(() => {
    if (!GA_ID || !initialized.current) return;

    const params = new URLSearchParams(window.location.search);

    const utm_source = params.get("utm_source");
    const utm_medium = params.get("utm_medium");
    const utm_campaign = params.get("utm_campaign");
    const utm_term = params.get("utm_term");
    const utm_content = params.get("utm_content");
    const gclid = params.get("gclid");

    const hasAny =
      utm_source || utm_medium || utm_campaign || utm_term || utm_content || gclid;

    if (!hasAny) return;

    // Store only once (first-touch)
    if (!localStorage.getItem("utm_first_touch")) {
      localStorage.setItem(
        "utm_first_touch",
        JSON.stringify({
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          gclid,
          ts: Date.now(),
          landing: window.location.href,
        })
      );
    }

    // Optional debug/event so you can validate captures in GA
    ReactGA.event("utm_capture", {
      utm_source: utm_source ?? "(not set)",
      utm_medium: utm_medium ?? "(not set)",
      utm_campaign: utm_campaign ?? "(not set)",
      utm_term: utm_term ?? "(not set)",
      utm_content: utm_content ?? "(not set)",
      gclid: gclid ?? "",
    });
  }, []);

  return null;
}
