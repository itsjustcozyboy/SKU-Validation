import { useEffect, useRef, useState } from 'react';
import { SkuInput } from '../../types';
import { useLocale } from '../../LocaleProvider';

interface Props {
  skuInput: SkuInput;
  onAddMetrics: (delta: Partial<any>) => void;
}

export default function CustomerProductPage({ skuInput, onAddMetrics }: Props) {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<'A' | 'B' | 'C' | null>(null);
  const visitedRef = useRef(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [ctaVisited, setCtaVisited] = useState(false);

  useEffect(() => {
    const keyBase = `sku_${encodeURIComponent((skuInput.productName || skuInput.brandName || 'default').replace(/\s+/g, '_'))}`;
    const visitedKey = `${keyBase}_visited`;
    const ctaKey = `${keyBase}_ctaVisited`;
    const submittedKey = `${keyBase}_submitted`;
    const selectedKey = `${keyBase}_selected`;

    if (!sessionStorage.getItem(visitedKey)) {
      onAddMetrics({ pageViews: 1 });
      sessionStorage.setItem(visitedKey, '1');
      visitedRef.current = true;
    }

    if (sessionStorage.getItem(ctaKey)) setCtaVisited(true);
    if (sessionStorage.getItem(submittedKey)) setSubmitted(true);
    const sel = sessionStorage.getItem(selectedKey);
    if (sel === 'A' || sel === 'B' || sel === 'C') setSelectedMessage(sel as 'A' | 'B' | 'C');
  }, [onAddMetrics, skuInput.productName, skuInput.brandName]);

  const handleCtaClick = () => {
    const keyBase = `sku_${encodeURIComponent((skuInput.productName || skuInput.brandName || 'default').replace(/\s+/g, '_'))}`;
    const ctaKey = `${keyBase}_ctaVisited`;

    if (!sessionStorage.getItem(ctaKey)) {
      sessionStorage.setItem(ctaKey, '1');
      setCtaVisited(true);
      onAddMetrics({ ctaClicks: 1 });
    }

    setTimeout(() => {
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailRef.current?.focus();
    }, 100);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const keyBase = `sku_${encodeURIComponent((skuInput.productName || skuInput.brandName || 'default').replace(/\s+/g, '_'))}`;
    const submittedKey = `${keyBase}_submitted`;
    const ctaKey = `${keyBase}_ctaVisited`;

    if (sessionStorage.getItem(submittedKey)) return;

    if (!sessionStorage.getItem(ctaKey)) {
      sessionStorage.setItem(ctaKey, '1');
      setCtaVisited(true);
      onAddMetrics({ ctaClicks: 1 });
    }

    onAddMetrics({ waitlistSignups: 1 });
    sessionStorage.setItem(submittedKey, '1');
    setSubmitted(true);
    setEmail('');
  };

  const handleSelectMessage = (key: 'A' | 'B' | 'C') => {
    const keyBase = `sku_${encodeURIComponent((skuInput.productName || skuInput.brandName || 'default').replace(/\s+/g, '_'))}`;
    const selectedKey = `${keyBase}_selected`;
    if (sessionStorage.getItem(selectedKey)) return;
    sessionStorage.setItem(selectedKey, key);
    setSelectedMessage(key);
    if (key === 'A') onAddMetrics({ messageALikes: 1 });
    if (key === 'B') onAddMetrics({ messageBLikes: 1 });
    if (key === 'C') onAddMetrics({ messageCLikes: 1 });
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{skuInput.brandName}</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{skuInput.productName}</h1>
          <p className="mt-1 text-sm text-gray-600">{skuInput.category}</p>
        </div>
        <div className="ml-4">
          <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">현재 데이터: Simulated</span>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          {skuInput.productImageUrl ? (
            <img src={skuInput.productImageUrl} alt={skuInput.productName} className="w-full rounded-xl object-cover" />
          ) : (
            <div className="h-72 w-full rounded-xl bg-gradient-to-br from-pink-50 to-amber-50" />
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {skuInput.ingredients.split(',').map((ing) => (
              <span key={ing} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {ing.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">{t('productDescription')}</p>
            <p className="mt-2 text-gray-800">{skuInput.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
              <p className="text-xs text-gray-500">{t('productSize')}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{skuInput.productSize}</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
              <p className="text-xs text-gray-500">{t('expectedRetailPrice')}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">${skuInput.expectedRetailPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button type="button" onClick={handleCtaClick} className="w-full rounded-lg bg-rose-600 px-4 py-3 text-white">
              {skuInput.ctaType || t('joinWaitlist')}
            </button>

            <div className="mt-2">
              {!submitted ? (
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('joinWaitlistPlaceholder')}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
                  />
                  <button type="submit" className="rounded-lg bg-white px-4 py-2 border">{t('joinWaitlist')}</button>
                </form>
              ) : (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center text-rose-800">출시 알림 신청 완료</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <p className="text-sm font-medium text-gray-700">{t('whichMessageConvincing')}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <article className={`rounded-xl p-4 shadow-sm ${selectedMessage === 'A' ? 'ring-2 ring-rose-400' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">{t('positioningMessageA')}</p>
            <p className="mt-2 text-gray-800">{skuInput.messageA}</p>
            <button onClick={() => handleSelectMessage('A')} className="mt-3 text-sm text-rose-600">{t('iLikeThis')}</button>
          </article>

          <article className={`rounded-xl p-4 shadow-sm ${selectedMessage === 'B' ? 'ring-2 ring-rose-400' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">{t('positioningMessageB')}</p>
            <p className="mt-2 text-gray-800">{skuInput.messageB}</p>
            <button onClick={() => handleSelectMessage('B')} className="mt-3 text-sm text-rose-600">{t('iLikeThis')}</button>
          </article>

          <article className={`rounded-xl p-4 shadow-sm ${selectedMessage === 'C' ? 'ring-2 ring-rose-400' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">{t('positioningMessageC')}</p>
            <p className="mt-2 text-gray-800">{skuInput.messageC}</p>
            <button onClick={() => handleSelectMessage('C')} className="mt-3 text-sm text-rose-600">{t('iLikeThis')}</button>
          </article>
        </div>

        {selectedMessage && (
          <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">{t('thanksFeedback')}</div>
        )}
      </section>

      <footer className="mt-10 text-center text-sm text-gray-500">{t('customerFooterNote')}</footer>

      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 w-[90%] sm:hidden">
        <button onClick={handleCtaClick} className="w-full rounded-lg bg-rose-600 px-4 py-3 text-white" disabled={ctaVisited}>{skuInput.ctaType || t('joinWaitlist')}</button>
      </div>
    </main>
  );
}
