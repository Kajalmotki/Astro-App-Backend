import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const changeLanguage = (langCode) => {
        setLanguage(langCode);
        localStorage.setItem('appLanguage', langCode);
    };

    // Translation helper
    const t = (key) => {
        try {
            const translation = translations[language]?.[key];
            return translation || key; // Fallback to key if not found
        } catch (e) {
            return key;
        }
    };

    // Helper to get display name
    const getLanguageName = (code) => {
        const names = {
            'en': 'English',
            'hi': 'Hindi',
            'es': 'Spanish',
            'fr': 'French'
        };
        return names[code] || 'English';
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, getLanguageName, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
