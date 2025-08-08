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

function trackAnchorClicks() {
  if (typeof document === 'undefined') return;
  
  // Remove existing listeners to avoid duplicates
  const links = document.querySelectorAll('a[href*="#"]');
  links.forEach(link => {
    link.removeEventListener('click', handleAnchorClick);
    link.addEventListener('click', handleAnchorClick);
  });
}

function handleAnchorClick(event) {
  if (!window._paq || !isInitialized) return;
  
  const href = event.currentTarget.href;
  const currentPage = window.location.pathname;
  
  // Only track same-page anchor clicks (route changes handle cross-page navigation)
  if (href.includes('#') && href.split('#')[0].endsWith(currentPage)) {
    const anchor = href.substr(href.lastIndexOf('#'));
    
    // Track as virtual page view with enhanced title
    const enhancedTitle = `${document.title} - ${anchor.replace('#', '')}`;
    window._paq.push(['setCustomUrl', `${currentPage}${anchor}`]);
    window._paq.push(['setDocumentTitle', enhancedTitle]);
    window._paq.push(['trackPageView']);
  }
}

export function onRouteDidUpdate({location, previousLocation}) {
  if (!ExecutionEnvironment.canUseDOM) return;
  ensureMatomoInitialized();
  if (!window._paq || !isInitialized) return;

  // Track SPA navigations (handles cross-page navigation with anchors)
  if (previousLocation) {
    const referrer = `${previousLocation.pathname}${previousLocation.search || ''}${previousLocation.hash || ''}`;
    window._paq.push(['setReferrerUrl', referrer]);
  }
  
  // Track page with hash - enhanced title only if hash present
  const fullUrl = `${location.pathname}${location.search || ''}${location.hash || ''}`;
  const pageTitle = location.hash 
    ? `${document.title} - ${location.hash.replace('#', '')}` 
    : document.title;
    
  window._paq.push(['setCustomUrl', fullUrl]);
  window._paq.push(['setDocumentTitle', pageTitle]);
  window._paq.push(['trackPageView']);
  
  // Re-attach anchor click listeners after route change
  setTimeout(trackAnchorClicks, 100);
}

// Initialize anchor tracking on page load
if (ExecutionEnvironment.canUseDOM) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackAnchorClicks);
  } else {
    trackAnchorClicks();
  }
}