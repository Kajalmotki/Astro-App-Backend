import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import './ProfilePages.css';

const LanguageSettingsPage = () => {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState('en');

    const languages = [
        { code: 'en', name: 'English (Default)', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
    ];

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">App Language</h2>
            </header>

            <div className="profile-option-group">
                {languages.map((lang) => (
                    <div
                        key={lang.code}
                        className={`radio-option ${selectedLang === lang.code ? 'selected' : ''}`}
                        onClick={() => setSelectedLang(lang.code)}
                    >
                        <div className="item-info">
                            <h4 style={{ color: selectedLang === lang.code ? '#FFD700' : 'white' }}>{lang.name}</h4>
                            <p>{lang.native}</p>
                        </div>
                        <div className="radio-circle"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguageSettingsPage;
