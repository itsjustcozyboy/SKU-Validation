import CustomerProductPage from '../customer/CustomerProductPage';
import { SkuInput, TestMetrics } from '../../types';
import { useLocale } from '../../LocaleProvider';

interface Props {
  skuInput: SkuInput;
  metrics: TestMetrics;
  onAddMetrics: (delta: Partial<TestMetrics>) => void;
  onViewDashboard?: () => void;
}

export default function AdminProductPreview({ skuInput, metrics, onAddMetrics, onViewDashboard }: Props) {
  const { t } = useLocale();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-lg bg-white p-4 shadow-sm">
        <CustomerProductPage skuInput={skuInput} onAddMetrics={onAddMetrics} />
      </div>

      <aside className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">Admin Preview</h3>
        <div className="mt-3 text-sm text-slate-600">
          <p><strong>{t('plannedProductionQuantity')}:</strong> {skuInput.plannedProductionQuantity ?? '—'}</p>
          <p className="mt-2"><strong>{t('expectedRetailPrice')}:</strong> ${skuInput.expectedRetailPrice.toFixed(2)}</p>
          <p className="mt-2"><strong>{t('targetConsumer')}:</strong> {skuInput.targetConsumer}</p>
          <p className="mt-2"><strong>{t('generateProductPage')}:</strong> {skuInput.productSize}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{t('pageViews')}</p>
            <p className="mt-1 font-semibold text-slate-900">{metrics.pageViews}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{t('ctaClicks')}</p>
            <p className="mt-1 font-semibold text-slate-900">{metrics.ctaClicks}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {onViewDashboard ? (
            <button onClick={onViewDashboard} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white">{t('viewDashboard')}</button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
