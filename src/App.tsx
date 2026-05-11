import { useCallback, useEffect, useMemo, useState } from 'react';
import HomeGateway from './components/HomeGateway';
import SkuHypothesisGenerator from './components/SkuHypothesisGenerator';
import Report from './components/Report';
import SkuForm from './components/SkuForm';
import Header from './components/Header';
import AdminShell from './components/admin/AdminShell';
import AdminDashboardHome from './components/admin/AdminDashboardHome';
import AdminProductPreview from './components/admin/AdminProductPreview';
import CustomerProductPage from './components/customer/CustomerProductPage';
import { AppStep, SkuHypothesis, SkuInput, TestMetrics } from './types';
import { calculateDemandResult } from './utils/demandEngine';
import { samplePdrnCream } from './utils/sampleData';

const initialMetrics: TestMetrics = {
  pageViews: 0,
  ctaClicks: 0,
  waitlistSignups: 0,
  messageALikes: 0,
  messageBLikes: 0,
  messageCLikes: 0,
};

const basePath = (() => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const pathname = window.location.pathname;

  if (pathname.startsWith('/SKU-Validation/docs/')) {
    return '/SKU-Validation/docs/';
  }

  if (pathname.startsWith('/SKU-Validation/')) {
    return '/SKU-Validation/';
  }

  return '/';
})();

function getPortalFromPath(pathname: string): 'home' | 'admin' | 'customer' {
  const normalizedPath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname.replace(/^\/+/, '');
  const [portal] = normalizedPath.split('/').filter(Boolean).slice(-1);

  if (portal === 'admin') {
    return 'admin';
  }

  if (portal === 'customer') {
    return 'customer';
  }

  return 'home';
}

function getPortalUrl(portal: 'home' | 'admin' | 'customer') {
  if (portal === 'home') {
    return basePath;
  }

  return `${basePath}${portal}`;
}

function App() {
  const [portal, setPortal] = useState<'home' | 'admin' | 'customer'>('home');
  const [adminStep, setAdminStep] = useState<AppStep>('dashboard');
  const [skuInput, setSkuInput] = useState<SkuInput>(samplePdrnCream);
  const [metrics, setMetrics] = useState<TestMetrics>(initialMetrics);

  useEffect(() => {
    const syncPortalFromLocation = () => {
      setPortal(getPortalFromPath(window.location.pathname));
    };

    syncPortalFromLocation();
    window.addEventListener('popstate', syncPortalFromLocation);

    return () => window.removeEventListener('popstate', syncPortalFromLocation);
  }, []);

  const resetTestState = useCallback(() => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
  }, []);

  const openPortal = useCallback((nextPortal: 'home' | 'admin' | 'customer') => {
    window.history.pushState({}, '', getPortalUrl(nextPortal));
    setPortal(nextPortal);
  }, []);

  const resetAdminFlow = () => {
    setAdminStep('dashboard');
    resetTestState();
  };

  const openAdminConsole = () => {
    openPortal('admin');
    resetTestState();
    setAdminStep('dashboard');
  };

  const openCustomerWeb = () => {
    openPortal('customer');
    resetTestState();
  };

  const returnHome = () => {
    openPortal('home');
  };

  const loadAdminSample = () => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setAdminStep('form');
  };

  const handleUseHypothesis = (hypo: SkuHypothesis) => {
    const input: SkuInput = {
      brandName: hypo.name.split(' ')[0] || hypo.name,
      productName: hypo.name,
      category: skuInput.category || 'Cream',
      targetConsumer: hypo.targetConsumer || 'K-beauty enthusiasts',
      ingredients: hypo.heroIngredients,
      description: hypo.productConcept,
      expectedRetailPrice: hypo.recommendedPrice,
      productSize: hypo.recommendedSize,
      productImageUrl: '',
      plannedProductionQuantity: skuInput.plannedProductionQuantity ?? 1000,
      messageA: hypo.positioningMessage,
      messageB: '',
      messageC: '',
      ctaType: 'Join waitlist',
    };

    setSkuInput(input);
    setMetrics(initialMetrics);
    setAdminStep('form');
  };

  const addMetrics = useCallback((delta: Partial<TestMetrics>) => {
    setMetrics((prev) => ({
      pageViews: prev.pageViews + (delta.pageViews ?? 0),
      ctaClicks: prev.ctaClicks + (delta.ctaClicks ?? 0),
      waitlistSignups: prev.waitlistSignups + (delta.waitlistSignups ?? 0),
      messageALikes: prev.messageALikes + (delta.messageALikes ?? 0),
      messageBLikes: prev.messageBLikes + (delta.messageBLikes ?? 0),
      messageCLikes: prev.messageCLikes + (delta.messageCLikes ?? 0),
    }));
  }, []);

  const handleFormSubmit = (input: SkuInput) => {
    setSkuInput(input);
    setMetrics(initialMetrics);
    setAdminStep('preview');
  };

  const demandResult = useMemo(() => calculateDemandResult(skuInput, metrics), [skuInput, metrics]);

  return (
    <div className="min-h-screen bg-slate-50">
      {portal === 'home' && <HomeGateway onOpenAdmin={openAdminConsole} onOpenCustomer={openCustomerWeb} />}

      {portal !== 'home' && (
        <Header
          onGoHome={returnHome}
          activePortal={portal}
          portalTitle={portal === 'customer' ? `${skuInput.brandName} — ${skuInput.productName}` : undefined}
        />
      )}

      {portal === 'customer' && (
        <CustomerProductPage skuInput={skuInput} onAddMetrics={addMetrics} />
      )}

      {portal === 'admin' && (
        <AdminShell activeStep={adminStep} onSetStep={(s) => setAdminStep(s)}>
          {adminStep === 'hypothesis' && <SkuHypothesisGenerator onUseHypothesis={handleUseHypothesis} />}

          {adminStep === 'form' && (
            <SkuForm
              initialValue={skuInput}
              onSubmit={handleFormSubmit}
              onLoadSample={loadAdminSample}
              onReset={resetAdminFlow}
            />
          )}

          {adminStep === 'preview' && (
            <AdminProductPreview
              skuInput={skuInput}
              metrics={metrics}
              onAddMetrics={addMetrics}
              onViewDashboard={() => setAdminStep('dashboard')}
              onOpenCustomerWeb={openCustomerWeb}
            />
          )}

          {adminStep === 'dashboard' && (
            <AdminDashboardHome
              skuInput={skuInput}
              metrics={metrics}
              demandResult={demandResult}
              onCreateSkuHypothesis={() => setAdminStep('hypothesis')}
              onBuildSkuTest={() => setAdminStep('form')}
              onLoadSample={loadAdminSample}
              onViewReport={() => setAdminStep('report')}
              onOpenCustomerWeb={openCustomerWeb}
            />
          )}

          {adminStep === 'report' && (
            <Report
              skuInput={skuInput}
              metrics={metrics}
              demandResult={demandResult}
              onBackToDashboard={() => setAdminStep('dashboard')}
              onReset={resetAdminFlow}
            />
          )}
        </AdminShell>
      )}
    </div>
  );
}

export default App;
