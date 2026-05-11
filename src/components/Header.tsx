import type { FC } from 'react';
import { useLocale } from '../LocaleProvider';

interface HeaderProps {
  onGoHome: () => void;
  activePortal?: 'home' | 'admin' | 'customer';
  portalTitle?: string;
}

const Header: FC<HeaderProps> = ({ onGoHome, activePortal = 'home', portalTitle }) => {
  const { lang, toggleLang, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onGoHome}
            className="font-semibold tracking-tight text-slate-900 hover:text-slate-600"
          >
            SKU-Validation
          </button>
          {activePortal !== 'home' && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {activePortal === 'admin' ? t('adminConsole') : t('customerWeb')}
            </span>
          )}
          {portalTitle && ( 
            <p className="text-sm text-slate-600">{portalTitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleLang()}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {t('home')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
