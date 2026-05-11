import React from 'react';
import { useLocale } from '../LocaleProvider';

interface HeaderProps {
  onGoHome: () => void;
  onOpenAdmin?: () => void;
  onOpenCustomer?: () => void;
  activePortal?: 'home' | 'admin' | 'customer';
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onOpenAdmin, onOpenCustomer, activePortal = 'home' }) => {
  const { lang, toggleLang, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-600"
          >
            SKU-Validation
          </button>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {activePortal === 'admin' ? t('adminConsole') : activePortal === 'customer' ? t('customerWeb') : t('home')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAdmin ? (
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activePortal === 'admin'
                  ? 'bg-slate-950 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('adminConsole')}
            </button>
          ) : null}

          {onOpenCustomer ? (
            <button
              type="button"
              onClick={onOpenCustomer}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activePortal === 'customer'
                  ? 'bg-slate-950 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('customerWeb')}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => toggleLang()}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {t('home')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
