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
    case 'Toner Pad': return '70 pads full size';
    case 'Cream': return '50ml full size';
    case 'Serum': return '30ml full size';
    case 'Mask Pack': return '5 sheets';
    case 'Hair/Scalp Care': return '150ml full size';
    default: return 'trial size';
  }
};

const productionCautions = [
  '바로 대량 양산하지 말고, 먼저 랜딩페이지 테스트로 수요를 검증하세요.',
  '본품 양산 전에 trial-size SKU로 반응을 확인하는 것이 좋습니다.',
  '이 컨셉은 바이어 검증 전에 소비자 메시지 테스트용으로 활용하는 것이 적합합니다.',
  'Demand Score가 70점 미만이면 초도 생산 수량을 줄이고 재테스트하는 것을 권장합니다.',
];

const genId = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;

const toneStyleMap: Record<string, string> = {
  Clinical: 'clinically precise',
  Minimal: 'clean and minimal',
  Trendy: 'trend-forward',
  Natural: 'botanical-first',
  Premium: 'premium sensory',
  'Gen Z playful': 'playful and social-first',
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

const knownIngredients = [
  'Panthenol', 'PDRN', 'Peptide', 'Niacinamide', 'Centella Asiatica', 'Madecassoside', 'Snail', 'Mucin', 'Rice',
  'Propolis', 'Honey', 'Retinol', 'Collagen', 'Hyaluronic Acid', 'Ceramide', 'Adenosine', 'Allantoin',
  'PHA', 'AHA', 'BHA', 'Salicylic Acid', 'Vitamin C', 'Green Tea', 'Tea Tree', 'Arbutin', 'CICA', 'SPF',
];

const categoryIngredientMap: Record<string, string[]> = {
  Cream: ['Ceramide', 'Shea Butter', 'Squalane', 'Panthenol', 'Hyaluronic Acid'],
  Serum: ['Niacinamide', 'Peptide', 'Adenosine', 'Hyaluronic Acid', 'Vitamin C'],
  'Toner Pad': ['AHA', 'PHA', 'Niacinamide', 'Panthenol'],
  'Mask Pack': ['Snail', 'Propolis', 'Honey', 'Rice'],
};

type StepType = 'step1' | 'step2' | 'step3' | 'results';

export default function SkuHypothesisGenerator({ onUseHypothesis }: Props) {
  const { t } = useLocale();
  const [currentStep, setCurrentStep] = useState<StepType>('step1');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [heroIngredients, setHeroIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [targetConsumer, setTargetConsumer] = useState(targetConsumers[0]);
  const [mainConcern, setMainConcern] = useState('Sensitive skin');
  const [priceRange, setPriceRange] = useState('$25-$35');
  const [brandTone, setBrandTone] = useState('Minimal');
  const [hypotheses, setHypotheses] = useState<SkuHypothesis[]>([]);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getCategorySuggestions = (cat: string) => {
    const mapped = categoryIngredientMap[cat] ?? [];
    return mapped.filter((m) => !heroIngredients.includes(m));
  };

  const updateSuggestions = (text: string) => {
    if (!text.trim()) return setSuggestions([]);
    const q = text.toLowerCase();
    setSuggestions(knownIngredients.filter((k) => k.toLowerCase().includes(q) && !heroIngredients.includes(k)).slice(0, 8));
  };

  useEffect(() => {
    if (!ingredientInput.trim()) {
      setSuggestions(getCategorySuggestions(category));
    }
  }, [category, heroIngredients, ingredientInput]);

  const addIngredient = (ing: string) => {
    if (!ing || heroIngredients.includes(ing)) return;
    setHeroIngredients((prev) => [...prev, ing]);
    setIngredientInput('');
    setSuggestions([]);
  };

  const removeIngredient = (ing: string) => {
    setHeroIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const generate = () => {
    const fallbackIngredients = categoryIngredientMap[category] ?? [];
    const selectedIngredients = heroIngredients.length > 0 ? heroIngredients : fallbackIngredients.slice(0, 3);
    const ingredientText = selectedIngredients.join(', ') || 'Panthenol';
    const mainIngredient = selectedIngredients[0] ?? 'Panthenol';
    const subIngredient = selectedIngredients[1] ?? selectedIngredients[0] ?? 'Ceramide';
    const brandLabel = brandName || 'Brand';
    const basePrice = priceMap[priceRange] ?? 29.99;
    const ingredientSize = sizeByCategory(category);

    const pickCaution = (idx: number) => productionCautions[idx % productionCautions.length];
    const toneStyle = toneStyleMap[brandTone] ?? 'clean and focused';
    const concernLabel = concernLabelMap[mainConcern] ?? 'Core';

    const hypo1: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${mainIngredient} ${category}`,
      conceptType: 'Ingredient-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `A ${toneStyle} SKU featuring ${ingredientText}`,
      positioningMessage: `${mainIngredient}-led performance care for ${targetConsumer.toLowerCase()}`,
      recommendedPrice: basePrice + 2,
      recommendedSize: ingredientSize,
      testHypothesis: `Ingredient-first messaging will improve conversions`,
      productionCaution: pickCaution(0),
    };

    const hypo2: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${concernLabel} ${category}`,
      conceptType: 'Problem-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `Focused solution with ${mainIngredient} and ${subIngredient}`,
      positioningMessage: `${mainConcern} focused for ${targetConsumer.toLowerCase()}`,
      recommendedPrice: basePrice,
      recommendedSize: ingredientSize,
      testHypothesis: `Problem-solution messaging will lift conversion`,
      productionCaution: pickCaution(1),
    };

    const hypo3: SkuHypothesis = {
      id: genId(),
      name: `${brandLabel} ${category} Routine`,
      conceptType: 'Occasion-led',
      targetConsumer,
      heroIngredients: ingredientText,
      productConcept: `Perfect for your daily ritual`,
      positioningMessage: `Built for routine fit and repeat intent`,
      recommendedPrice: basePrice - 1,
      recommendedSize: `mini ${ingredientSize}`,
      testHypothesis: `Occasion-led storytelling will increase return visits`,
      productionCaution: pickCaution(2),
    };

    setHypotheses([hypo1, hypo2, hypo3]);
    setCurrentStep('results');
  };

  if (currentStep === 'step1') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <div className="space-y-8">
          <div>
            <p className="caption text-blue-600 mb-4">Step 1 of 3</p>
            <h2 className="section-title mb-4">Start with your brand</h2>
            <p className="body-large text-gray-600">Tell us about your brand and product category.</p>
          </div>
          <div className="space-y-6">
            <label className="block">
              <p className="body-regular font-semibold mb-2">Brand Name</p>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Glow Labs"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <p className="body-regular font-semibold mb-2">Product Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{t(`category.${c}`)}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-4 pt-8">
            <button
              onClick={() => setCurrentStep('step2')}
              disabled={!brandName.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Next → Ingredients
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'step2') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <div className="space-y-8">
          <div>
            <p className="caption text-blue-600 mb-4">Step 2 of 3</p>
            <h2 className="section-title mb-4">Choose hero ingredients</h2>
            <p className="body-large text-gray-600">Select up to 3 key ingredients or skip for defaults.</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <p className="body-regular font-semibold mb-2">Search ingredients</p>
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => { setIngredientInput(e.target.value); updateSuggestions(e.target.value); }}
                placeholder="e.g., PDRN, Centella"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-auto rounded-lg border bg-white shadow-lg">
                  {suggestions.map((s) => (
                    <li key={s} onClick={() => addIngredient(s)} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            {heroIngredients.length > 0 && (
              <div className="space-y-2">
                <p className="body-small font-medium text-gray-600">Selected ({heroIngredients.length}/3)</p>
                <div className="flex flex-wrap gap-2">
                  {heroIngredients.map((ing) => (
                    <button key={ing} onClick={() => removeIngredient(ing)} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium hover:bg-blue-200">
                      {ing} <span>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 pt-4 border-t">
              <p className="body-small font-medium text-gray-600">Popular for {category}</p>
              <div className="flex flex-wrap gap-2">
                {getCategorySuggestions(category).map((s) => (
                  <button key={s} onClick={() => addIngredient(s)} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-8">
            <button onClick={() => setCurrentStep('step1')} className="btn-ghost">← Back</button>
            <button onClick={() => setCurrentStep('step3')} className="btn-primary">Next → Profile</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'step3') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <div className="space-y-8">
          <div>
            <p className="caption text-blue-600 mb-4">Step 3 of 3</p>
            <h2 className="section-title mb-4">Define your target profile</h2>
            <p className="body-large text-gray-600">Choose consumer, concern, price & tone to generate ideas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label><p className="body-regular font-semibold mb-2">Target Consumer</p>
              <select value={targetConsumer} onChange={(e) => setTargetConsumer(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {targetConsumers.map((tc) => (<option key={tc} value={tc}>{tc}</option>))}
              </select>
            </label>
            <label><p className="body-regular font-semibold mb-2">Main Skin Concern</p>
              <select value={mainConcern} onChange={(e) => setMainConcern(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Sensitive skin', 'Barrier damage', 'Dullness', 'Acne-prone skin', 'Pores', 'Dryness', 'Aging concerns'].map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </label>
            <label><p className="body-regular font-semibold mb-2">Price Range</p>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Under $15', '$15-$25', '$25-$35', '$35-$50', 'Over $50'].map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </label>
            <label><p className="body-regular font-semibold mb-2">Brand Tone</p>
              <select value={brandTone} onChange={(e) => setBrandTone(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Clinical', 'Minimal', 'Trendy', 'Natural', 'Premium'].map((b) => (<option key={b} value={b}>{b}</option>))}
              </select>
            </label>
          </div>
          <div className="flex gap-4 pt-8">
            <button onClick={() => setCurrentStep('step2')} className="btn-ghost">← Back</button>
            <button onClick={generate} className="btn-primary">Generate 3 Ideas</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="space-y-4">
          <p className="caption text-blue-600">Generated Ideas</p>
          <h2 className="section-title">3 SKU Concepts Ready to Test</h2>
          <p className="body-large text-gray-600 max-w-2xl">Each concept approaches the market differently. Choose one to test.</p>
        </div>
      </section>
      <section className="bg-gray-50 px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hypotheses.map((h) => (
              <div key={h.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="px-6 pt-6 pb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full">{h.conceptType}</span>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <h3 className="subsection-title text-lg">{h.name}</h3>
                    <p className="body-small text-gray-600 mt-2">{h.positioningMessage}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">타깃 고객:</span> <span className="font-semibold">{h.targetConsumer}</span></div>
                    <div><span className="text-gray-600">핵심 성분:</span> <span className="font-semibold">{h.heroIngredients}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">가격:</span><span className="font-semibold">${h.recommendedPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">권장 용량:</span><span className="font-semibold">{h.recommendedSize}</span></div>
                    <div className="mt-2 text-sm text-gray-700"><strong>테스트 가설:</strong> {h.testHypothesis}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs text-yellow-900">{h.productionCaution}</p>
                  </div>
                  <button onClick={() => onUseHypothesis(h)} className="w-full btn-primary mt-4">이 SKU로 고객 테스트 만들기</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button onClick={() => { setCurrentStep('step3'); setHypotheses([]); }} className="btn-ghost">← Adjust & Regenerate</button>
          </div>
        </div>
      </section>
    </div>
  );
}
