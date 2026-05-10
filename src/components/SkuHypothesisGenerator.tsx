import { useState, useEffect } from 'react';
import { SkuHypothesis } from '../types';
import { categories, targetConsumers } from '../utils/sampleData';
import { useLocale } from '../LocaleProvider';

interface Props {
  onUseHypothesis: (hypothesis: SkuHypothesis) => void;
}

const priceMap: Record<string, number> = {
  'Under $15': 12.99,
  '$15-$25': 19.99,
  '$25-$35': 29.99,
  '$35-$50': 39.99,
  'Over $50': 59.99,
};

const sizeByCategory = (category: string): string => {
  switch (category) {
    case 'Toner Pad':
      return '70 pads full size';
    case 'Cream':
      return '50ml full size';
    case 'Serum':
      return '30ml full size';
    case 'Mask Pack':
      return '5 sheets';
    case 'Hair/Scalp Care':
      return '150ml full size';
    default:
      return 'trial size';
  }
};

const productionCautions = [
  '바로 대량 양산하지 말고, 먼저 랜딩페이지 테스트로 수요를 검증하세요.',
  '본품 양산 전에 trial-size SKU로 반응을 확인하는 것이 좋습니다.',
  '이 컨셉은 바이어 검증 전에 소비자 메시지 테스트용으로 활용하는 것이 적합합니다.',
  'Demand Score가 70점 미만이면 초도 생산 수량을 줄이고 재테스트하는 것을 권장합니다.',
];

const pickCaution = (idx: number) => productionCautions[idx % productionCautions.length];

const genId = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;

const toneStyleMap: Record<string, string> = {
  Clinical: 'clinically precise',
  Minimal: 'clean and minimal',
  Trendy: 'trend-forward',
  Natural: 'botanical-first',
  Premium: 'premium sensory',
  'Gen Z playful': 'playful and social-first',
};

const concernMessageMap: Record<string, string> = {
  'Sensitive skin': 'calm visible redness and strengthen skin comfort',
  'Barrier damage': 'repair a weakened barrier and support recovery',
  Dullness: 'improve clarity and glow for tired skin',
  'Acne-prone skin': 'balance excess oil while soothing blemish-prone areas',
  Pores: 'refine rough texture and reduce pore visibility',
  Dryness: 'deeply hydrate and lock in moisture',
  'Aging concerns': 'support firmness and elasticity over time',
  'Scalp care': 'rebalance scalp condition and reduce dryness',
  'Daily glow': 'maintain healthy daily radiance',
};

const concernLabelMap: Record<string, string> = {
  'Sensitive skin': 'Calm',
  'Barrier damage': 'Barrier',
  Dullness: 'Glow',
  'Acne-prone skin': 'Clear',
  Pores: 'Smooth',
  Dryness: 'Hydra',
  'Aging concerns': 'Firm',
  'Scalp care': 'Scalp',
  'Daily glow': 'Daily Glow',
};

