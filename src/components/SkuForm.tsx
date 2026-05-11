import { FormEvent, useEffect, useState } from 'react';
import { SkuInput } from '../types';
import { categories, ctaTypes, samplePdrnCream, targetConsumers } from '../utils/sampleData';
import { useLocale } from '../LocaleProvider';

interface SkuFormProps {
  initialValue: SkuInput;
  onSubmit: (input: SkuInput) => void;
  onLoadSample: () => void;
  onReset: () => void;
}

function SkuForm({ initialValue, onSubmit, onLoadSample, onReset }: SkuFormProps) {
  const { t } = useLocale();
  const [formData, setFormData] = useState<SkuInput>(initialValue);

  useEffect(() => {
    setFormData(initialValue);
  }, [initialValue]);

  const updateField = (key: keyof SkuInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      expectedRetailPrice: Number(formData.expectedRetailPrice) || 0,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">{t('skuBuilderTitle')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('mission')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('loadSample')}
          </button>
          <button
            type="button"
            onClick={() => setFormData(samplePdrnCream)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('applyGuideFields')}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('resetTest')}
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600">{t('exampleGuideHint')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('brandName')}
            <input
              required
              value={formData.brandName}
              onChange={(e) => updateField('brandName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('productName')}
            <input
              required
              value={formData.productName}
              onChange={(e) => updateField('productName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('productCategory')}
            <select
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {t(`category.${category}`)}
                </option>
              ))}
            </select>
          </label>
            <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('targetConsumer')}
            <select
              value={formData.targetConsumer}
              onChange={(e) => updateField('targetConsumer', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            >
              {targetConsumers.map((targetConsumer) => (
                <option key={targetConsumer} value={targetConsumer}>
                  {t(`target.${targetConsumer}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          {t('keyIngredients')}
          <textarea
            required
            rows={3}
            value={formData.ingredients}
            onChange={(e) => updateField('ingredients', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          {t('productDescription')}
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('expectedRetailPrice')}
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.expectedRetailPrice}
              onChange={(e) => updateField('expectedRetailPrice', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('productSize')}
            <input
              required
              placeholder="50ml"
              value={formData.productSize}
              onChange={(e) => updateField('productSize', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('plannedProductionQuantity')}
            <input
              type="number"
              placeholder="Example: 1000"
              value={formData.plannedProductionQuantity ?? ''}
              onChange={(e) => updateField('plannedProductionQuantity', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">{t('plannedProductionHelp')}</p>
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('ctaType')}
            <select
              value={formData.ctaType}
              onChange={(e) => updateField('ctaType', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            >
              {ctaTypes.map((ctaType) => (
                <option key={ctaType} value={ctaType}>
                  {ctaType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          Product image URL (optional)
          <input
            value={formData.productImageUrl}
            onChange={(e) => updateField('productImageUrl', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('positioningMessageA')}
            <input
              required
              value={formData.messageA}
              onChange={(e) => updateField('messageA', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('positioningMessageB')}
            <input
              required
              value={formData.messageB}
              onChange={(e) => updateField('messageB', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            {t('positioningMessageC')}
            <input
              required
              value={formData.messageC}
              onChange={(e) => updateField('messageC', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="btn-primary"
          >
            {t('generateProductPage')}
          </button>
          <button
            type="button"
            onClick={() => onSubmit(formData)}
            className="btn-ghost"
          >
            {t('startSkuTest')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SkuForm;
