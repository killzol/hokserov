import { useLanguage } from './LanguageContext.jsx';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === 'ru' ? 'en' : 'ru';

  return (
    <button type="button" onClick={() => setLanguage(nextLanguage)}>
      {language === 'ru' ? 'English' : 'Русский'}
    </button>
  );
}
