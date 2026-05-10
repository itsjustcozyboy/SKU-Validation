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
  const [priceRange, setPriceRange] = useState('25-$35');
  const [brandTone, setBrandTone] = useState('Minimal');
  const [hypotheses, setHypotheses] = useState<SkuHypothesis[]>([]);

  const generate = () => {
    const ingredientsLower = heroIngredients.join(', ').toLowerCase();

    // Ingredient-led
    let ingrConcept = 'Balanced care for healthy skin.';
    if (/pdrn|peptide|collagen|retinol/.test(ingredientsLower)) {
      ingrConcept = 'Science-backed radiance and elasticity care.';
    } else if (/centella|cica|heartleaf/.test(ingredientsLower)) {
      ingrConcept = 'Calming barrier repair for sensitive skin.';
    } else if (/rice|snail|propolis|honey/.test(ingredientsLower)) {
      ingrConcept = 'Nourishing glow and radiance formula.';
    }

    // Problem-led
    let problemConcept = 'Everyday soothing care.';
    if (mainConcern === 'Sensitive skin') problemConcept = 'Barrier repair and calming daily care.';
    if (mainConcern === 'Barrier damage') problemConcept = 'Barrier repair and skin comfort recovery.';
    if (mainConcern === 'Dullness') problemConcept = 'Glow and radiance tone care.';
    if (mainConcern === 'Acne-prone skin') problemConcept = 'Blemish-prone lightweight pore care.';
    if (mainConcern === 'Dryness') problemConcept = 'Deep hydration and moisture lock.';
    if (mainConcern === 'Aging concerns') problemConcept = 'Elasticity, firming and bounce care.';

    // Occasion-led
    const occasionIdeas = [
      'Morning glow routine for fresh radiance.',
      'Post-stress skin reset for calm and repair.',
      'After-workout calming care for sensitive skin.',
      'Travel-size recovery for on-the-go skin',
      'Night repair routine for visible recovery.',
      'Daily barrier ritual for long-term resilience.',
    ];

    const priceKey = priceRange;
    const recommendedPrice = priceMap[priceKey] ?? 29.99;

    const hypo1: SkuHypothesis = {
      id: genId(),
      name: `${brandName || 'Brand'} ${category} Radiance`,
      conceptType: 'Ingredient-led',
      targetConsumer,
      heroIngredients: heroIngredients.join(', '),
      productConcept: ingrConcept,
      positioningMessage: `${ingrConcept}`,
      recommendedPrice,
      recommendedSize: sizeByCategory(category),
      testHypothesis: `Positioning around key ingredients will drive higher CTR among ${targetConsumer}.`,
      productionCaution: pickCaution(0),
    };

    const hypo2: SkuHypothesis = {
      id: genId(),
      name: `${brandName || 'Brand'} ${category} Repair`,
      conceptType: 'Problem-led',
      targetConsumer,
      heroIngredients,
      productConcept: problemConcept,
      positioningMessage: `${problemConcept}`,
      recommendedPrice,
      recommendedSize: sizeByCategory(category),
      testHypothesis: `Messaging focused on ${mainConcern} will increase signups among ${targetConsumer}.`,
      productionCaution: pickCaution(1),
    };

    const hypo3: SkuHypothesis = {
      id: genId(),
      name: `${brandName || 'Brand'} ${category} Daily`,
      conceptType: 'Occasion-led',
      targetConsumer,
      heroIngredients,
      productConcept: occasionIdeas[Math.floor(Math.random() * occasionIdeas.length)],
      positioningMessage: `Designed for ${occasionIdeas[Math.floor(Math.random() * occasionIdeas.length)]}`,
      recommendedPrice,
      recommendedSize: sizeByCategory(category),
      testHypothesis: `An occasion-led message will resonate during key daily routines for ${targetConsumer}.`,
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
