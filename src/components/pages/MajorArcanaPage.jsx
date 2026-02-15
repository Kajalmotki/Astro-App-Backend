import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { majorArcana } from '../../utils/tarotData';
import './MajorArcanaPage.css';

const MajorArcanaPage = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="major-arcana-page">
            <header className="arcana-header">
                <button className="icon-btn back-btn" onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="arcana-title">Major Arcana</h1>
                <div className="spacer"></div>
            </header>

            <div className="arcana-grid">
                {majorArcana.map((card, index) => (
                    <div key={index} className="arcana-card-item">
                        <div className="arcana-card-visual">
                            <span className="arcana-emoji">{card.emoji}</span>
                        </div>
                        <div className="arcana-card-info">
                            <span className="arcana-numeral">{card.numeral}</span>
                            <h3 className="arcana-name">{card.name}</h3>
                            <p className="arcana-meaning">{card.meaning}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MajorArcanaPage;
