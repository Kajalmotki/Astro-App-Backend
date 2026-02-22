import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Map, Activity, Heart, Star, Compass, Lock, ChevronRight, ChevronDown, Globe, Sun, Moon, MessageCircle, Crown, Zap } from 'lucide-react';
import BirthDetailsForm from '../components/BirthDetailsForm';
import AstroChart from '../components/AstroChart';
import { getLocalVedicChart } from '../services/vedicAstroApi';
import ChakraYogaPage from '../components/pages/ChakraYogaPage';
import MembershipModal from '../components/MembershipModal';
import BCAAnalysis from '../components/BCAAnalysis';
import { useAuth } from '../components/AuthModal';
import { checkMembershipStatus } from '../services/razorpayService';
import MobilePremiumDashboard from '../components/mobile/MobilePremiumDashboard';
import './MobileReports.css';

const MobileReports = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check for navigation state to open specific sections automatically
    useEffect(() => {
        if (location.state?.openPremium) {
            setActiveSection('premium');
        }
        if (location.state?.openBCA) {
            setActiveSection('bca');
            // Wait a tiny bit for the accordion to animate open, then reveal the modal
            setTimeout(() => setIsBCAOpen(true), 150);
        }
    }, [location.state]);

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

    // Auth & Premium State
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (user) {
                const status = await checkMembershipStatus(user.uid);
                setIsPremium(status);
            }
        };
        checkStatus();
    }, [user, isMembershipOpen]); // Re-check when membership modal closes (e.g. after purchase)

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
                            <div className="astrorevo-promo-card" onClick={() => navigate('/mobile/sample')}>
                                <div className="promo-bg-glow"></div>
                                <div className="promo-content">
                                    <div className="promo-badge">RECOMMENDED</div>
                                    <h3>Discover Your True Self</h3>
                                    <p>A comprehensive map of your destiny, engraved in the stars at the moment of your birth. Discover hidden potentials and karmic paths.</p>
                                    <div className="sample-chart-container" style={{ marginTop: '16px' }}>
                                        <button className="sample-chart-preview-btn" onClick={(e) => { e.stopPropagation(); navigate('/mobile/sample'); }}>
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
                            <span>{isPremium ? 'Your Premium Dashboard' : 'Unlock Ultimate Clarity'}</span>
                        </div>
                        {activeSection === 'premium' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'premium' && (
                        <div className="accordion-content">
                            {isPremium ? (
                                <MobilePremiumDashboard user={user} />
                            ) : (
                                <div className="premium-promo-card" onClick={() => setIsMembershipOpen(true)}>
                                    <div className="premium-bg-glow"></div>
                                    <div className="premium-content">
                                        <div className="premium-badge">FULL VERSION</div>
                                        <h3>Included with AstroRevo Chart</h3>
                                        <p style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', textAlign: 'left' }}>
                                            Get instant access to all premium features when you unlock your full <strong>AstroRevo Chart</strong>.
                                        </p>
                                        <ul style={{ color: '#e0e7ff', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', textAlign: 'left' }}>
                                            <li>50+ Pages of Detailed Analysis</li>
                                            <li>Vimshottari Dasha Predictions (5 Years)</li>
                                            <li>Gemstone & Rudraksha Recommendations</li>
                                            <li>Sadhesati & Mangal Dosha Remedies</li>
                                        </ul>
                                        <button className="premium-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setIsMembershipOpen(true); }}>
                                            Unlock via AstroRevo Chart • ₹99
                                        </button>
                                    </div>
                                </div>
                            )}
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

                {/* 6. Western Zodiac Natal Chart Accordion */}
                <div className={`accordion-item ${activeSection === 'western-chart' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('western-chart')}>
                        <div className="header-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Western Zodiac Natal Chart</h3>
                            <span>Tropical Astrology Insights</span>
                        </div>
                        {activeSection === 'western-chart' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'western-chart' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/western-chart')} style={{ background: 'linear-gradient(135deg, #2e1065, #0f172a)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(168, 85, 247, 0.3)' }}>
                                    <Globe size={24} color="#ffffff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Western Birth Chart</h3>
                                    <p>Explore your Sun, Moon, and Rising signs through the Western Tropical Zodiac system.</p>
                                </div>
                                <button className="bca-btn" style={{ background: '#a855f7' }}>View Western Chart</button>
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
                onSuccess={() => {
                    setIsMembershipOpen(false);
                    // Immediately grant access (for Guest Mode & instant feedback)
                    setIsPremium(true);
                    setActiveSection('premium');

                    // Verify with backend if user exists (to ensure persistence)
                    const checkStatus = async () => {
                        if (user) {
                            const status = await checkMembershipStatus(user.uid);
                            // Only update if verifiable status is returned
                            if (status) setIsPremium(true);
                        }
                    };
                    checkStatus();
                }}
            />

            {/* 7. Saturnian Discipline Accordion */}
            <div className={`accordion-item ${activeSection === 'saturn' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('saturn')}>
                    <div className="header-icon-box" style={{ background: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0' }}>
                        <Lock size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Saturnian Discipline</h3>
                        <span>Habit & Karma Tracker</span>
                        <span className="premium-badge-text">New Feature</span>
                    </div>
                    {activeSection === 'saturn' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'saturn' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/saturn-tracker')} style={{ background: 'linear-gradient(135deg, #1f2937, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                <Activity size={24} color="#FFD700" />
                            </div>
                            <div className="bca-text">
                                <h3>Master Your Routine</h3>
                                <p>Build iron-clad discipline. Track habits, gain karma points, and please Lord Saturn.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#FFD700', color: '#000' }}>Open Tracker</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 8. The Iron Mars (Bodybuilding) Accordion */}
            <div className={`accordion-item ${activeSection === 'mars' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('mars')}>
                    <div className="header-icon-box" style={{ background: 'rgba(255, 69, 0, 0.15)', color: '#FF4500' }}>
                        <Zap size={20} />
                    </div>
                    <div className="header-info">
                        <h3>The Iron Mars</h3>
                        <span>Bodybuilding & Strength</span>
                        <span className="premium-badge-text">New Feature</span>
                    </div>
                    {activeSection === 'mars' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'mars' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/mars')} style={{ background: 'linear-gradient(135deg, #2b0a0a, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(255, 69, 0, 0.2)' }}>
                                <Zap size={24} color="#FF4500" />
                            </div>
                            <div className="bca-text">
                                <h3>Forged in Fire</h3>
                                <p>Track workouts, protein, and will-power. Channel the warrior energy of Mangal.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#FF4500', color: '#fff' }}>Open Gym</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 9. Solar Radiance (Sun) */}
            <div className={`accordion-item ${activeSection === 'sun' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('sun')}>
                    <div className="header-icon-box" style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700' }}>
                        <Sun size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Solar Radiance</h3>
                        <span>Soul & Vitality</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'sun' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'sun' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/sun')} style={{ background: 'linear-gradient(135deg, #3a2a00, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                <Sun size={24} color="#FFD700" />
                            </div>
                            <div className="bca-text">
                                <h3>Ignite Your Soul</h3>
                                <p>Morning rituals, leadership, and vitality. Shine like the Sun.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#FFD700', color: '#000' }}>Wake Up</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 10. Lunar Tides (Moon) */}
            <div className={`accordion-item ${activeSection === 'moon' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('moon')}>
                    <div className="header-icon-box" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}>
                        <Moon size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Lunar Tides</h3>
                        <span>Mind & Emotions</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'moon' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'moon' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/moon')} style={{ background: 'linear-gradient(135deg, #1e293b, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                                <Moon size={24} color="#fff" />
                            </div>
                            <div className="bca-text">
                                <h3>Find Your Flow</h3>
                                <p>Track moods, hydration, and peace. Master your emotional tides.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#fff', color: '#000' }}>Find Peace</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 11. Mercury Mind */}
            <div className={`accordion-item ${activeSection === 'mercury' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('mercury')}>
                    <div className="header-icon-box" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                        <MessageCircle size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Mercury Mind</h3>
                        <span>Intellect & Skills</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'mercury' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'mercury' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/mercury')} style={{ background: 'linear-gradient(135deg, #064e3b, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(52, 211, 153, 0.2)' }}>
                                <MessageCircle size={24} color="#34d399" />
                            </div>
                            <div className="bca-text">
                                <h3>Sharpen Your Wit</h3>
                                <p>Reading, learning, and communication. Boost your IQ.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#34d399', color: '#fff' }}>Start Learning</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 12. Guru's Grace (Jupiter) */}
            <div className={`accordion-item ${activeSection === 'jupiter' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('jupiter')}>
                    <div className="header-icon-box" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
                        <Crown size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Guru's Grace</h3>
                        <span>Wisdom & Luck</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'jupiter' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'jupiter' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/jupiter')} style={{ background: 'linear-gradient(135deg, #422006, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(234, 179, 8, 0.2)' }}>
                                <Crown size={24} color="#eab308" />
                            </div>
                            <div className="bca-text">
                                <h3>Expand Your Wisdom</h3>
                                <p>Gratitude, study, and teaching. Attract good fortune.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#eab308', color: '#fff' }}>Gain Wisdom</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 13. Venusian Bliss */}
            <div className={`accordion-item ${activeSection === 'venus' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('venus')}>
                    <div className="header-icon-box" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                        <Heart size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Venusian Bliss</h3>
                        <span>Love & Beauty</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'venus' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'venus' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/venus')} style={{ background: 'linear-gradient(135deg, #be185d, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
                                <Heart size={24} color="#ec4899" />
                            </div>
                            <div className="bca-text">
                                <h3>Radiate Beauty</h3>
                                <p>Self-care, grooming, and luxury. Attract love and abundance.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#ec4899', color: '#fff' }}>Be Beautiful</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 14. Rahu Conquest */}
            <div className={`accordion-item ${activeSection === 'rahu' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('rahu')}>
                    <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                        <Globe size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Rahu Conquest</h3>
                        <span>Ambition & Fame</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'rahu' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'rahu' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/rahu')} style={{ background: 'linear-gradient(135deg, #4c1d95, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                                <Globe size={24} color="#8b5cf6" />
                            </div>
                            <div className="bca-text">
                                <h3>Conquer the World</h3>
                                <p>Obsession, innovation, and fame. Achieve the impossible.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#8b5cf6', color: '#fff' }}>Conquer</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 15. Ketu Zen */}
            <div className={`accordion-item ${activeSection === 'ketu' ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleSection('ketu')}>
                    <div className="header-icon-box" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#d97706' }}>
                        <Star size={20} />
                    </div>
                    <div className="header-info">
                        <h3>Ketu Zen</h3>
                        <span>Detachment & Moksha</span>
                        <span className="premium-badge-text">New</span>
                    </div>
                    {activeSection === 'ketu' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {activeSection === 'ketu' && (
                    <div className="accordion-content">
                        <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/ketu')} style={{ background: 'linear-gradient(135deg, #78350f, #000)' }}>
                            <div className="bca-icon-circle" style={{ background: 'rgba(217, 119, 6, 0.2)' }}>
                                <Star size={24} color="#d97706" />
                            </div>
                            <div className="bca-text">
                                <h3>Embrace the Void</h3>
                                <p>Spirituality, isolation, and letting go. Find freedom in nothingness.</p>
                            </div>
                            <button className="bca-btn" style={{ background: '#d97706', color: '#fff' }}>Let Go</button>
                        </div>
                    </div>
                )}
            </div>



            <BCAAnalysis
                isOpen={isBCAOpen}
                onClose={() => setIsBCAOpen(false)}
            />
        </div>
    );
};

export default MobileReports;
