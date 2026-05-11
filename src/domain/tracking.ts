export interface UTMContext {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export function parseUTM(url: string): UTMContext {
  const u = new URL(url, 'https://example.com');
  return {
    utmSource: u.searchParams.get('utm_source') || undefined,
    utmMedium: u.searchParams.get('utm_medium') || undefined,
    utmCampaign: u.searchParams.get('utm_campaign') || undefined,
    utmContent: u.searchParams.get('utm_content') || undefined,
    utmTerm: u.searchParams.get('utm_term') || undefined,
  };
}

export function getOrCreateSessionId(storage: Pick<Storage, 'getItem' | 'setItem'>): string {
  const key = 'sku_validation_session_id';
  const existing = storage.getItem(key);
  if (existing) return existing;
  const id = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  storage.setItem(key, id);
  return id;
}
