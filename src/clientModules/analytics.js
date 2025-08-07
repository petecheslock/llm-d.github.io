// Client module for global Matomo analytics
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

let isInitialized = false;

function resolveMatomoSiteId(hostname) {
  if (!hostname) return null;
  const host = hostname.toLowerCase();
  const isPreview = host === 'localhost' || host.includes('netlify.app') || host.includes('netlify.com');
  const isProd = host === 'llm-d.ai' || host.endsWith('.llm-d.ai');
  if (isPreview) return '6';
  if (isProd) return '7';
  return null; // unknown host -> do not track
}

function ensureMatomoInitialized() {
  if (isInitialized) return;
  const siteId = resolveMatomoSiteId(window.location.hostname);
  if (!siteId) {
    // Not a recognized host; keep analytics disabled
    return;
  }

  window._paq = window._paq || [];
  window._paq.push(['disableCookies']);
  window._paq.push(['alwaysUseSendBeacon', true]);
  window._paq.push(['enableLinkTracking']);

  const baseUrl = '//analytics.ossupstream.org/';
  window._paq.push(['setTrackerUrl', baseUrl + 'matomo.php']);
  window._paq.push(['setSiteId', siteId]);

  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = baseUrl + 'matomo.js';
  s.parentNode.insertBefore(g, s);

  isInitialized = true;
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (!ExecutionEnvironment.canUseDOM) return;
  ensureMatomoInitialized();
  if (!window._paq || !isInitialized) return;

  // Track SPA navigations
  if (previousLocation) {
    const referrer = `${previousLocation.pathname}${previousLocation.search || ''}${previousLocation.hash || ''}`;
    window._paq.push(['setReferrerUrl', referrer]);
  }
  window._paq.push(['setCustomUrl', window.location.href]);
  window._paq.push(['setDocumentTitle', document.title]);
  window._paq.push(['trackPageView']);
}