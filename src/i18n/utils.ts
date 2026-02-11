import translations from './translations.json';

export const defaultLang = 'es';
export const languages = {
  es: 'Español',
  en: 'English',
};

export const getI18N = ({ currentLocale }: { currentLocale: string | undefined }) => {
  const locale = currentLocale as keyof typeof translations;
  return (key: string) => {
    return translations[locale]?.[key as keyof typeof translations.es] || 
           translations['es']?.[key as keyof typeof translations.es] || 
           key;
  };
};

export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
};
