import { useLocale } from '../LocaleProvider';

interface LandingProps {
  onStart: () => void;
  onLoadSample: () => void;
}

function Landing({ onStart, onLoadSample }: LandingProps) {
  const { t } = useLocale();
  
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="hero">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20 md:py-32 px-6 md:px-8">
          {/* Hero Image */}
          <div className="order-2 md:order-1">
            <img
              src="/SKU-Validation/images/hero-placeholder.svg"
              alt="K-Beauty Validator"
              className="w-full rounded-lg"
            />
          </div>
          
          {/* Hero Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div className="space-y-4">
              <p className="caption text-blue-600 font-semibold">
                {t('subtitle')}
              </p>
              <h1 className="hero-title">
                K-Beauty<br />SKU Launch Validator
              </h1>
              <p className="body-large max-w-lg">
                {t('problemText')}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStart}
                className="btn-primary"
              >
                {t('createSkuTest')}
              </button>
              <button
                onClick={onLoadSample}
                className="btn-secondary"
              >
                {t('loadSample')}
              </button>
            </div>
            
            <p className="body-small text-gray-500 pt-4">
              {t('exampleGuideLandingHint')}
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition - Single Focus */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="section-title mb-4">{t('solution')}</h2>
              <p className="body-large text-gray-700">
                {t('solutionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - Clear, Simple Flow */}
      <section className="section-spacing bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-title mb-16 text-center">{t('step1')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-2xl">
                  1
                </div>
              </div>
              <h3 className="subsection-title">
                Generate Ideas
              </h3>
              <p className="body-regular">
                브랜드의 성분과 카테고리를 바탕으로 테스트 가능한 SKU 후보 3개를 생성합니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-2xl">
                  2
                </div>
              </div>
              <h3 className="subsection-title">
                Measure Response
              </h3>
              <p className="body-regular">
                가상 상세페이지와 CTA로 초기 소비자 반응을 측정합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-2xl">
                  3
                </div>
              </div>
              <h3 className="subsection-title">
                Make Decision
              </h3>
              <p className="body-regular">
                Demand Score와 Production Risk를 바탕으로 양산 의사결정을 돕습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title mb-12 text-center">{t('output')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="subsection-title text-blue-600">명확한 데이터</h3>
              <p className="body-regular">
                {t('outputText')}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="subsection-title text-blue-600">빠른 검증</h3>
              <p className="body-regular">
                시간이 제한된 의사결정 과정을 가속화합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="section-title mb-4">준비되셨나요?</h2>
            <p className="body-large text-gray-600">
              지금 바로 시작하여 당신의 SKU 아이디어를 검증해보세요.
            </p>
          </div>
          <button
            onClick={onStart}
            className="btn-primary mx-auto"
          >
            {t('createSkuTest')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
