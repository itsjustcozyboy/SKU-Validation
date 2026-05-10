import React from 'react';
import { useLocale } from '../LocaleProvider';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  const { lang, toggleLang, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 md:px-8">
        
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            SKU-Validation
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleLang()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            {t('home')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
