import { TestMetrics, SkuInput, DemandResult } from '../../types';
import { useLocale } from '../../LocaleProvider';

interface Props {
  metrics: TestMetrics;
  skuInput: SkuInput;
  demandResult: DemandResult;
  onCreateSkuHypothesis: () => void;
  onBuildSkuTest: () => void;
  onLoadSample: () => void;
  onViewReport: () => void;
  onOpenCustomerWeb: () => void;
}

function getProductionRisk(score: number): { label: string; description: string; color: string } {
  if (score < 40) {
    return { label: 'High', description: 'Currently high overproduction risk', color: 'bg-red-50 text-red-700' };
  }
  if (score < 55) {
    return { label: 'Medium', description: 'Needs concept or messaging refinement', color: 'bg-amber-50 text-amber-700' };
  }
  return { label: 'Low', description: 'Ready for small-batch or buyer validation', color: 'bg-green-50 text-green-700' };
}

function getLaunchDecision(score: number): { label: string; description: string } {
  if (score < 40) {
    return { label: 'Hold Production', description: 'Collect more data or refine concept' };
  }
  if (score < 55) {
    return { label: 'Retest After Revision', description: 'Modify concept, messaging, or price' };
  }
  if (score < 70) {
    return { label: 'Small-Batch Test Recommended', description: 'Proceed with limited production' };
  }
  return { label: 'Buyer Validation Ready', description: 'Present to buyers with confidence' };
}

function getCtaClickRate(metrics: TestMetrics): number {
  if (metrics.pageViews === 0) return 0;
  return Math.round((metrics.ctaClicks / metrics.pageViews) * 100);
}

function getSignupConversionRate(metrics: TestMetrics): number {
  if (metrics.ctaClicks === 0) return 0;
  return Math.round((metrics.waitlistSignups / metrics.ctaClicks) * 100);
}

export default function AdminDashboardHome({
  metrics,
  skuInput,
  demandResult,
  onCreateSkuHypothesis,
  onBuildSkuTest,
  onLoadSample,
  onViewReport,
  onOpenCustomerWeb,
}: Props) {
  const { t } = useLocale();
  const productionRisk = getProductionRisk(demandResult.demandScore);
  const launchDecision = getLaunchDecision(demandResult.demandScore);
  const ctaClickRate = getCtaClickRate(metrics);
  const signupRate = getSignupConversionRate(metrics);

  const winnerMessage = (() => {
    const likes = { A: metrics.messageALikes, B: metrics.messageBLikes, C: metrics.messageCLikes };
    const maxLikes = Math.max(...Object.values(likes));
    if (maxLikes === 0) return 'N/A';
    if (likes.A === maxLikes) return `Message A (${likes.A} likes)`;
    if (likes.B === maxLikes) return `Message B (${likes.B} likes)`;
    return `Message C (${likes.C} likes)`;
  })();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SKU Validation Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Current: {skuInput.brandName} — {skuInput.productName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenCustomerWeb}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('openCustomerWeb')}
          </button>
          <button
            onClick={onViewReport}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {t('viewReport')}
          </button>
        </div>
      </div>

      {/* Decision Summary (top) */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('launchDecision')}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{demandResult.launchDecision ?? launchDecision.label}</p>
          <p className="mt-2 text-sm text-slate-600">{demandResult.launchDecision ? demandResult.recommendation : launchDecision.description}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('demandScore')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{Math.round(demandResult.demandScore)}</p>
        </div>

        <div className={`rounded-lg border border-slate-200 p-6 ${productionRisk.color.replace('text', 'bg')}`}>
          <p className="text-sm font-medium">{t('productionRisk')}</p>
          <p className="mt-3 text-2xl font-bold">{demandResult.productionRiskLevel ?? productionRisk.label}</p>
          <p className="mt-2 text-xs whitespace-pre-line">{productionRisk.description}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('recommendedAction')}</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{demandResult.recommendation || '—'}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('pageViews')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{metrics.pageViews}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">CTA Clicks</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{metrics.ctaClicks}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('waitlistSignups')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{metrics.waitlistSignups}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">CTA Click Rate</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{ctaClickRate}%</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Signup Conversion Rate</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{signupRate}%</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('winningMessage')}</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{winnerMessage}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Message Preference</p>
          <div className="mt-3 space-y-1">
            <p className="text-sm text-slate-600">A: {metrics.messageALikes} | B: {metrics.messageBLikes} | C: {metrics.messageCLikes}</p>
          </div>
        </div>
      </div>

      {/* Critical Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Demand Score */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">{t('demandScore')}</p>
          <p className="mt-3 text-5xl font-bold text-slate-900">{Math.round(demandResult.demandScore)}</p>
          <p className="mt-2 text-xs text-slate-600">
            {demandResult.demandScore < 40 && 'Weak demand'}
            {demandResult.demandScore >= 40 && demandResult.demandScore < 55 && 'Moderate demand'}
            {demandResult.demandScore >= 55 && demandResult.demandScore < 70 && 'Strong demand'}
            {demandResult.demandScore >= 70 && 'Very strong demand'}
          </p>
        </div>

        {/* Production Risk */}
        <div className={`rounded-lg border border-slate-200 p-6 ${productionRisk.color.replace('text', 'bg')}`}>
          <p className="text-sm font-medium">{t('productionRisk')}</p>
          <p className="mt-3 text-3xl font-bold">{productionRisk.label}</p>
          <p className="mt-2 text-xs whitespace-pre-line">{productionRisk.description}</p>
        </div>

        {/* Launch Decision */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-600">{t('launchDecision')}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{launchDecision.label}</p>
          <p className="mt-2 text-sm text-slate-600">{launchDecision.description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCreateSkuHypothesis}
          className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          {t('generate3Hypotheses')}
        </button>
        <button
          onClick={onBuildSkuTest}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('skuBuilderTitle')}
        </button>
        <button
          onClick={onLoadSample}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('loadSample')}
        </button>
      </div>
    </div>
  );
}
