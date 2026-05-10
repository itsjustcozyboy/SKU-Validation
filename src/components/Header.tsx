import React from 'react';
import { useLocale } from '../LocaleProvider';

const Header: React.FC = () => {
  const { lang, toggleLang, t } = useLocale();

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">KB</div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{t('appTitle')}</div>
            <div className="text-xs text-gray-500">{t('subtitle')}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLang()}
            aria-label="Toggle language"
            className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
