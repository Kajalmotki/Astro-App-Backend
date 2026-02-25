import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Star, Lock, ChevronRight, ChevronDown, Globe, Sun, Moon, MessageCircle, Crown, Zap, ArrowLeft, Heart } from 'lucide-react';
import './MobileReports.css';

const MobilePlanetTrackers = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="mobile-reports-container">
            <header className="page-header" style={{ position: 'relative' }}>
                <button
                    onClick={() => navigate('/mobile/reports')}
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', padding: '8px', cursor: 'pointer' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2>Planet Trackers</h2>
                <p>Master your planetary energies.</p>
            </header>

            <div className="reports-accordion">
                {/* 7. Saturnian Discipline Accordion */}
                <div className={`accordion-item ${activeSection === 'saturn' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('saturn')}>
                        <div className="header-icon-box" style={{ background: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Lock size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Saturnian Discipline</h3>
                            <span>Habit & Karma Tracker</span>
                        </div>
                        {activeSection === 'saturn' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'saturn' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/saturn-tracker')} style={{ background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                    <Activity size={24} color="#FFD700" />
                                </div>
                                <div className="bca-text">
                                    <h3>Master Your Routine</h3>
                                    <p>Build iron-clad discipline. Track habits, gain karma points, and please Lord Saturn.</p>
                                </div>
                                <button className="bca-btn">Open Tracker</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 8. The Iron Mars (Bodybuilding) Accordion */}
                <div className={`accordion-item ${activeSection === 'mars' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('mars')}>
                        <div className="header-icon-box" style={{ background: 'rgba(255, 69, 0, 0.15)', color: '#FF4500', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Zap size={20} />
                        </div>
                        <div className="header-info">
                            <h3>The Iron Mars</h3>
                            <span>Bodybuilding & Strength</span>
                        </div>
                        {activeSection === 'mars' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'mars' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/mars')} style={{ background: 'linear-gradient(135deg, rgba(43, 10, 10, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 69, 0, 0.2)' }}>
                                    <Zap size={24} color="#FF4500" />
                                </div>
                                <div className="bca-text">
                                    <h3>Forged in Fire</h3>
                                    <p>Track workouts, protein, and will-power. Channel the warrior energy of Mangal.</p>
                                </div>
                                <button className="bca-btn">Open Gym</button>
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
                        </div>
                        {activeSection === 'sun' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'sun' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/sun')} style={{ background: 'linear-gradient(135deg, rgba(58, 42, 0, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                                    <Sun size={24} color="#FFD700" />
                                </div>
                                <div className="bca-text">
                                    <h3>Ignite Your Soul</h3>
                                    <p>Morning rituals, leadership, and vitality. Shine like the Sun.</p>
                                </div>
                                <button className="bca-btn">Wake Up</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 10. Lunar Tides (Moon) */}
                <div className={`accordion-item ${activeSection === 'moon' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('moon')}>
                        <div className="header-icon-box" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Moon size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Lunar Tides</h3>
                            <span>Mind & Emotions</span>
                        </div>
                        {activeSection === 'moon' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'moon' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/moon')} style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                                    <Moon size={24} color="#fff" />
                                </div>
                                <div className="bca-text">
                                    <h3>Find Your Flow</h3>
                                    <p>Track moods, hydration, and peace. Master your emotional tides.</p>
                                </div>
                                <button className="bca-btn">Find Peace</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 11. Mercury Mind */}
                <div className={`accordion-item ${activeSection === 'mercury' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('mercury')}>
                        <div className="header-icon-box" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <MessageCircle size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Mercury Mind</h3>
                            <span>Intellect & Skills</span>
                        </div>
                        {activeSection === 'mercury' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'mercury' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/mercury')} style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(52, 211, 153, 0.2)' }}>
                                    <MessageCircle size={24} color="#34d399" />
                                </div>
                                <div className="bca-text">
                                    <h3>Sharpen Your Wit</h3>
                                    <p>Reading, learning, and communication. Boost your IQ.</p>
                                </div>
                                <button className="bca-btn">Start Learning</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 12. Guru's Grace (Jupiter) */}
                <div className={`accordion-item ${activeSection === 'jupiter' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('jupiter')}>
                        <div className="header-icon-box" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Crown size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Guru's Grace</h3>
                            <span>Wisdom & Luck</span>
                        </div>
                        {activeSection === 'jupiter' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'jupiter' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/jupiter')} style={{ background: 'linear-gradient(135deg, rgba(66, 32, 6, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(234, 179, 8, 0.2)' }}>
                                    <Crown size={24} color="#eab308" />
                                </div>
                                <div className="bca-text">
                                    <h3>Expand Your Wisdom</h3>
                                    <p>Gratitude, study, and teaching. Attract good fortune.</p>
                                </div>
                                <button className="bca-btn">Gain Wisdom</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 13. Venusian Bliss */}
                <div className={`accordion-item ${activeSection === 'venus' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('venus')}>
                        <div className="header-icon-box" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Heart size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Venusian Bliss</h3>
                            <span>Love & Beauty</span>
                        </div>
                        {activeSection === 'venus' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'venus' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/venus')} style={{ background: 'linear-gradient(135deg, rgba(190, 24, 93, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
                                    <Heart size={24} color="#ec4899" />
                                </div>
                                <div className="bca-text">
                                    <h3>Radiate Beauty</h3>
                                    <p>Self-care, grooming, and luxury. Attract love and abundance.</p>
                                </div>
                                <button className="bca-btn">Be Beautiful</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 14. Rahu Conquest */}
                <div className={`accordion-item ${activeSection === 'rahu' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('rahu')}>
                        <div className="header-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Globe size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Rahu Conquest</h3>
                            <span>Ambition & Fame</span>
                        </div>
                        {activeSection === 'rahu' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'rahu' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/rahu')} style={{ background: 'linear-gradient(135deg, rgba(76, 29, 149, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                                    <Globe size={24} color="#8b5cf6" />
                                </div>
                                <div className="bca-text">
                                    <h3>Conquer the World</h3>
                                    <p>Obsession, innovation, and fame. Achieve the impossible.</p>
                                </div>
                                <button className="bca-btn">Conquer</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 15. Ketu Zen */}
                <div className={`accordion-item ${activeSection === 'ketu' ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleSection('ketu')}>
                        <div className="header-icon-box" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Star size={20} />
                        </div>
                        <div className="header-info">
                            <h3>Ketu Zen</h3>
                            <span>Detachment & Moksha</span>
                        </div>
                        {activeSection === 'ketu' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    {activeSection === 'ketu' && (
                        <div className="accordion-content">
                            <div className="bca-promo-card" onClick={() => navigate('/mobile/tracker/ketu')} style={{ background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.3), rgba(0, 0, 0, 0.3))', backdropFilter: 'blur(12px)' }}>
                                <div className="bca-icon-circle" style={{ background: 'rgba(217, 119, 6, 0.2)' }}>
                                    <Star size={24} color="#d97706" />
                                </div>
                                <div className="bca-text">
                                    <h3>Embrace the Void</h3>
                                    <p>Spirituality, isolation, and letting go. Find freedom in nothingness.</p>
                                </div>
                                <button className="bca-btn">Let Go</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div style={{ height: '70px' }}></div>
        </div>
    );
};

export default MobilePlanetTrackers;
