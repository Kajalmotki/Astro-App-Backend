import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage for saved theme, default to 'dark' (Night Mode)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('astrorevo_theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        // Apply the theme to the root element for global CSS variable targeting
        document.documentElement.setAttribute('data-theme', theme);
        // Persist preference
        localStorage.setItem('astrorevo_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
