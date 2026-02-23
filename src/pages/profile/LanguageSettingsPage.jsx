import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './ProfilePages.css';

const LanguageSettingsPage = () => {
    const navigate = useNavigate();
    const { language, changeLanguage, t } = useLanguage();
    // Local state for temporary selection
    const [tempLang, setTempLang] = React.useState(language);

    const languages = [
        { code: 'en', name: 'English (Default)', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
    ];

    const handleConfirm = () => {
        changeLanguage(tempLang);
        navigate(-1);
    };

    return (
        <div className="profile-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '0' }}>
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">{t('App Language')}</h2>
            </header>

            <div className="profile-content-area" style={{ padding: '0 20px', flex: 1 }}>
                <div className="profile-option-group">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`radio-option ${tempLang === lang.code ? 'selected' : ''}`}
                            onClick={() => setTempLang(lang.code)}
                        >
                            <div className="item-info">
                                <h4 style={{ color: tempLang === lang.code ? 'var(--theme-accent, #FFD700)' : 'var(--text-primary, white)' }}>{lang.name}</h4>
                                <p>{lang.native}</p>
                            </div>
                            <div className="radio-circle"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="profile-footer-action" style={{ padding: '20px', background: 'var(--surface, rgba(0,0,0,0.5))', backdropFilter: 'blur(10px)', marginTop: 'auto' }}>
                <button
                    className="save-profile-btn"
                    onClick={handleConfirm}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                        border: 'none',
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    {t('Save & Confirm')}
                </button>
            </div>
        </div>
    );
};

export default LanguageSettingsPage;
