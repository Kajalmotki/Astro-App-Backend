import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Zap, MessageCircle, Crown, Heart, Lock, Globe, Anchor } from 'lucide-react';
import './PlanetaryStrengthening.css';

const planets = [
    { id: 'sun', name: 'Sun', title: 'Solar Radiance', icon: Sun, color: '#FFD700', desc: 'Leadership, Vitality, Soul' },
    { id: 'moon', name: 'Moon', title: 'Lunar Tides', icon: Moon, color: '#E0E0E0', desc: 'Emotions, Peace, Intuition' },
    { id: 'mars', name: 'Mars', title: 'The Iron Mars', icon: Zap, color: '#FF4500', desc: 'Strength, Action, Willpower' },
    { id: 'mercury', name: 'Mercury', title: 'Mercury Mind', icon: MessageCircle, color: '#32CD32', desc: 'Intellect, Communication' },
    { id: 'jupiter', name: 'Jupiter', title: 'Guru\'s Grace', icon: Crown, color: '#FFD700', desc: 'Wisdom, Expansion, Luck' },
    { id: 'venus', name: 'Venus', title: 'Venusian Bliss', icon: Heart, color: '#FF69B4', desc: 'Love, Beauty, Luxury' },
    { id: 'saturn', name: 'Saturn', title: 'Saturn\'s Iron', icon: Lock, color: '#C0C0C0', desc: 'Discipline, Karma, Focus' },
    { id: 'rahu', name: 'Rahu', title: 'Rahu Conquest', icon: Globe, color: '#8A2BE2', desc: 'Ambition, Innovation', isNodes: true },
    { id: 'ketu', name: 'Ketu', title: 'Ketu Zen', icon: Anchor, color: '#DAA520', desc: 'Detachment, Spirituality', isNodes: true },
];

const PlanetaryStrengthening = () => {
    const navigate = useNavigate();

    return (
        <div className="planetary-hub-container">
            <header className="hub-header">
                <h2 className="hub-title">Planetary Strengthening</h2>
                <p className="hub-subtitle">Choose a cosmic energy to master.</p>
            </header>

            <div className="planets-grid">
                {planets.map(planet => (
                    <div
                        key={planet.id}
                        className="planet-card"
                        style={{ '--planet-color': planet.color }}
                        onClick={() => navigate(planet.id === 'saturn' ? '/mobile/saturn-tracker' : `/mobile/tracker/${planet.id}`)}
                    >
                        <div className="planet-icon-box">
                            <planet.icon size={24} color={planet.color} />
                        </div>
                        <div className="planet-info">
                            <h3 className="planet-name">{planet.name}</h3>
                            <span className="planet-title-sm">{planet.title}</span>
                        </div>
                        <div className="planet-desc">{planet.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanetaryStrengthening;
