import { useLocale } from '../LocaleProvider';

interface HomeGatewayProps {
  onOpenAdmin: () => void;
  onOpenBrand: () => void;
}

function HomeGateway({ onOpenAdmin, onOpenBrand }: HomeGatewayProps) {
  const { t } = useLocale();

  return (
    <main className="flex min-h-[calc(100vh-0px)] items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="space-y-4 text-center">
            <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              SKU Validation
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {t('homeGatewayTitle')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              {t('homeGatewaySubtitle')}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="group flex min-h-72 flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-left text-white transition-transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">{t('managerPortal')}</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">{t('openManagementConsole')}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{t('managerPortalText')}</p>
              </div>
              <span className="mt-8 inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white">
                {t('accessDashboard')}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenBrand}
              className="group flex min-h-72 flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-left transition-transform hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{t('brandOperatorPortal')}</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900">{t('openBrandPortal')}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{t('brandOperatorPortalText')}</p>
              </div>
              <span className="mt-8 inline-flex w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                {t('startBrandExperience')}
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomeGateway;