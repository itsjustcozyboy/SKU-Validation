import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lang, t } from './i18n';

type LocaleContextValue = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem('sku_lang');
      return (stored as Lang) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sku_lang', lang);
    } catch (e) {
      // ignore
    }
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ko' : 'en'));

  return (
    <LocaleContext.Provider value={{ lang, toggleLang, t: (key: string) => t(lang, key), setLang }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
};

export default LocaleProvider;
