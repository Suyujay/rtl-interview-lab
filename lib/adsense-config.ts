// Ads are disabled by default in this fork: no publisher ID is hard-coded.
// Set VITE_ADSENSE_CLIENT_ID / VITE_ADSENSE_FOOTER_SLOT_ID (and the host below)
// only if you actually own an AdSense account for the deployed origin.
const defaultClientId = '';
const clientId = (import.meta.env.VITE_ADSENSE_CLIENT_ID || defaultClientId).trim();
const footerSlotId = (import.meta.env.VITE_ADSENSE_FOOTER_SLOT_ID ?? '').trim();

const validClientId = /^ca-pub-\d+$/.test(clientId);
const validSlotId = /^\d+$/.test(footerSlotId);

export const adsenseConfig = {
  enabled: import.meta.env.PROD && validClientId && validSlotId,
  clientId,
  footerSlotId,
  allowedHosts: new Set(['suyujay.github.io']),
} as const;
