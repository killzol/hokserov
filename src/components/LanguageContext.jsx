import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru');
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage нужно вызывать внутри LanguageProvider');
  }
  return context;
}
