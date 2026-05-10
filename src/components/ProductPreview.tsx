import { FormEvent, useEffect, useState } from 'react';
import { SkuInput, TestMetrics } from '../types';
import { useLocale } from '../LocaleProvider';

interface ProductPreviewProps {
  skuInput: SkuInput;
  metrics: TestMetrics;
  onAddMetrics: (delta: Partial<TestMetrics>) => void;
  onViewDashboard: () => void;
  onReset: () => void;
}

function ProductPreview({ skuInput, metrics, onAddMetrics, onViewDashboard, onReset }: ProductPreviewProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState('');

  useEffect(() => {
    onAddMetrics({ pageViews: 1 });
  }, [onAddMetrics]);

  const handleEmailSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    onAddMetrics({ waitlistSignups: 1 });
    setEmail('');
  };

  const messageCards = [
    { title: t('positioningMessageA'), text: skuInput.messageA, likes: metrics.messageALikes, key: 'messageALikes' as const },
    { title: t('positioningMessageB'), text: skuInput.messageB, likes: metrics.messageBLikes, key: 'messageBLikes' as const },
    { title: t('positioningMessageC'), text: skuInput.messageC, likes: metrics.messageCLikes, key: 'messageCLikes' as const },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">{t('disclaimer')}</p>
      </div>

      <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-2">
        <div>
          {skuInput.productImageUrl ? (
            <img
              src={skuInput.productImageUrl}
              alt={skuInput.productName}
              className="h-72 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500">
              {t('productPage')}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">{skuInput.brandName}</p>
            <h2 className="text-2xl font-bold text-gray-900">{skuInput.productName}</h2>
            <p className="mt-1 text-sm text-gray-600">{skuInput.category}</p>
          </div>

          <div className="grid gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">{t('keyIngredients')}:</span> {skuInput.ingredients}
            </p>
            <p>
              <span className="font-semibold">{t('productDescription')}:</span> {skuInput.description}
            </p>
            <p>
              <span className="font-semibold">{t('productSize')}:</span> {skuInput.productSize}
            </p>
            <p>
              <span className="font-semibold">{t('expectedRetailPrice')}:</span> ${skuInput.expectedRetailPrice.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">{t('plannedProductionQuantity')}:</span> {skuInput.plannedProductionQuantity ?? '—'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddMetrics({ ctaClicks: 1, waitlistSignups: 1 })}
            className="w-full btn-primary"
          >
            {skuInput.ctaType}
          </button>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('joinWaitlistPlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t('submit')}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {messageCards.map((messageCard) => (
          <article key={messageCard.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{messageCard.title}</p>
            <p className="mt-3 min-h-16 text-sm leading-6 text-gray-800">{messageCard.text}</p>
            <button
              type="button"
              onClick={() => onAddMetrics({ [messageCard.key]: 1 })}
              className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              I like this
            </button>
            <p className="mt-3 text-sm text-gray-600">{t('clicks')}: {messageCard.likes}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onViewDashboard}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          {t('viewDashboard')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {t('resetTest')}
        </button>
      </div>
    </div>
  );
}

export default ProductPreview;
