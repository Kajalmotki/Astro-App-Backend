import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const { t, i18n } = useTranslation();

    // The current language is managed directly by i18next
    const language = i18n.language || 'en';

    useEffect(() => {
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('appLanguage', langCode);
    };

    // Helper to get display name
    const getLanguageName = (code) => {
        const names = {
            'en': 'English',
            'hi': 'Hindi',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'zh': 'Chinese'
        };
        return names[code] || 'English';
    };

    // Because react-i18next might load translations asynchronously, 
    // it's safer to pass `t` out of context exactly as it is.
    return (
        <LanguageContext.Provider value={{ language, changeLanguage, getLanguageName, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
