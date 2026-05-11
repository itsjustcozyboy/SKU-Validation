import { Campaign, EventRecord, SKUCandidate, SKUProject } from '../domain/models';

export const mockProject: SKUProject = {
  id: 'proj_us_skin_001',
  name: 'US Gen Z Barrier Care Concept Test',
  targetCountry: 'US',
  category: 'Skincare',
  inputKeywords: ['민감성 피부', '장벽 케어', '산뜻한 사용감', 'Gen Z', 'TikTok Shop'],
  targetCustomer: 'US Gen Z women with sensitive-feeling skin',
  customerProblem: 'Heavy creams feel sticky and expensive options feel overhyped.',
  priceRange: '$19~29',
  costRange: '$3~7',
  channel: ['TikTok Shop', 'Amazon', 'Shopify'],
  brandTone: '클린뷰티',
  testGoal: ['제품 컨셉 검증', '가격 반응 검증', '메시지 반응 검증'],
  createdAt: '2026-05-11T00:00:00.000Z',
  updatedAt: '2026-05-11T00:00:00.000Z',
};

export const mockCandidates: SKUCandidate[] = [
  {
    id: 'sku-001', projectId: mockProject.id, name: 'Calm Barrier Gel Cream', category: 'Skincare', targetCountry: 'US',
    targetCustomer: mockProject.targetCustomer, concept: '민감 피부용 산뜻한 장벽 케어 젤크림', ingredientConcept: 'Cica + Panthenol + Ceramide concept', formulaType: '젤크림',
    price: 24, cost: 6, expectedMarginRate: 75, benefit: 'Light barrier care with fresh finish',
    positioningMessage: 'Heavy cream is not the only way to care for your skin barrier.', adHeadline: 'Fresh Barrier Care for Daily Comfort',
    adSubCopy: 'A lightweight daily care concept for sensitive-feeling skin.', landingHeroCopy: 'Barrier care without the heavy finish.', ctaText: 'Join the early launch list',
    priceTestQuestion: 'If this product is $24, would you consider trying it?', recommendedChannel: 'TikTok Shop', expectedRisk: 'Price resistance at $24 for first-time buyers',
    rationale: 'Strong concept-message fit for Gen Z comfort-first skincare behavior.', status: 'testing', createdAt: '2026-05-11T00:00:00.000Z', updatedAt: '2026-05-11T00:00:00.000Z'
  },
  {
    id: 'sku-002', projectId: mockProject.id, name: 'Daily Cica Water Ampoule', category: 'Skincare', targetCountry: 'US',
    targetCustomer: mockProject.targetCustomer, concept: '데일리 수분 진정 앰플', ingredientConcept: 'Cica water + Hyaluronic concept', formulaType: '앰플',
    price: 19, cost: 5, expectedMarginRate: 73.7, benefit: 'Simple hydration touch for stressed skin days',
    positioningMessage: 'A simple daily ampoule for skin that feels easily stressed.', adHeadline: 'Simple Daily Hydration Ampoule',
    adSubCopy: 'No heavy feel, just fresh daily care.', landingHeroCopy: 'Simple hydration for every day.', ctaText: 'Get notified when it launches',
    priceTestQuestion: 'If this product is $19, would you consider trying it?', recommendedChannel: 'Amazon', expectedRisk: 'Weak differentiation vs crowded ampoule market',
    rationale: 'Affordable entry-price may improve trial intent.', status: 'testing', createdAt: '2026-05-11T00:00:00.000Z', updatedAt: '2026-05-11T00:00:00.000Z'
  },
  {
    id: 'sku-003', projectId: mockProject.id, name: 'Fresh Barrier Sun Gel', category: 'Suncare', targetCountry: 'US',
    targetCustomer: mockProject.targetCustomer, concept: '산뜻한 장벽 케어 선젤', ingredientConcept: 'UV filter blend + soothing barrier-care concept', formulaType: '선크림',
    price: 22, cost: 6, expectedMarginRate: 72.7, benefit: 'Daily sun care with clean, comfortable finish',
    positioningMessage: 'Daily sun care with a fresh, comfortable finish.', adHeadline: 'Fresh Daily Sun Gel for City Life',
    adSubCopy: 'Comfort-focused daily UV care concept.', landingHeroCopy: 'Sun care that feels clean and light.', ctaText: 'Vote for this concept',
    priceTestQuestion: 'If this product is $22, would you consider trying it?', recommendedChannel: 'TikTok Shop', expectedRisk: 'Sun-care claim sensitivity requires careful copy review',
    rationale: 'High repeat-use category with strong fit for comfort-first messaging.', status: 'testing', createdAt: '2026-05-11T00:00:00.000Z', updatedAt: '2026-05-11T00:00:00.000Z'
  }
];

export const mockCampaigns: Campaign[] = mockCandidates.map((c, idx) => ({
  id: `camp-00${idx + 1}`,
  skuCandidateId: c.id,
  projectId: c.projectId,
  title: `${c.name} Campaign`,
  landingPageUrl: `/campaign/${c.id}`,
  status: 'active',
  metaPixelEnabled: false,
  manualAdSpend: idx === 2 ? 280 : undefined,
  manualImpressions: idx === 2 ? 16000 : undefined,
  manualAdClicks: idx === 2 ? 620 : undefined,
  manualCtr: idx === 2 ? 3.87 : undefined,
  manualCpc: idx === 2 ? 0.45 : undefined,
  manualCpm: idx === 2 ? 17.5 : undefined,
  adCreativeName: idx === 2 ? 'creative_a' : undefined,
  adTargetSegment: idx === 2 ? 'genz_sensitive_skin' : undefined,
  startDate: '2026-05-01',
  endDate: '2026-05-10',
  createdAt: '2026-05-11T00:00:00.000Z',
}));

export const mockEvents: EventRecord[] = [];
