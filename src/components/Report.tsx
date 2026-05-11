import { DemandResult, SkuHypothesis, SkuInput, TestMetrics } from '../types';
import { useLocale } from '../LocaleProvider';

interface ReportProps {
  skuInput: SkuInput;
  metrics: TestMetrics;
  demandResult: DemandResult;
  selectedHypothesis?: SkuHypothesis | null;
  onBackToDashboard: () => void;
  onReset: () => void;
}

function Report({ skuInput, metrics, demandResult, selectedHypothesis, onBackToDashboard, onReset }: ReportProps) {
  const { t } = useLocale();
  const strongestMessageInsight =
    metrics.messageALikes === 0 && metrics.messageBLikes === 0 && metrics.messageCLikes === 0
      ? 'No clear message winner yet. Run more simulated or manual interactions to identify a top message.'
      : `The strongest message was "${demandResult.winningMessage}." This suggests U.S. consumers may respond better to this positioning style for ${skuInput.targetConsumer.toLowerCase()}.`;

  const priceInsight =
    skuInput.expectedRetailPrice > 35
      ? 'The expected retail price may be high for first-time purchase. Consider a trial size under $19.99.'
      : 'The current price point is likely testable, but continue validating value perception in future tests.';

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">{t('preProductionReportTitle')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('disclaimer')}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">1. Overall Demand Score</h3>
        <p className="text-sm text-gray-700">
          This SKU scored <span className="font-semibold">{demandResult.demandScore}/100</span>, which indicates{' '}
          <span className="font-semibold">{demandResult.demandLevel.toLowerCase()}</span>.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">2. Best Performing Positioning Message</h3>
        <p className="text-sm text-gray-700">{strongestMessageInsight}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{t('skuConceptLearningTitle')}</h3>
        <p className="text-sm text-gray-700">{selectedHypothesis?.conceptType ?? 'N/A'}</p>
        <p className="text-sm text-gray-700">{t('skuConceptLearningDesc')}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">3. Price Sensitivity Insight</h3>
        <p className="text-sm text-gray-700">{priceInsight}</p>
        <p className="text-sm text-gray-700">{demandResult.priceInsight}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{t('productionDecision')}</h3>
        <p className="text-sm text-gray-700">Planned production quantity: {skuInput.plannedProductionQuantity ?? '—'}</p>
        <p className="text-sm text-gray-700">Demand score: {demandResult.demandScore}</p>
        <p className="text-sm text-gray-700">Production risk level: {demandResult.productionRiskLevel}</p>
        <p className="text-sm text-gray-700">Launch decision: {demandResult.launchDecision}</p>
        <p className="text-sm text-gray-700">Recommended first production approach:</p>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {demandResult.suggestedSkuAdjustment && demandResult.suggestedSkuAdjustment.length > 0 ? (
            demandResult.suggestedSkuAdjustment.map((s) => <li key={s}>{s}</li>)
          ) : (
            <li>Consider a small-batch or trial-size launch to reduce inventory risk.</li>
          )}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{t('sustainabilitySectionTitle')}</h3>
        <p className="text-sm text-gray-700">{demandResult.sustainabilityInsight}</p>
        <p className="mt-2 text-xs text-gray-500">This insight uses soft language and does not calculate emissions or guarantee waste reduction.</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">4. Consumer Intent Signals</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Total page views: {metrics.pageViews}</li>
          <li>CTA clicks: {metrics.ctaClicks} ({demandResult.ctaClickRate}%)</li>
          <li>Waitlist signups: {metrics.waitlistSignups} ({demandResult.signupConversionRate}%)</li>
          <li>
            Positioning likes: A {metrics.messageALikes} / B {metrics.messageBLikes} / C {metrics.messageCLikes}
          </li>
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">5. Recommended Next Action</h3>
        <p className="text-sm text-gray-700">{demandResult.recommendation}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
          {demandResult.nextActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {t('backToDashboard')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          {t('resetTest')}
        </button>
      </div>
    </div>
  );
}

export default Report;
