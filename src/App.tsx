import { useCallback, useMemo, useState } from 'react';
import Landing from './components/Landing';
import SkuHypothesisGenerator from './components/SkuHypothesisGenerator';
import ProductPreview from './components/ProductPreview';
import Report from './components/Report';
import SkuForm from './components/SkuForm';
import TestDashboard from './components/TestDashboard';
import Header from './components/Header';
import { AppStep, SkuInput, TestMetrics } from './types';
import { calculateDemandResult, simulateVisitors } from './utils/demandEngine';
import { emptySkuInput, samplePdrnCream } from './utils/sampleData';

const initialMetrics: TestMetrics = {
  pageViews: 0,
  ctaClicks: 0,
  waitlistSignups: 0,
  messageALikes: 0,
  messageBLikes: 0,
  messageCLikes: 0,
};

function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [skuInput, setSkuInput] = useState<SkuInput>(emptySkuInput);
  const [selectedHypothesis, setSelectedHypothesis] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<TestMetrics>(initialMetrics);

  const resetTest = () => {
    setStep('landing');
    setSkuInput(emptySkuInput);
    setMetrics(initialMetrics);
  };

  const loadSample = () => {
    setSkuInput(samplePdrnCream);
    setMetrics(initialMetrics);
    setStep('form');
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
    setStep('form');
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
    setStep('preview');
  };

  const handleSimulateVisitors = () => {
    addMetrics(simulateVisitors(skuInput, 100));
  };

  const handleGoHome = () => {
    setStep('landing');
  };

  const demandResult = useMemo(() => calculateDemandResult(skuInput, metrics), [skuInput, metrics]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onGoHome={handleGoHome} />
      {step === 'landing' && <Landing onStart={() => setStep('hypothesis')} onLoadSample={loadSample} />}

      {step === 'hypothesis' && <SkuHypothesisGenerator onUseHypothesis={handleUseHypothesis} />}

      {step === 'form' && (
        <SkuForm
          initialValue={skuInput}
          onSubmit={handleFormSubmit}
          onLoadSample={loadSample}
          onReset={resetTest}
        />
      )}

      {step === 'preview' && (
        <ProductPreview
          skuInput={skuInput}
          metrics={metrics}
          onAddMetrics={addMetrics}
          onViewDashboard={() => setStep('dashboard')}
          onReset={resetTest}
        />
      )}

      {step === 'dashboard' && (
        <TestDashboard
          skuInput={skuInput}
          metrics={metrics}
          demandResult={demandResult}
          onSimulateVisitors={handleSimulateVisitors}
          onViewReport={() => setStep('report')}
          onBackToPreview={() => setStep('preview')}
          onReset={resetTest}
        />
      )}

      {step === 'report' && (
        <Report
          skuInput={skuInput}
          metrics={metrics}
          demandResult={demandResult}
          selectedHypothesis={selectedHypothesis}
          onBackToDashboard={() => setStep('dashboard')}
          onReset={resetTest}
        />
      )}
    </div>
  );
}

export default App;
