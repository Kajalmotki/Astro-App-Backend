import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend) // Load translations using http (default public/locales)
    .use(LanguageDetector) // detect user language
    .use(initReactI18next) // pass the i18n instance to react-i18next.
    .init({
        fallbackLng: 'en',
        debug: false,

        // We can define the default language here based on what was saved previously
        lng: localStorage.getItem('appLanguage') || 'en',

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    });

export default i18n;
