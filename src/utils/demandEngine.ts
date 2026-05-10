import { DemandResult, SkuInput, TestMetrics } from '../types';

const popularIngredients = [
  'centella',
  'niacinamide',
  'pdrn',
  'collagen',
  'rice',
  'snail',
  'retinol',
  'peptide',
];

const confusingTerms = ['cure', 'treatment', 'medical', 'healing', 'drug'];

const categoryBonusSet = new Set(['Toner Pad', 'Serum', 'Cream', 'Hair/Scalp Care']);

const positiveMessageKeywordMap: Record<string, string[]> = {
  'Gen Z': ['glass skin', 'glow', 'radiance'],
  'K-beauty enthusiasts': ['glass skin', 'glow', 'radiance'],
  'Sensitive skin users': ['barrier', 'sensitive', 'calming'],
  'Anti-aging users': ['pdrn', 'retinol', 'peptide', 'collagen'],
  'Acne-prone skin users': ['acne', 'blemish', 'pore'],
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const includesOneOf = (value: string, terms: string[]): boolean => {
  const lowercaseValue = value.toLowerCase();
  return terms.some((term) => lowercaseValue.includes(term));
};

const countIngredientBoost = (ingredients: string): number => {
  const lower = ingredients.toLowerCase();
  const uniqueHits = new Set<string>();

  popularIngredients.forEach((keyword) => {
    if (lower.includes(keyword)) {
      uniqueHits.add(keyword);
    }
  });

  return clamp(uniqueHits.size, 0, 5);
};

const getPriceInsight = (price: number): string => {
  if (price < 20) {
    return 'Price is attractive for first-time U.S. trial purchases.';
  }
  if (price <= 35) {
    return 'Price is in a reasonable mid-range for K-beauty testing.';
  }
  if (price > 40) {
    return 'Price may be high for cold traffic; consider a smaller trial size.';
  }
  return 'Price is slightly premium; value messaging should be very clear.';
};

const getPriceScore = (price: number): number => {
  if (price < 20) {
    return 15;
  }
  if (price <= 35) {
    return 12;
  }
  if (price <= 40) {
    return 8;
  }
  return 4;
};

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

const getWinningMessage = (skuInput: SkuInput, metrics: TestMetrics): { text: string; likes: number; spread: number } => {
  const pairs = [
    { key: 'A', text: skuInput.messageA, likes: metrics.messageALikes },
    { key: 'B', text: skuInput.messageB, likes: metrics.messageBLikes },
    { key: 'C', text: skuInput.messageC, likes: metrics.messageCLikes },
  ];

  const sorted = [...pairs].sort((a, b) => b.likes - a.likes);
  const top = sorted[0];
  const second = sorted[1] ?? sorted[0];
  return {
    text: top.text || `Message ${top.key}`,
    likes: top.likes,
    spread: top.likes - second.likes,
  };
};

const getMessageClarityScore = (metrics: TestMetrics): number => {
  const likesTotal = metrics.messageALikes + metrics.messageBLikes + metrics.messageCLikes;
  if (likesTotal === 0) {
    return 3;
  }

  const maxLikes = Math.max(metrics.messageALikes, metrics.messageBLikes, metrics.messageCLikes);
  const dominanceRatio = maxLikes / likesTotal;

  return roundTo1(clamp(dominanceRatio * 15, 0, 15));
};

const scoreMessageForConsumer = (message: string, targetConsumer: string): number => {
  const normalized = message.toLowerCase();
  const targetKeywords = positiveMessageKeywordMap[targetConsumer] ?? [];
  const broadAppealKeywords = ['glow', 'barrier', 'hydration', 'calming', 'radiance', 'smooth'];

  let score = 1;
  targetKeywords.forEach((word) => {
    if (normalized.includes(word)) {
      score += 2;
    }
  });

  broadAppealKeywords.forEach((word) => {
    if (normalized.includes(word)) {
      score += 0.8;
    }
  });

  return score;
};

const distributeLikes = (pool: number, weights: number[]): [number, number, number] => {
  const totalWeight = weights.reduce((sum, current) => sum + current, 0);
  if (pool <= 0 || totalWeight <= 0) {
    return [0, 0, 0];
  }

  const values = weights.map((w) => Math.floor((pool * w) / totalWeight));
  let assigned = values.reduce((sum, current) => sum + current, 0);

  while (assigned < pool) {
    const idx = Math.floor(Math.random() * values.length);
    values[idx] += 1;
    assigned += 1;
  }

  return [values[0], values[1], values[2]];
};

export const getSimulatedClickRate = (skuInput: SkuInput): number => {
  let clickRate = 5;

  if (categoryBonusSet.has(skuInput.category)) {
    clickRate += 2;
  }

  clickRate += countIngredientBoost(skuInput.ingredients);

  const price = skuInput.expectedRetailPrice;
  if (price < 20) {
    clickRate += 3;
  } else if (price >= 20 && price <= 35) {
    clickRate += 1;
  } else if (price > 40) {
    clickRate -= 3;
  }

  if (includesOneOf(skuInput.description, confusingTerms)) {
    clickRate -= 2;
  }

  return clamp(roundTo1(clickRate), 1, 35);
};

export const simulateVisitors = (skuInput: SkuInput, visitorCount = 100): TestMetrics => {
  const clickRate = getSimulatedClickRate(skuInput);
  const ctaClicks = Math.max(0, Math.round((visitorCount * clickRate) / 100));

  const signupRatio = 0.3 + Math.random() * 0.2;
  const waitlistSignups = Math.round(ctaClicks * signupRatio);

  const likesPool = Math.round(ctaClicks * (0.55 + Math.random() * 0.25));
  const weights = [
    scoreMessageForConsumer(skuInput.messageA, skuInput.targetConsumer),
    scoreMessageForConsumer(skuInput.messageB, skuInput.targetConsumer),
    scoreMessageForConsumer(skuInput.messageC, skuInput.targetConsumer),
  ];
  const [messageALikes, messageBLikes, messageCLikes] = distributeLikes(likesPool, weights);

  return {
    pageViews: visitorCount,
    ctaClicks,
    waitlistSignups,
    messageALikes,
    messageBLikes,
    messageCLikes,
  };
};

export const calculateDemandResult = (skuInput: SkuInput, metrics: TestMetrics): DemandResult => {
  const ctaClickRate = metrics.pageViews > 0 ? (metrics.ctaClicks / metrics.pageViews) * 100 : 0;
  const signupConversionRate = metrics.ctaClicks > 0 ? (metrics.waitlistSignups / metrics.ctaClicks) * 100 : 0;

  const ctaScore = clamp((ctaClickRate / 20) * 40, 0, 40);
  const signupScore = clamp((signupConversionRate / 60) * 30, 0, 30);
  const messageScore = getMessageClarityScore(metrics);
  const priceScore = getPriceScore(skuInput.expectedRetailPrice);

  const demandScore = roundTo1(clamp(ctaScore + signupScore + messageScore + priceScore, 0, 100));
  let demandLevel = 'Weak demand signal';
  let recommendation = 'Do not mass-produce yet. Revise product concept, price, or message.';
  if (demandScore >= 40 && demandScore <= 69) {
    demandLevel = 'Moderate demand signal';
    recommendation = 'Run another test with revised positioning or lower-risk trial size.';
  } else if (demandScore >= 70) {
    demandLevel = 'Strong demand signal';
    recommendation = 'Consider small-batch test launch or buyer validation.';
  }

  const winner = getWinningMessage(skuInput, metrics);

  const nextActions = [
    winner.likes > 0
      ? `Double down on the winning message: "${winner.text}".`
      : 'Run more traffic through the test to identify a clear message winner.',
    skuInput.expectedRetailPrice > 35
      ? 'Test a trial size under $19.99 to reduce first purchase friction.'
      : 'Validate retailer or buyer response with a concise one-page sell sheet.',
    demandLevel === 'Strong demand signal'
      ? 'Prepare a small-batch launch plan and collect post-purchase feedback signals.'
      : 'Iterate the product page copy and run another 100-visitor simulation.',
  ];

  // Production risk calculation based on demand score and planned production quantity
  const plannedQty = skuInput.plannedProductionQuantity ?? 0;
  let productionRiskLevel = 'Medium';
  if (demandScore < 40 && plannedQty > 1000) {
    productionRiskLevel = 'High';
  } else if (demandScore < 40 && plannedQty <= 1000) {
    productionRiskLevel = 'Medium';
  } else if (demandScore >= 40 && demandScore <= 69 && plannedQty > 3000) {
    productionRiskLevel = 'High';
  } else if (demandScore >= 40 && demandScore <= 69 && plannedQty <= 3000) {
    productionRiskLevel = 'Medium';
  } else if (demandScore >= 70) {
    productionRiskLevel = 'Low';
  }

  // Launch decision mapping
  let launchDecision = 'Do Not Produce Yet';
  if (demandScore >= 0 && demandScore <= 39) {
    launchDecision = 'Do Not Produce Yet';
  } else if (demandScore >= 40 && demandScore <= 54) {
    launchDecision = 'Revise & Retest';
  } else if (demandScore >= 55 && demandScore <= 69) {
    launchDecision = 'Small-Batch Test Recommended';
  } else if (demandScore >= 70) {
    launchDecision = 'Ready for Buyer Validation';
  }

  // Suggested SKU adjustments
  const suggestedSkuAdjustment: string[] = [];
  if (skuInput.expectedRetailPrice > 35) {
    suggestedSkuAdjustment.push('Test a smaller trial size or lower entry price.');
  }
  if (demandScore < 40) {
    suggestedSkuAdjustment.push('Revise product concept, positioning message, or target consumer.');
  }
  if (winner.likes > 0) {
    suggestedSkuAdjustment.push(`Use the winning message: "${winner.text}" as primary positioning.`);
  }
  if (plannedQty > 0 && demandScore < 70 && plannedQty > 0) {
    if (plannedQty > 3000) {
      suggestedSkuAdjustment.push('Reduce initial production quantity and run another test.');
    } else if (demandScore < 40) {
      suggestedSkuAdjustment.push('Reduce initial production and run another test.');
    }
  }

  // Sustainability insight (soft language)
  const sustainabilityInsight =
    'By validating demand before production, brands can help reduce unsold inventory, unnecessary packaging, and product waste.';

  // Recommended price direction
  let recommendedPriceDirection = 'Maintain price';
  if (skuInput.expectedRetailPrice > 35) {
    recommendedPriceDirection = 'Consider lower entry price or trial size';
  } else if (demandScore >= 70 && skuInput.expectedRetailPrice <= 35) {
    recommendedPriceDirection = 'Price appears reasonable for test launch';
  } else if (demandScore < 40) {
    recommendedPriceDirection = 'Consider testing lower entry price or trial size';
  }

  return {
    demandScore,
    demandLevel,
    winningMessage: winner.text,
    ctaClickRate: roundTo1(ctaClickRate),
    signupConversionRate: roundTo1(signupConversionRate),
    priceInsight: getPriceInsight(skuInput.expectedRetailPrice),
    recommendation,
    nextActions,
    productionRiskLevel,
    launchDecision,
    suggestedSkuAdjustment,
    sustainabilityInsight,
    recommendedPriceDirection,
  };
};
