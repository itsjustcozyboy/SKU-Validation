export type TargetCountry = 'US' | 'JP' | 'SEA' | 'EU';
export type Category = 'Skincare' | 'Suncare' | 'Cleansing' | 'Makeup' | 'Haircare' | 'Bodycare';

export interface SKUProject {
  id: string;
  name: string;
  targetCountry: TargetCountry;
  category: Category;
  inputKeywords: string[];
  targetCustomer: string;
  customerProblem: string;
  priceRange: string;
  costRange: string;
  channel: string[];
  brandTone: string;
  testGoal: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SKUCandidate {
  id: string;
  projectId: string;
  name: string;
  category: Category;
  targetCountry: TargetCountry;
  targetCustomer: string;
  concept: string;
  ingredientConcept: string;
  formulaType: string;
  price: number;
  cost: number;
  expectedMarginRate: number;
  benefit: string;
  positioningMessage: string;
  adHeadline: string;
  adSubCopy: string;
  landingHeroCopy: string;
  ctaText: string;
  priceTestQuestion: string;
  recommendedChannel: string;
  expectedRisk: string;
  rationale: string;
  status: 'draft' | 'ready' | 'testing' | 'validated';
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  skuCandidateId: string;
  projectId: string;
  title: string;
  landingPageUrl: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  metaPixelEnabled: boolean;
  manualAdSpend?: number;
  manualImpressions?: number;
  manualAdClicks?: number;
  manualCtr?: number;
  manualCpc?: number;
  manualCpm?: number;
  adCreativeName?: string;
  adTargetSegment?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  skuCandidateId: string;
  projectId: string;
  campaignId: string;
  sessionId: string;
  eventType:
    | 'page_view'
    | 'hero_cta_click'
    | 'price_response'
    | 'survey_submit'
    | 'email_submit'
    | 'scroll_depth'
    | 'time_on_page'
    | 'page_leave';
  eventValue?: string | number | Record<string, unknown>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  userAgent?: string;
  referrer?: string;
  timestamp: string;
}
