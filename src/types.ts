export interface SkuInput {
  brandName: string;
  productName: string;
  category: string;
  targetConsumer: string;
  ingredients: string;
  description: string;
  expectedRetailPrice: number;
  productSize: string;
  productImageUrl?: string;
  plannedProductionQuantity?: number;
  messageA: string;
  messageB: string;
  messageC: string;
  ctaType: string;
}

export interface TestMetrics {
  pageViews: number;
  ctaClicks: number;
  waitlistSignups: number;
  messageALikes: number;
  messageBLikes: number;
  messageCLikes: number;
}

export interface DemandResult {
  demandScore: number;
  demandLevel: string;
  winningMessage: string;
  ctaClickRate: number;
  signupConversionRate: number;
  priceInsight: string;
  recommendation: string;
  nextActions: string[];
  productionRiskLevel?: string;
  launchDecision?: string;
  suggestedSkuAdjustment?: string[];
  sustainabilityInsight?: string;
  recommendedPriceDirection?: string;
}

export type AppStep = 'hypothesis' | 'form' | 'preview' | 'dashboard' | 'report';

export interface SkuHypothesis {
  id: string;
  name: string;
  conceptType: 'Ingredient-led' | 'Problem-led' | 'Occasion-led';
  targetConsumer: string;
  heroIngredients: string;
  productConcept: string;
  positioningMessage: string;
  recommendedPrice: number;
  recommendedSize: string;
  testHypothesis: string;
  productionCaution: string;
}
