import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const sourcesData = [
    {
        id: 1,
        name: 'Atharva Veda',
        category: 'Foundation',
        x: 100, y: 150,
        author: 'Rishi Atharvan',
        significance: 'Source of Ayurveda & Occult Sciences',
        desc: 'Contains the earliest references to planetary remedies, healing mantras, and the mystical connection between the cosmos and human physiology.'
    },
    {
        id: 2,
        name: 'Vedanga Jyotisha',
        category: 'Astronomy',
        x: 100, y: 300,
        author: 'Lagadha',
        significance: 'Earliest treatise on Astronomy',
        desc: 'The foundational text dealing with time-keeping (Kala) for Vedic rituals, establishing the soli-lunar calendar system still used today.'
    },
    {
        id: 3,
        name: 'Brihat Parashara',
        category: 'Core Principles',
        x: 100, y: 450,
        author: 'Maharishi Parashara',
        significance: 'Bible of Vedic Astrology',
        desc: 'The most comprehensive classic (Hora Shastra) covering foundational rules, divisional charts, dasha systems, and planetary states (Avasthas).'
    },
    {
        id: 4,
        name: 'Brihat Jataka',
        category: 'Natal Astrology',
        x: 100, y: 600,
        author: 'Varahamihira',
        significance: 'Analytical & Mathematical Precision',
        desc: 'A masterpiece known for its terse, potent verses on natal horoscopy, offering complex yogas and precise predictive methods.'
    },
    {
        id: 5,
        name: 'Saravali',
        category: 'Classical Compendium',
        x: 300, y: 100,
        author: 'Kalyana Varma',
        significance: 'Detailed Yoga Analysis',
        desc: 'Expands on the brief aphorisms of earlier rishis, providing elaborate results for planetary conjunctions and Nabhasa Yogas.'
    },
    {
        id: 6,
        name: 'Phaladeepika',
        category: 'Predictive Insights',
        x: 300, y: 250,
        author: 'Mantreswara',
        significance: 'Practical Predictive Gems',
        desc: 'Revered for its clarity on Transits (Gochar), Dusthana houses, and specific effects of planetary positions not found elsewhere.'
    },
    {
        id: 7,
        name: 'Jataka Parijata',
        category: 'Planetary Logic',
        x: 300, y: 500,
        author: 'Vaidyanatha Dikshita',
        significance: 'Complex Planetary Conditions',
        desc: 'dives deep into planetary strengths, Raja Yogas, and the intricate calculation of longevity and death (Maraka) periods.'
    },
    {
        id: 8,
        name: 'Hora Ratnam',
        category: 'Gem of Time',
        x: 300, y: 650,
        author: 'Balabhadra',
        significance: 'Compilation of Diverse Schools',
        desc: 'An encyclopedic work referencing diverse opinions from ancient sages like Garga and Narada, reconciling contradictions.'
    },
    {
        id: 9,
        name: 'Uttara Kalamrita',
        category: 'Ultimate Wisdom',
        x: 300, y: 750,
        author: 'Kalidasa',
        significance: 'Retrograde & Nodes Secrets',
        desc: 'A specialized text famous for its unique principles on Retrograde planets (Vakri) and the nodes Rahu/Ketu.'
    },
];

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, Sparkles, ArrowDown, ChevronRight, X } from 'lucide-react';
import './KnowledgeSources.css';

const sourcesData = [
    {
        id: 1,
        name: 'Atharva Veda',
        category: 'Foundation',
        author: 'Rishi Atharvan',
        significance: 'Source of Ayurveda & Occult Sciences',
        desc: 'Contains the earliest references to planetary remedies, healing mantras, and the mystical connection between the cosmos and human physiology.'
    },
    {
        id: 2,
        name: 'Vedanga Jyotisha',
        category: 'Astronomy',
        author: 'Lagadha',
        significance: 'Earliest treatise on Astronomy',
        desc: 'The foundational text dealing with time-keeping (Kala) for Vedic rituals, establishing the soli-lunar calendar system still used today.'
    },
    {
        id: 3,
        name: 'Brihat Parashara',
        category: 'Core Principles',
        author: 'Maharishi Parashara',
        significance: 'Bible of Vedic Astrology',
        desc: 'The most comprehensive classic (Hora Shastra) covering foundational rules, divisional charts, dasha systems, and planetary states (Avasthas).'
    },
    {
        id: 4,
        name: 'Brihat Jataka',
        category: 'Natal Astrology',
        author: 'Varahamihira',
        significance: 'Analytical & Mathematical Precision',
        desc: 'A masterpiece known for its terse, potent verses on natal horoscopy, offering complex yogas and precise predictive methods.'
    },
    {
        id: 6,
        name: 'Phaladeepika',
        category: 'Predictive Insights',
        author: 'Mantreswara',
        significance: 'Practical Predictive Gems',
        desc: 'Revered for its clarity on Transits (Gochar), Dusthana houses, and specific effects of planetary positions not found elsewhere.'
    }
];

