import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Map, Activity, Heart, Star, Compass, Lock, ChevronRight, ChevronDown } from 'lucide-react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroChart from '../components/AstroChart';
import { getLocalVedicChart } from '../services/vedicAstroApi';
import ChakraYogaPage from '../components/pages/ChakraYogaPage';
import MembershipModal from '../components/MembershipModal';
import BCAAnalysis from '../components/BCAAnalysis';
import './MobileReports.css';

const MobileReports = () => {
    const navigate = useNavigate();

    // State for Accordion
    const [activeSection, setActiveSection] = useState(null); // 'birth-chart', 'astrorevo-chart', 'premium', 'yoga', 'bca'

    // State for Birth Chart
    const [chartData, setChartData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isChartGenerated, setIsChartGenerated] = useState(false);

    // State for Modals
    const [selectedChakra, setSelectedChakra] = useState(null);
    const [isMembershipOpen, setIsMembershipOpen] = useState(false);
    const [isBCAOpen, setIsBCAOpen] = useState(false);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Chakra Data
    const chakras = [
        { name: 'Sahasrara', color: '#E9D8FD', rgb: '233, 216, 253', symbol: 'ॐ', description: 'Crown: Pure Consciousness', petals: 1000, yantra: 'circle' },
        { name: 'Ajna', color: '#B794F4', rgb: '183, 148, 244', symbol: 'ॐ', description: 'Third Eye: Intuition', petals: 2, yantra: 'circle' },
        { name: 'Vishuddha', color: '#63B3ED', rgb: '99, 179, 237', symbol: 'हं', description: 'Throat: Expression', petals: 16, yantra: 'circle' },
        { name: 'Anahata', color: '#68D391', rgb: '104, 211, 145', symbol: 'यं', description: 'Heart: Love & Balance', petals: 12, yantra: 'hexagram' },
        { name: 'Manipura', color: '#F6E05E', rgb: '246, 224, 94', symbol: 'रं', description: 'Solar Plexus: Power', petals: 10, yantra: 'triangle' },
        { name: 'Svadhisthana', color: '#F6AD55', rgb: '246, 173, 85', symbol: 'वं', description: 'Sacral: Creativity', petals: 6, yantra: 'crescent' },
        { name: 'Muladhara', color: '#FC8181', rgb: '252, 129, 129', symbol: 'लं', description: 'Root: Stability', petals: 4, yantra: 'square' }
    ];

    const handleChartSubmit = async (data) => {
        setUserData(data);
        setIsChartLoading(true);
        setIsChartGenerated(true);
        try {
            const result = await getLocalVedicChart(data);
            setChartData(result.data);
        } catch (error) {
            console.error("Chart generation failed", error);
        } finally {
            setIsChartLoading(false);
        }
    };

    return (
        <div className="mobile-reports-container">
            <header className="page-header">
                <h2>Your Cosmic Reports</h2>
                <p>Unlock destiny, health, and spiritual growth.</p>
            </header>

            <div className="reports-accordion">
                {/* 1. Birth Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'birth-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('birth-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Birth Chart</h3>
                            <span>Quick Vedic Calculation</span>
                        </div>
                        {activeSection === 'birth-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'birth-chart' && (
                        <div className="accordion-content">
                            <div className="chart-card glass-panel">
                                {!isChartGenerated ? (
                                    <div className="embedded-form-wrapper">
                                        <BirthDetailsForm
                                            onSubmit={handleChartSubmit}
                                            title=""
                                            submitLabel="Reveal My Chart"
                                        />
                                    </div>
                                ) : (
                                    <div className="embedded-chart-view">
                                        <div className="chart-header-mini">
                                            <h4>{userData?.name}'s Chart</h4>
                                            <button className="reset-btn" onClick={() => setIsChartGenerated(false)}>New</button>
                                        </div>
                                        <div className="chart-viz-wrapper">
                                            <AstroChart chartData={chartData} isLoading={isChartLoading} />
                                        </div>
                                        <div className="chart-summary-mini">
                                            <p>Your planetary blueprint is ready. Unlock the full report for deep analysis.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. The AstroRevo Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'astrorevo-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('astrorevo-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>The AstroRevo Chart</h3>
                            <span>Your Soul's Blueprint</span>
                        </div>
                        {activeSection === 'astrorevo-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'astrorevo-chart' && (
                        <div className="accordion-content">
                            <div className="astrorevo-promo-card" onClick={() => navigate('/sample')}>
                                <div className="promo-bg-glow"></div>
                                <div className="promo-content">
                                    <div className="promo-badge">RECOMMENDED</div>
                                    <h3>Discover Your True Self</h3>
                                    <p>A comprehensive map of your destiny, engraved in the stars at the moment of your birth. Discover hidden potentials and karmic paths.</p>
                                    <div className="sample-chart-container" style={{ marginTop: '16px' }}>
                                        <button className="sample-chart-preview-btn" onClick={(e) => { e.stopPropagation(); navigate('/sample'); }}>
                                            <div className="preview-icon">
                                                <span style={{ fontSize: '20px' }}>📊</span>
                                            </div>
                                            <div className="preview-text">
                                                <span className="preview-title">View Sample Report</span>
                                                <span className="preview-subtitle">See what your future holds</span>
                                            </div>
                                            <div className="preview-arrow">→</div>
                                        </button>

                                        <button className="razorpay-buy-btn" onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            <span className="buy-text">Unlock Full Report</span>
                                            <span className="buy-price">₹99</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Premium Access Accordion */}
                <div className={`accordion-item ${activeSection === 'premium' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('premium')}>
                        <div className="header-icon-box" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
                            <Lock size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Premium Access</h3>
                            <span>Unlock Ultimate Clarity</span>
                        </div>
                        {activeSection === 'premium' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'premium' && (
                        <div className="accordion-content">
                            <div className="premium-promo-card" onClick={() => setIsMembershipOpen(true)}>
                                <div className="premium-bg-glow"></div>
                                <div className="premium-content">
                                    <div className="premium-badge">FULL VERSION</div>
                                    <h3>Complete Life Prediction</h3>
                                    <ul style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', textAlign: 'left' }}>
                                        <li>50+ Pages of Detailed Analysis</li>
                                        <li>Vimshottari Dasha Predictions (5 Years)</li>
                                        <li>Gemstone & Rudraksha Recommendations</li>
                                        <li>Sadhesati & Mangal Dosha Remedies</li>
                                    </ul>
                                    <button className="premium-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                        Buy Full Report • ₹99
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Yoga Remedies Accordion */}
                <div className={`accordion-item ${activeSection === 'yoga' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('yoga')}>
                        <div className="header-icon-box" style={{ background: 'rgba(67, 233, 123, 0.15)', color: '#43e97b' }}>
                            <Activity size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Yoga Remedies</h3>
                            <span>Balance your 7 Chakras</span>
                            <span className="premium-badge-text">Premium Access Recommended</span>
                        </div>
                        {activeSection === 'yoga' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'yoga' && (
                        <div className="accordion-content">
                            <div className="chakra-list">
                                {chakras.map((chakra, index) => (
                                    <div
                                        key={chakra.name}
                                        className="chakra-item-card"
                                        style={{ '--chakra-color': chakra.color }}
                                        onClick={() => setSelectedChakra(chakra)}
                                    >
                                        <div className="chakra-symbol-box" style={{ borderColor: chakra.color }}>
                                            <span className="chakra-symbol" style={{ color: chakra.color }}>{chakra.symbol}</span>
                                        </div>
                                        <div className="chakra-info">
                                            <h4>{chakra.name}</h4>
                                            <span>{chakra.description.split(':')[0]}</span>
                                        </div>
                                        <ChevronRight size={20} className="arrow-icon" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Body Composition Accordion */}
                <div className={`accordion-item ${activeSection === 'bca' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('bca')}>
                        <div className="header-icon-box" style={{ background: 'rgba(240, 147, 251, 0.15)', color: '#f093fb' }}>
                            <Compass size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Body Composition</h3>
                            <span>Ayurvedic Health Insights</span>
                        </div>
                        {activeSection === 'bca' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'bca' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => setIsBCAOpen(true)}>
                                <div className="bca-icon-circle">
                                    <Activity size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Body Composition Analysis</h3>
                                    <p>Discover how your physical form aligns with your energy centers. Get a personalized health & yoga plan.</p>
                                </div>
                                <button className="bca-btn">Start Analysis</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Spacer for bottom nav */}
            <div style={{ height: '70px' }}></div>

            {/* Modals */}
            <ChakraYogaPage
                isOpen={!!selectedChakra}
                onClose={() => setSelectedChakra(null)}
                chakra={selectedChakra}
            />

            <MembershipModal
                isOpen={isMembershipOpen}
                onClose={() => setIsMembershipOpen(false)}
            />

            <BCAAnalysis
                isOpen={isBCAOpen}
                onClose={() => setIsBCAOpen(false)}
            />
        </div>
    );
};

export default MobileReports;
