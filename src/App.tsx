import { useCallback, useEffect, useMemo, useState } from 'react';
import HomeGateway from './components/HomeGateway';
import SkuHypothesisGenerator from './components/SkuHypothesisGenerator';
import Report from './components/Report';
import SkuForm from './components/SkuForm';
import Header from './components/Header';
import AdminShell from './components/admin/AdminShell';
import AdminDashboardHome from './components/admin/AdminDashboardHome';
import AdminProductPreview from './components/admin/AdminProductPreview';
import CustomerLandingPage from './components/customer/CustomerLandingPage';
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

function getPortalFromPath(pathname: string): 'home' | 'admin' | 'brand' {
  const normalizedPath = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname.replace(/^\/+/, '');
  const [portal] = normalizedPath.split('/').filter(Boolean).slice(-1);

  if (portal === 'admin') {
    return 'admin';
  }

  if (portal === 'brand' || portal === 'customer') {
    return 'brand';
  }

  return 'home';
}

function getPortalUrl(portal: 'home' | 'admin' | 'brand') {
  if (portal === 'home') {
    return basePath;
  }

  return `${basePath}${portal}`;
}

function App() {
  const [portal, setPortal] = useState<'home' | 'admin' | 'brand'>('home');
  const [adminStep, setAdminStep] = useState<AppStep>('dashboard');
  const [brandStep, setBrandStep] = useState<'landing' | 'preview'>('landing');
  const [skuInput, setSkuInput] = useState<SkuInput>(samplePdrnCream);
  const [selectedHypothesis, setSelectedHypothesis] = useState<SkuHypothesis | null>(null);
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
    setSelectedHypothesis(null);
  }, []);

  const openPortal = useCallback((nextPortal: 'home' | 'admin' | 'brand') => {
    window.history.pushState({}, '', getPortalUrl(nextPortal));
    setPortal(nextPortal);
  }, []);

  const resetAdminFlow = () => {
    setAdminStep('dashboard');
    resetTestState();
  };

  // customer flow reset is handled when navigating to customer or home

  const openAdminConsole = () => {
    openPortal('admin');
    resetTestState();
    setAdminStep('dashboard');
  };

  const openBrandPortal = () => {
    openPortal('brand');
    resetTestState();
    setBrandStep('landing');
  };

  const returnHome = () => {
    openPortal('home');
  };

  const loadSample = () => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setBrandStep('preview');
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
    setSelectedHypothesis(hypo);
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

  // simulation helper removed from App-level; use dashboard controls

  const demandResult = useMemo(() => calculateDemandResult(skuInput, metrics), [skuInput, metrics]);

  return (
    <div className="min-h-screen bg-slate-50">
      {portal === 'home' && <HomeGateway onOpenAdmin={openAdminConsole} onOpenBrand={openBrandPortal} />}

      {portal !== 'home' && (
        <Header
          onGoHome={returnHome}
          onOpenAdmin={portal === 'admin' ? openAdminConsole : undefined}
          onOpenBrand={portal === 'admin' ? openBrandPortal : undefined}
          activePortal={portal}
          brandTitle={portal === 'brand' ? `${skuInput.brandName} — ${skuInput.productName}` : undefined}
        />
      )}

      {portal === 'brand' && (
        <>
          {brandStep === 'landing' && (
            <CustomerLandingPage onStart={loadSample} onLoadSample={loadSample} />
          )}

          {brandStep === 'preview' && (
            <CustomerProductPage skuInput={skuInput} onAddMetrics={addMetrics} />
          )}
        </>
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
            />
          )}

          {adminStep === 'dashboard' && (
            <AdminDashboardHome
              skuInput={skuInput}
              metrics={metrics}
              onCreateSkuHypothesis={() => setAdminStep('hypothesis')}
              onBuildSkuTest={() => setAdminStep('form')}
              onLoadSample={loadAdminSample}
              onOpenBrandPreview={() => {
                openBrandPortal();
                setBrandStep('preview');
              }}
            />
          )}

          {adminStep === 'report' && (
            <Report
              skuInput={skuInput}
              metrics={metrics}
              demandResult={demandResult}
              selectedHypothesis={selectedHypothesis}
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