const KnowledgeSources = () => {
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <div className="knowledge-page bg-deep">
            {/* Header */}
            <header className="header glass">
                <Link to="/" className="logo gold-text">AstroRevo</Link>
                <nav className="nav">
                    <Link to="/mobile/home">Back to Home</Link>
                </nav>
            </header>

            <main className="workflow-container">

                {/* Stage 1: Ancient Wisdom */}
                <div className="workflow-stage">
                    <h2 className="stage-title">Ancient Wisdom Input</h2>
                    <div className="sources-grid">
                        {sourcesData.map((source) => (
                            <div key={source.id} className="source-card" onClick={() => setSelectedNode(source)}>
                                <span className="card-category">{source.category}</span>
                                <h3 className="card-title">{source.name}</h3>
                                <BookOpen size={20} color="#F0E68C" />
                                <ChevronRight size={16} className="card-arrow" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connector 1 */}
                <div className="workflow-connector">
                    <div className="connector-line"></div>
                    <ArrowDown size={24} className="connector-arrow" />
                </div>

                {/* Stage 2: The Engine */}
                <div className="workflow-stage">
                    <div className="engine-container">
                        <Cpu size={48} className="engine-icon" />
                        <h2 className="stage-title" style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Processing Engine</h2>
                        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>Quantum Calibration Active</p>
                    </div>
                </div>

                {/* Connector 2 */}
                <div className="workflow-connector">
                    <div className="connector-line"></div>
                    <ArrowDown size={24} className="connector-arrow" />
                </div>

                {/* Stage 3: Output */}
                <div className="workflow-stage">
                    <div className="output-card">
                        <Sparkles size={32} color="#FFD700" style={{ marginBottom: '15px' }} />
                        <h2 className="output-title">Personalized Insights</h2>
                        <p className="output-desc">
                            Synthesizing thousands of years of Vedic knowledge to generate your precise Horoscope, Dasha predictions, and Remedies.
                        </p>
                    </div>
                </div>

            </main>

            {/* Details Modal */}
            {selectedNode && (
                <div className="detail-modal-overlay" onClick={() => setSelectedNode(null)}>
                    <div className="detail-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedNode(null)}>
                            <X size={24} />
                        </button>

                        <h2 className="modal-title gold-text">{selectedNode.name}</h2>
                        <div className="modal-divider"></div>

                        <div className="modal-info-row">
                            <div className="modal-info-item">
                                <span className="label">Author</span>
                                <span className="value">{selectedNode.author}</span>
                            </div>
                            <div className="modal-info-item">
                                <span className="label">Category</span>
                                <span className="value">{selectedNode.category}</span>
                            </div>
                        </div>

                        <div className="modal-section">
                            <span className="label">Significance</span>
                            <p className="value highlight">{selectedNode.significance}</p>
                        </div>

                        <div className="modal-section">
                            <span className="label">Description</span>
                            <p className="value description">{selectedNode.desc}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Styles (Inline for simplicity or added to CSS) */}
            <style>{`
                .detail-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    backdrop-filter: blur(5px);
                    animation: fadeIn 0.3s ease;
                }
                .detail-modal {
                    background: #1a1a2e;
                    border: 1px solid #FFD700;
                    border-radius: 20px;
                    padding: 30px;
                    width: 100%;
                    max-width: 500px;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    animation: slideUp 0.3s ease;
                }
                .close-modal-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                }
                .modal-title { font-family: 'Cinzel', serif; font-size: 1.8rem; margin-bottom: 10px; }
                .modal-divider { width: 60px; height: 3px; background: #FFD700; margin-bottom: 25px; }
                .modal-info-row { display: flex; gap: 30px; margin-bottom: 20px; }
                .modal-info-item { display: flex; flex-direction: column; }
                .label { font-size: 0.8rem; color: #aaa; text-transform: uppercase; margin-bottom: 5px; }
                .value { color: #fff; font-size: 1rem; }
                .highlight { color: #F0E68C; font-weight: 500; }
                .description { line-height: 1.6; color: #e0e0e0; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default KnowledgeSources;

export default KnowledgeSources;
