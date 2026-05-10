import { useLocale } from '../LocaleProvider';

interface LandingProps {
  onStart: () => void;
  onLoadSample: () => void;
}

function Landing({ onStart, onLoadSample }: LandingProps) {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
          Validation MVP
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          K-Beauty SKU Launch Validator
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">{t('subtitle')}</p>
        <p className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700">
          {t('disclaimer')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStart}
            className="btn-primary"
          >
            {t('createSkuTest')}
          </button>
          <button
            type="button"
            onClick={onStart}
            className="btn-ghost"
          >
            {t('startSkuTest')}
          </button>
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('loadSample')}
          </button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{t('problem')}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{t('problemText')}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{t('solution')}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{t('solutionText')}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{t('output')}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{t('outputText')}</p>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
        <ol className="mt-3 space-y-2 text-sm text-gray-700">
          <li>{t('step1')}: 브랜드의 성분, 카테고리, 타깃 정보를 바탕으로 테스트 가능한 SKU 후보 3개를 생성합니다.</li>
          <li>{t('step2')}: 가상 상세페이지와 CTA로 초기 소비자 반응을 측정합니다.</li>
          <li>{t('step3')}: Demand Score와 Production Risk를 바탕으로 양산 의사결정을 돕습니다.</li>
        </ol>
      </section>
    </div>
  );
}

export default Landing;
