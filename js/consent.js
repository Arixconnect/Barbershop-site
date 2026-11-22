(() => {
  "use strict";

  const STORAGE_KEY = "masterbarbershop_cookie_consent";
  const CONSENT_VERSION = 1;
  const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const GTM_ID = "GTM-5H84FHRH";
  const METRICOOL_HASH = "2088ac3d0b27d3644288de766611cf34";
  let gtmLoaded = false;
  let metricoolLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", false);

  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== CONSENT_VERSION || saved.expiresAt <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return saved;
    } catch (_) {
      return null;
    }
  };

  const loadGTM = () => {
    if (gtmLoaded || document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) return;
    gtmLoaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.dataset.gtmId = GTM_ID;
    document.head.appendChild(script);
  };

  const loadMetricool = () => {
    if (metricoolLoaded || document.querySelector("script[data-metricool]")) return;
    metricoolLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://tracker.metricool.com/resources/be.js";
    script.dataset.metricool = "";
    script.onload = () => {
      if (window.beTracker && typeof window.beTracker.t === "function") {
        window.beTracker.t({ hash: METRICOOL_HASH });
      }
    };
    script.onerror = () => { metricoolLoaded = false; script.remove(); };
    document.head.appendChild(script);
  };

  const updateMarketingEmbeds = enabled => {
    document.querySelectorAll("iframe[data-consent-src]").forEach(frame => {
      const placeholder = frame.nextElementSibling;
      if (enabled && !frame.src) frame.src = frame.dataset.consentSrc;
      if (!enabled && frame.src) frame.removeAttribute("src");
      frame.hidden = !enabled;
      if (placeholder?.classList.contains("map-consent-placeholder")) placeholder.hidden = enabled;
    });
  };

  const applyConsent = choice => {
    const analytics = Boolean(choice.analytics);
    const marketing = Boolean(choice.marketing);
    window.gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied"
    });
    window.dataLayer.push({
      event: "masterbarbershop_consent_update",
      analytics_consent: analytics,
      marketing_consent: marketing
    });
    if (analytics || marketing) loadGTM();
    if (analytics) loadMetricool();
    else if (metricoolLoaded) {
      // Remove an already loaded tracker when analytics consent is withdrawn.
      window.location.reload();
      return;
    }
    if (document.readyState !== "loading") updateMarketingEmbeds(marketing);
  };

  const existingChoice = readConsent();
  if (existingChoice) applyConsent(existingChoice);

  document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById("cookie-consent");
    const preferences = document.getElementById("cookie-preferences");
    const analyticsInput = document.getElementById("consent-analytics");
    const marketingInput = document.getElementById("consent-marketing");
    const acceptButton = document.getElementById("cookie-accept");
    const rejectButton = document.getElementById("cookie-reject");
    const customizeButton = document.getElementById("cookie-customize");
    const saveButton = document.getElementById("cookie-save");
    if (!dialog) return;

    updateMarketingEmbeds(Boolean(existingChoice?.marketing));

    const openDialog = (showPreferences = false) => {
      const saved = readConsent();
      analyticsInput.checked = Boolean(saved?.analytics);
      marketingInput.checked = Boolean(saved?.marketing);
      dialog.hidden = false;
      document.body.classList.add("cookie-dialog-open");
      preferences.hidden = !showPreferences;
      saveButton.hidden = !showPreferences;
      customizeButton.setAttribute("aria-expanded", String(showPreferences));
      window.setTimeout(() => (showPreferences ? analyticsInput : acceptButton).focus(), 0);
    };

    const closeDialog = () => {
      dialog.hidden = true;
      document.body.classList.remove("cookie-dialog-open");
    };

    const saveChoice = (analytics, marketing) => {
      const choice = {
        version: CONSENT_VERSION,
        analytics,
        marketing,
        savedAt: Date.now(),
        expiresAt: Date.now() + CONSENT_LIFETIME
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choice)); } catch (_) {}
      applyConsent(choice);
      closeDialog();
      window.dispatchEvent(new CustomEvent("masterbarbershop:consent-decided", { detail: choice }));
    };

    acceptButton.addEventListener("click", () => saveChoice(true, true));
    rejectButton.addEventListener("click", () => saveChoice(false, false));
    saveButton.addEventListener("click", () => saveChoice(analyticsInput.checked, marketingInput.checked));
    customizeButton.addEventListener("click", () => {
      const show = preferences.hidden;
      preferences.hidden = !show;
      saveButton.hidden = !show;
      customizeButton.setAttribute("aria-expanded", String(show));
      if (show) analyticsInput.focus();
    });
    document.querySelectorAll(".cookie-settings-trigger").forEach(button => {
      button.addEventListener("click", () => openDialog(true));
    });

    if (!existingChoice) openDialog(false);
    else window.dispatchEvent(new CustomEvent("masterbarbershop:consent-decided", { detail: existingChoice }));
  });
})();
