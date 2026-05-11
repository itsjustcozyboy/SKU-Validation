import { useLocale } from '../LocaleProvider';

interface LandingProps {
  onStart: () => void;
  onLoadSample: () => void;
  onOpenAdmin?: () => void;
}

function Landing({ onStart, onLoadSample, onOpenAdmin }: LandingProps) {
  const { t } = useLocale();
  
  return (
    <div className="w-full bg-white">
      <section className="hero">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:px-8 md:py-24">
          <div className="order-2 md:order-1">
            <img
              src="/images/hero-placeholder.svg"
              alt="K-Beauty Validator"
              className="w-full rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
            />
          </div>

          <div className="order-1 space-y-6 md:order-2">
            <div className="space-y-4">
              <p className="caption text-slate-500 font-semibold">
                {t('customerWeb')}
              </p>
              <h1 className="hero-title text-slate-950">
                {t('customerWebTitle')}
              </h1>
              <p className="body-large max-w-lg text-slate-600">
                {t('customerWebSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStart}
                className="btn-primary"
              >
                {t('startCustomerExperience')}
              </button>
              <button
                onClick={onLoadSample}
                className="btn-secondary"
              >
                {t('loadSample')}
              </button>
              {onOpenAdmin ? (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="btn-ghost"
                >
                  {t('adminConsole')}
                </button>
              ) : null}
            </div>

            <p className="body-small text-slate-500 pt-4">
              {t('customerJourneyText')}
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-4">
            <h2 className="section-title mb-2 text-center">{t('customerJourneyTitle')}</h2>
            <p className="body-large text-center text-slate-600">
              {t('customerJourneyText')}
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-semibold text-white">1</div>
              <h3 className="subsection-title">{t('customerStep1Title')}</h3>
              <p className="body-regular text-slate-600">{t('customerStep1Text')}</p>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-semibold text-white">2</div>
              <h3 className="subsection-title">{t('customerStep2Title')}</h3>
              <p className="body-regular text-slate-600">{t('customerStep2Text')}</p>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-semibold text-white">3</div>
              <h3 className="subsection-title">{t('customerStep3Title')}</h3>
              <p className="body-regular text-slate-600">{t('customerStep3Text')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title mb-12 text-center">{t('customerSignalsTitle')}</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="subsection-title text-slate-950">{t('customerSignalsCardTitle')}</h3>
              <p className="body-regular text-slate-600">
                {t('customerSignalsCardText')}
              </p>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="subsection-title text-slate-950">{t('customerSignalsCardTitle2')}</h3>
              <p className="body-regular text-slate-600">
                {t('customerSignalsCardText2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="section-title mb-4">{t('customerCtaTitle')}</h2>
            <p className="body-large text-slate-600">
              {t('customerCtaText')}
            </p>
          </div>
          <button
            onClick={onStart}
            className="btn-primary mx-auto"
          >
            {t('startCustomerExperience')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
