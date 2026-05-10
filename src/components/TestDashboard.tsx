import { DemandResult, SkuInput, TestMetrics } from '../types';
import MetricCard from './MetricCard';
import { useLocale } from '../LocaleProvider';

interface TestDashboardProps {
  skuInput: SkuInput;
  metrics: TestMetrics;
  demandResult: DemandResult;
  onSimulateVisitors: () => void;
  onViewReport: () => void;
  onBackToPreview: () => void;
  onReset: () => void;
}

function TestDashboard({
  skuInput,
  metrics,
  demandResult,
  onSimulateVisitors,
  onViewReport,
  onBackToPreview,
  onReset,
}: TestDashboardProps) {
  const { t } = useLocale();
  const demandBadgeClass =
    demandResult.demandLevel === 'Strong demand signal'
      ? 'bg-gray-900 text-white'
      : demandResult.demandLevel === 'Moderate demand signal'
        ? 'bg-gray-700 text-white'
        : 'bg-gray-200 text-gray-800';

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('simulatedDashboardTitle')}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {skuInput.brandName} · {skuInput.productName} · {skuInput.category}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${demandBadgeClass}`}>
            {demandResult.demandLevel}
          </span>
        </div>

        <p className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700">
          {t('disclaimer')}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSimulateVisitors}
            className="btn-primary"
          >
            {t('simulateVisitors')}
          </button>
          <button
            type="button"
            onClick={onViewReport}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('viewReport')}
          </button>
          <button
            type="button"
            onClick={onBackToPreview}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('backToProductPage')}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('resetTest')}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label={t('demandScore')} value={demandResult.demandScore.toString()} />
        <MetricCard label={t('productionRisk')} value={demandResult.productionRiskLevel ?? '—'} />
        <MetricCard label={t('launchDecision')} value={demandResult.launchDecision ?? '—'} />
        <MetricCard label={t('winningMessage')} value={demandResult.winningMessage || '—'} />
        <MetricCard label={t('recommendedPriceDirection')} value={demandResult.recommendedPriceDirection ?? '—'} />
        <MetricCard label={t('sustainabilityInsight')} value={demandResult.sustainabilityInsight ?? '—'} />
      </section>

      <section className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{t('decisionSummary')}</h3>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Winning positioning message:</span> {demandResult.winningMessage}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Price feedback:</span> {demandResult.priceInsight}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Launch recommendation:</span> {demandResult.recommendation}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Page views:</span> {metrics.pageViews}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Demand score</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{demandResult.demandScore}</p>
          <p className="mt-2 text-sm text-gray-600">Score range: 0 to 100</p>
        </div>
      </section>
    </div>
  );
}

export default TestDashboard;
