// Client module for global Matomo analytics - runs on every page
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

let isInitialized = false;

function initializeAnalytics() {
  // Only run analytics on development or Netlify preview deployments
  const isLocalDevelopment = window.location.hostname === 'localhost';
  const isNetlifyPreview = window.location.hostname.includes('netlify.app') || 
                          window.location.hostname.includes('netlify.com');
  
  if (!isLocalDevelopment && !isNetlifyPreview) {
    console.log('Matomo: Analytics disabled - not running on localhost or Netlify preview');
    return;
  }

  console.log('Matomo: Initializing analytics with site ID 6 on', window.location.hostname);

  // Initialize Matomo (only once)
  if (!isInitialized) {
    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    
    (function() {
      const u = "//analytics.ossupstream.org/";
      window._paq.push(['setTrackerUrl', u + 'matomo.php']);
      window._paq.push(['setSiteId', '6']);
      const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = u + 'matomo.js';
      s.parentNode.insertBefore(g, s);
    })();
    
    isInitialized = true;

    // Listen for route changes to track page views
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(() => {
        if (window._paq) {
          window._paq.push(['setCustomUrl', window.location.href]);
          window._paq.push(['setDocumentTitle', document.title]);
          window._paq.push(['trackPageView']);
        }
      }, 100);
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      setTimeout(() => {
        if (window._paq) {
          window._paq.push(['setCustomUrl', window.location.href]);
          window._paq.push(['setDocumentTitle', document.title]);
          window._paq.push(['trackPageView']);
        }
      }, 100);
    };

    window.addEventListener('popstate', () => {
      setTimeout(() => {
        if (window._paq) {
          window._paq.push(['setCustomUrl', window.location.href]);
          window._paq.push(['setDocumentTitle', document.title]);
          window._paq.push(['trackPageView']);
        }
      }, 100);
    });
  }
}

// Initialize analytics when DOM is ready
if (ExecutionEnvironment.canUseDOM) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
  } else {
    initializeAnalytics();
  }
}