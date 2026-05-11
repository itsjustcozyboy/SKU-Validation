declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function trackLead() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead');
  }
}

export function trackSkuCtaClick(skuId: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'SKU_CTA_Click', { skuId });
  }
}
