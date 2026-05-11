import { useLocale } from '../LocaleProvider';

interface HomeGatewayProps {
  onOpenAdmin: () => void;
  onOpenCustomer: () => void;
}

function HomeGateway({ onOpenAdmin, onOpenCustomer }: HomeGatewayProps) {
  const { t } = useLocale();

  return (
    <main className="flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              {t('homeHeroTitle')}
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
              {t('homeHeroSubtitle')}
            </p>
          </div>
        </section>

        {/* Two Portal Cards */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Admin Web Card */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
            <div className="space-y-4">
              <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {t('adminPortal')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {t('homeAdminCardTitle')}
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                {t('homeAdminCardDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {t('homeAdminCardBtn')}
            </button>
          </div>

          {/* Customer Web Card */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
            <div className="space-y-4">
              <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {t('customerPortal')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {t('homeCustomerCardTitle')}
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                {t('homeCustomerCardDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCustomer}
              className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t('homeCustomerCardBtn')}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomeGateway;