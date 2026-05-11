import { useCallback, useEffect, useMemo, useState } from 'react';
import HomeGateway from './components/HomeGateway';
import Landing from './components/Landing';
import SkuHypothesisGenerator from './components/SkuHypothesisGenerator';
import ProductPreview from './components/ProductPreview';
import Report from './components/Report';
import SkuForm from './components/SkuForm';
import TestDashboard from './components/TestDashboard';
import Header from './components/Header';
import { AppStep, SkuInput, TestMetrics } from './types';
import { calculateDemandResult, simulateVisitors } from './utils/demandEngine';
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
  const [customerStep, setCustomerStep] = useState<'landing' | 'preview'>('landing');
  const [skuInput, setSkuInput] = useState<SkuInput>(samplePdrnCream);
  const [selectedHypothesis, setSelectedHypothesis] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<TestMetrics>(initialMetrics);

  useEffect(() => {
    const syncPortalFromLocation = () => {
      setPortal(getPortalFromPath(window.location.pathname));
    };

    syncPortalFromLocation();
    window.addEventListener('popstate', syncPortalFromLocation);

    return () => window.removeEventListener('popstate', syncPortalFromLocation);
  }, []);

  const resetAdminFlow = () => {
    setAdminStep('dashboard');
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setSelectedHypothesis(null);
  };

  const resetCustomerFlow = () => {
    setCustomerStep('landing');
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setSelectedHypothesis(null);
  };

  const openAdminConsole = () => {
    window.history.pushState({}, '', getPortalUrl('admin'));
    setPortal('admin');
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setSelectedHypothesis(null);
    setAdminStep('dashboard');
  };

  const openCustomerWeb = () => {
    window.history.pushState({}, '', getPortalUrl('customer'));
    setPortal('customer');
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setSelectedHypothesis(null);
    setCustomerStep('landing');
  };

  const returnHome = () => {
    window.history.pushState({}, '', getPortalUrl('home'));
    setPortal('home');
  };

  const loadSample = () => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setCustomerStep('preview');
  };

  const loadAdminSample = () => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setAdminStep('form');
  };

  const handleUseHypothesis = (hypo: any) => {
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

  const handleSimulateVisitors = () => {
    addMetrics(simulateVisitors(skuInput, 100));
  };

  const demandResult = useMemo(() => calculateDemandResult(skuInput, metrics), [skuInput, metrics]);

  return (
    <div className="min-h-screen bg-slate-50">
      {portal === 'home' && <HomeGateway onOpenAdmin={openAdminConsole} onOpenCustomer={openCustomerWeb} />}

      {portal !== 'home' && (
        <Header
          onGoHome={returnHome}
          onOpenAdmin={openAdminConsole}
          onOpenCustomer={openCustomerWeb}
          activePortal={portal}
        />
      )}

      {portal === 'customer' && (
        <>
          {customerStep === 'landing' && (
            <Landing onStart={loadSample} onLoadSample={loadSample} />
          )}

          {customerStep === 'preview' && (
            <ProductPreview
              skuInput={skuInput}
              metrics={metrics}
              onAddMetrics={addMetrics}
              experienceMode="customer"
              onReset={resetCustomerFlow}
            />
          )}
        </>
      )}

      {portal === 'admin' && (
        <>
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
            <ProductPreview
              skuInput={skuInput}
              metrics={metrics}
              onAddMetrics={addMetrics}
              experienceMode="admin"
              onViewDashboard={() => setAdminStep('dashboard')}
              onReset={resetAdminFlow}
            />
          )}

          {adminStep === 'dashboard' && (
            <TestDashboard
              skuInput={skuInput}
              metrics={metrics}
              demandResult={demandResult}
              onSimulateVisitors={handleSimulateVisitors}
              onViewReport={() => setAdminStep('report')}
              onBackToPreview={() => setAdminStep('preview')}
              onReset={resetAdminFlow}
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
        </>
      )}
    </div>
  );
}

export default App;