export default function SkuHypothesisGenerator({ onUseHypothesis }: Props) {
  const { t } = useLocale();

  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [heroIngredients, setHeroIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const knownIngredients = [
    'Panthenol',
    '판테놀',
    'Houttuynia cordata',
    '어성초',
    'PDRN',
    'Peptide',
    'Niacinamide',
    '나이아신아마이드',
    'Centella Asiatica',
    '센텔라',
    'Madecassoside',
    'Snail',
    'Mucin',
    'Rice',
    'Propolis',
    'Honey',
    'Retinol',
    'Collagen',
    'Hyaluronic Acid',
    'Hyaluron',
    'Ceramide',
    'Adenosine',
    'Betaine',
    'Allantoin',
    'PHA',
    'AHA',
    'BHA',
    'Salicylic Acid',
    'Azelaic Acid',
    'Tranexamic Acid',
    'Arbutin',
    'Licorice',
    'Glutathione',
    'Vitamin C',
    'Ascorbic Acid',
    'Green Tea',
    'Camellia',
    'Tea Tree',
    'Chamomile',
    'Rose Extract',
    'Peony',
    'Mugwort',
    'Centella',
    'Panax Ginseng',
    'Ginseng',
    'Squalane',
    'Shea Butter',
    'Squalene',
    'CICA',
    'Beta-Glucan',
    'SPF',
  ];

  const categoryIngredientMap: Record<string, string[]> = {
    'Cream': ['Ceramide', 'Shea Butter', 'Squalane', 'Panthenol', 'Hyaluronic Acid'],
    'Serum': ['Niacinamide', 'Peptide', 'Adenosine', 'Hyaluronic Acid', 'Vitamin C'],
    'Toner Pad': ['AHA', 'PHA', 'Niacinamide', 'Panthenol'],
    'Sunscreen': ['SPF', 'Squalane'],
    'Cleanser': ['Centella Asiatica', 'Tea Tree', 'Betaine', 'Panthenol'],
    'Mask Pack': ['Snail', 'Propolis', 'Honey', 'Rice'],
    'Hair/Scalp Care': ['Panthenol', 'Tea Tree', 'Squalane'],
    'Makeup': ['Squalane', 'Hyaluronic Acid'],
    'Other': ['Panthenol', 'Centella Asiatica', 'Hyaluronic Acid'],
  };

  const getCategorySuggestions = (cat: string) => {
    const mapped = categoryIngredientMap[cat] ?? [];
    // keep only known ingredients and not already selected
    return mapped.filter((m) => knownIngredients.includes(m) && !heroIngredients.includes(m));
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const updateSuggestions = (text: string) => {
    if (!text.trim()) return setSuggestions([]);
    const q = text.toLowerCase();
    setSuggestions(
      knownIngredients.filter((k) => k.toLowerCase().includes(q) && !heroIngredients.includes(k)).slice(0, 8),
    );
  };

  useEffect(() => {
    // when category changes and there's no ingredient input, show category suggestions
    if (!ingredientInput.trim()) {
      setSuggestions(getCategorySuggestions(category));
    }
  }, [category]);

  const addIngredient = (ing: string) => {
    if (!ing || heroIngredients.includes(ing)) return;
    setHeroIngredients((prev) => [...prev, ing]);
    setIngredientInput('');
    setSuggestions([]);
  };

  const removeIngredient = (ing: string) => {
    setHeroIngredients((prev) => prev.filter((i) => i !== ing));
  };
  const [targetConsumer, setTargetConsumer] = useState(targetConsumers[0]);
  const [mainConcern, setMainConcern] = useState('Sensitive skin');
  const [priceRange, setPriceRange] = useState('$25-$35');
  const [brandTone, setBrandTone] = useState('Minimal');
  const [hypotheses, setHypotheses] = useState<SkuHypothesis[]>([]);

  const generate = () => {
    const fallbackIngredients = categoryIngredientMap[category] ?? [];
    const selectedIngredients = heroIngredients.length > 0 ? heroIngredients : fallbackIngredients.slice(0, 3);
    const ingredientText = selectedIngredients.length > 0 ? selectedIngredients.join(', ') : 'Panthenol';
    const ingredientsLower = ingredientText.toLowerCase();
    const mainIngredient = selectedIngredients[0] ?? 'Panthenol';
    const subIngredient = selectedIngredients[1] ?? selectedIngredients[0] ?? 'Ceramide';

    let ingredientConcept = `${mainIngredient}-focused daily skin support.`;
    if (/pdrn|peptide|collagen|retinol/.test(ingredientsLower)) {
      ingredientConcept = `${mainIngredient} + ${subIngredient} for visible elasticity and radiance.`;
    } else if (/centella|cica|heartleaf/.test(ingredientsLower)) {
      ingredientConcept = `${mainIngredient}-centered calming care for fragile skin days.`;
    } else if (/rice|snail|propolis|honey/.test(ingredientsLower)) {
      ingredientConcept = `${mainIngredient} nourishment for soft glow and smooth texture.`;
    }

    const concernMessage = concernMessageMap[mainConcern] ?? 'support everyday skin balance';
    const toneStyle = toneStyleMap[brandTone] ?? 'clean and focused';
    const concernLabel = concernLabelMap[mainConcern] ?? 'Core';

    const occasionIdeasByConcern: Record<string, string[]> = {
      'Sensitive skin': ['Post-cleansing calming routine', 'Mask-after recovery touch', 'Low-irritation morning reset'],
      'Barrier damage': ['Night barrier reset routine', 'Season-change skin rescue', 'Over-exfoliation recovery routine'],
      Dullness: ['Morning bright-skin prep', 'Before-meeting glow reset', 'Weekend tone-up ritual'],
      'Acne-prone skin': ['Humidity-day pore balance routine', 'Workout-after soothing step', 'Late-night sebum balance care'],
      Dryness: ['Winter moisture shield routine', 'Flight/day-trip hydration ritual', 'Sleep-time hydration wrap'],
      'Aging concerns': ['PM elasticity routine', 'Neck-and-face firming ritual', 'Makeup-before smoothing prep'],
    };

    const defaultOccasions = ['Morning glow routine', 'Post-stress skin reset', 'Travel recovery ritual'];
    const occasionPool = occasionIdeasByConcern[mainConcern] ?? defaultOccasions;
    const seed = `${brandName}-${category}-${mainConcern}-${targetConsumer}-${brandTone}-${ingredientText}`.length;
    const pickedOccasion = occasionPool[seed % occasionPool.length];

    const basePrice = priceMap[priceRange] ?? 29.99;
    const premiumPrice = Math.max(9.99, Number((basePrice + 2).toFixed(2)));
    const problemPrice = basePrice;
    const trialPrice = Math.max(9.99, Number((basePrice - 2).toFixed(2)));

    const ingredientSize = sizeByCategory(category);
    const concernSize = category === 'Cream' ? '60ml comfort size' : sizeByCategory(category);
    const occasionSize = category === 'Mask Pack' ? '3-sheet starter kit' : `mini ${sizeByCategory(category)}`;
    const brandLabel = brandName || 'Brand';

    const hypo1: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${mainIngredient} ${category} Boost`,
      conceptType: 'Ingredient-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `A ${toneStyle} SKU that highlights hero actives: ${ingredientConcept}`,
      positioningMessage: `${mainIngredient}-led performance care for ${targetConsumer.toLowerCase()} seeking visible ingredient credibility.`,
      recommendedPrice: premiumPrice,
      recommendedSize: ingredientSize,
      testHypothesis: `Ingredient-first framing with ${mainIngredient} will improve CTA click-through for ${targetConsumer}.`,
      productionCaution: pickCaution(0),
    };

    const hypo2: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${concernLabel} ${category} Rescue`,
      conceptType: 'Problem-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `Focused solution concept to ${concernMessage} with ${mainIngredient} and ${subIngredient}.`,
      positioningMessage: `${mainConcern} focused message for ${targetConsumer.toLowerCase()} who need a clear and practical benefit.`,
      recommendedPrice: problemPrice,
      recommendedSize: concernSize,
      testHypothesis: `${mainConcern} problem-solution messaging will lift waitlist conversion among ${targetConsumer}.`,
      productionCaution: pickCaution(1),
    };

    const hypo3: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${category} Routine Edit`,
      conceptType: 'Occasion-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `${pickedOccasion} using ${mainIngredient} to create a repeatable daily ritual touchpoint.`,
      positioningMessage: `Built for ${pickedOccasion.toLowerCase()} to improve routine fit and repeat intent.`,
      recommendedPrice: trialPrice,
      recommendedSize: occasionSize,
      testHypothesis: `Occasion-led storytelling around ${pickedOccasion.toLowerCase()} will increase return visits from ${targetConsumer}.`,
      productionCaution: pickCaution(2),
    };

    setHypotheses([hypo1, hypo2, hypo3]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">{t('skuHypothesisGeneratorTitle')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('mission')}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('brandName')}
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('productCategory')}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {categories.map((c) => (
                <option key={c} value={c}>{t(`category.${c}`)}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          {t('heroIngredients')}
          <div className="relative">
            <input
              value={ingredientInput}
              onChange={(e) => {
                setIngredientInput(e.target.value);
                updateSuggestions(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = ingredientInput.trim();
                  if (val) addIngredient(val);
                }
              }}
              placeholder={t('ingredientPlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white p-2 shadow-sm">
                {suggestions.map((s) => (
                  <li key={s} className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-100" onClick={() => addIngredient(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {heroIngredients.map((h) => (
              <button key={h} type="button" onClick={() => removeIngredient(h)} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                <span>{h}</span>
                <span className="text-xs text-gray-500">✕</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">{t('suggestedForCategory')}</p>
            <div className="flex flex-wrap gap-2">
              {getCategorySuggestions(category).map((s) => (
                <button key={s} type="button" onClick={() => addIngredient(s)} className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm hover:bg-gray-100">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('targetConsumer')}
            <select value={targetConsumer} onChange={(e) => setTargetConsumer(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {targetConsumers.map((tc) => <option key={tc} value={tc}>{tc}</option>)}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('mainSkinConcern')}
            <select value={mainConcern} onChange={(e) => setMainConcern(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {['Sensitive skin','Barrier damage','Dullness','Acne-prone skin','Pores','Dryness','Aging concerns','Scalp care','Daily glow'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('desiredPriceRange')}
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {['Under $15','$15-$25','$25-$35','$35-$50','Over $50'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          {t('brandTone')}
          <select value={brandTone} onChange={(e) => setBrandTone(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            {['Clinical','Minimal','Trendy','Natural','Premium','Gen Z playful'].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>

        <div className="flex gap-3">
          <button onClick={generate} className="btn-primary">{t('generateButton')}</button>
        </div>
      </div>

      {hypotheses.length > 0 && (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {hypotheses.map((h) => (
            <article key={h.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">{h.name}</h4>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{h.conceptType}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{h.positioningMessage}</p>
              <p className="mt-2 text-sm text-gray-700">Price: ${h.recommendedPrice.toFixed(2)}</p>
              <p className="mt-1 text-sm text-gray-700">Size: {h.recommendedSize}</p>
              <p className="mt-2 text-sm text-gray-700">Hypothesis: {h.testHypothesis}</p>
              <p className="mt-2 text-sm text-red-600">{h.productionCaution}</p>
              <div className="mt-4">
                <button onClick={() => onUseHypothesis(h)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">{t('testThisSku')}</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
