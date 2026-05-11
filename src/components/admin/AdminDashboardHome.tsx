import { TestMetrics, SkuInput } from '../../types';
import { useLocale } from '../../LocaleProvider';

interface Props {
  metrics: TestMetrics;
  skuInput: SkuInput;
  onCreateSkuHypothesis: () => void;
  onBuildSkuTest: () => void;
  onLoadSample: () => void;
  onOpenBrandPreview: () => void;
}

export default function AdminDashboardHome({ metrics, skuInput, onCreateSkuHypothesis, onBuildSkuTest, onLoadSample, onOpenBrandPreview }: Props) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Pre-production SKU validation workspace</h2>
          <p className="text-sm text-slate-600">{t('simulatedDashboardTitle')}</p>
        </div>
        <div className="space-x-2">
          <button onClick={onOpenBrandPreview} className="rounded-lg border px-3 py-2">{t('openCustomerWeb')}</button>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">This is simulated/local data</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Page views</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.pageViews}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">CTA clicks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.ctaClicks}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Waitlist signups</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.waitlistSignups}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Message A likes</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{metrics.messageALikes}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Message B likes</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{metrics.messageBLikes}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Message C likes</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{metrics.messageCLikes}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCreateSkuHypothesis} className="btn-primary">{t('generate3Hypotheses')}</button>
        <button onClick={onBuildSkuTest} className="btn-secondary">{t('skuBuilderTitle')}</button>
        <button onClick={onLoadSample} className="btn-ghost">{t('loadSample')}</button>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">Current SKU</h3>
        <p className="mt-2 text-sm text-slate-600">{skuInput.brandName} — {skuInput.productName}</p>
      </div>
    </div>
  );
}
