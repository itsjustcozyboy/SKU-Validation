import { DemandResult, SkuInput, TestMetrics } from '../types';
import { useLocale } from '../LocaleProvider';

interface ReportProps {
  skuInput: SkuInput;
  metrics: TestMetrics;
  demandResult: DemandResult;
  onBackToDashboard: () => void;
  onReset: () => void;
}

function Report({ skuInput, metrics, demandResult, onBackToDashboard, onReset }: ReportProps) {
  const { t } = useLocale();

  function getProductionRisk(score: number): { label: string; description: string } {
    if (score < 40) {
      return { label: 'High', description: 'High — Currently high overproduction risk. Collect more data or refine concept.' };
    }
    if (score < 55) {
      return { label: 'Medium', description: 'Medium — Needs concept, messaging, or price refinement.' };
    }
    return { label: 'Low', description: 'Low — Safe to proceed with small-batch or buyer validation.' };
  }

  function getLaunchDecision(score: number): string {
    if (score < 40) return 'Hold Production';
    if (score < 55) return 'Retest After Revision';
    if (score < 70) return 'Small-Batch Test Recommended';
    return 'Buyer Validation Ready';
  }

  const productionRisk = getProductionRisk(demandResult.demandScore);
  const launchDecision = getLaunchDecision(demandResult.demandScore);

  const winnerMessage = (() => {
    const likes = { A: metrics.messageALikes, B: metrics.messageBLikes, C: metrics.messageCLikes };
    const maxLikes = Math.max(...Object.values(likes));
    if (maxLikes === 0) return 'No clear winner yet';
    if (likes.A === maxLikes) return `Message A (${likes.A} likes)`;
    if (likes.B === maxLikes) return `Message B (${likes.B} likes)`;
    return `Message C (${likes.C} likes)`;
  })();

  const demandLevel = demandResult.demandScore < 40 ? 'Weak' : demandResult.demandScore < 55 ? 'Moderate' : demandResult.demandScore < 70 ? 'Strong' : 'Very Strong';

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{t('preProductionReportTitle')}</h1>
        <p className="mt-2 text-slate-600">{t('disclaimer')}</p>
      </div>

      {/* SKU Summary */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">1. SKU Summary</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Brand</p>
            <p className="mt-1 font-semibold text-slate-900">{skuInput.brandName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Product Name</p>
            <p className="mt-1 font-semibold text-slate-900">{skuInput.productName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Category</p>
            <p className="mt-1 font-semibold text-slate-900">{skuInput.category}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Target Consumer</p>
            <p className="mt-1 font-semibold text-slate-900">{skuInput.targetConsumer}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Expected Price</p>
            <p className="mt-1 font-semibold text-slate-900">${skuInput.expectedRetailPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Planned Production</p>
            <p className="mt-1 font-semibold text-slate-900">{skuInput.plannedProductionQuantity ?? '—'} units</p>
          </div>
        </div>
      </section>

      {/* Consumer Response Signals */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">2. Consumer Response Signals</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Page Views</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{metrics.pageViews}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">CTA Clicks</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{metrics.ctaClicks}</p>
            <p className="mt-1 text-xs text-slate-600">({Math.round((metrics.ctaClicks / Math.max(metrics.pageViews, 1)) * 100)}% CTR)</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Waitlist Signups</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{metrics.waitlistSignups}</p>
            <p className="mt-1 text-xs text-slate-600">({Math.round((metrics.waitlistSignups / Math.max(metrics.ctaClicks, 1)) * 100)}% conversion)</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Message Preference</p>
            <p className="mt-1 text-sm text-slate-900">A: {metrics.messageALikes} | B: {metrics.messageBLikes} | C: {metrics.messageCLikes}</p>
          </div>
        </div>
      </section>

      {/* Demand Score */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">3. Demand Score</h2>
        <div className="flex items-end gap-6">
          <div>
            <p className="text-sm text-slate-600">Score</p>
            <p className="mt-2 text-6xl font-bold text-slate-900">{Math.round(demandResult.demandScore)}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">/ 100</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600">Level</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{demandLevel} Demand</p>
            <p className="mt-2 text-sm text-slate-600">{demandResult.demandLevel}</p>
          </div>
        </div>
      </section>

      {/* Winning Message */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">4. Winning Positioning Message</h2>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">{winnerMessage}</p>
          <p className="mt-2 text-sm text-slate-600">
            This message generated the most consumer engagement. Consider featuring this as your lead messaging in production marketing.
          </p>
        </div>
      </section>

      {/* Production Risk */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">5. Production Risk</h2>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">{productionRisk.label}</p>
          <p className="mt-2 text-sm text-slate-600">{productionRisk.description}</p>
        </div>
      </section>

      {/* Launch Decision */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">6. Launch Decision</h2>
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="font-semibold text-blue-900">{launchDecision}</p>
          <p className="mt-2 text-sm text-blue-800">
            Based on demand score and current production considerations, this is the recommended next step.
          </p>
        </div>
      </section>

      {/* Recommended Next Actions */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">7. Recommended Next Actions</h2>
        <ul className="space-y-3">
          {demandResult.demandScore < 55 && (
            <>
              <li className="flex gap-3">
                <span className="text-slate-600">→</span>
                <span className="text-slate-700">Refine message and retest with updated positioning</span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-600">→</span>
                <span className="text-slate-700">Test price sensitivity with adjusted price points</span>
              </li>
            </>
          )}
          {demandResult.demandScore >= 55 && (
            <>
              <li className="flex gap-3">
                <span className="text-slate-600">→</span>
                <span className="text-slate-700">Proceed with small-batch production for inventory validation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-600">→</span>
                <span className="text-slate-700">Prepare buyer pitch deck with this validation data</span>
              </li>
            </>
          )}
          <li className="flex gap-3">
            <span className="text-slate-600">→</span>
            <span className="text-slate-700">Use winning message in pre-launch marketing materials</span>
          </li>
        </ul>
      </section>

      {/* Sustainability Insight */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">8. Sustainability Insight</h2>
        <p className="text-sm text-slate-700">
          By validating consumer demand before mass production, you help reduce overproduction risk and unnecessary inventory waste in the beauty industry.
        </p>
        <p className="mt-2 text-xs text-slate-600">This is a soft language insight and does not calculate actual emissions or guarantee waste reduction.</p>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          {t('backToDashboard')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
        >
          {t('resetTest')}
        </button>
      </div>
    </div>
  );
}

export default Report;
