const META_PIXEL_ID = '1630297061361106';
const META_PIXEL_SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

export function initializeMetaPixel() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (!window.fbq) {
    const fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
  }

  if (!document.querySelector(`script[src="${META_PIXEL_SCRIPT_SRC}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = META_PIXEL_SCRIPT_SRC;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  if (!window.__metaPixelInitialized) {
    window.fbq('init', META_PIXEL_ID);
    window.__metaPixelInitialized = true;
  }
  window.fbq('track', 'PageView');
}