import React from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './PanchangPage.css';

const PanchangPage = ({ isOpen, onClose }) => {
    const [choghadiyaData, setChoghadiyaData] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('Day'); // 'Day' or 'Night'
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        if (isOpen) {
            import('../../utils/choghadiyaUtils').then(({ calculateChoghadiya }) => {
                const data = calculateChoghadiya(new Date());
                setChoghadiyaData(data);

                // Automatically switch to night tab if it's currently night
                const now = new Date();
                if (now >= data.sunset || now < data.sunrise) {
                    setActiveTab('Night');
                } else {
                    setActiveTab('Day');
                }
            });

            // Set up a timer to update current time every minute to keep highlight accurate
            const timer = setInterval(() => {
                setCurrentTime(new Date());
            }, 60000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!choghadiyaData) return null;

    const renderRow = (item, index) => {
        const isActive = currentTime >= item.start && currentTime < item.end;
        const qualityClass = item.quality.toLowerCase() || 'neutral';

        return (
            <div
                key={index}
                className={`choghadiya-glass-row ${qualityClass} ${isActive ? 'is-active' : ''}`}
            >
                <div className="row-accent-bar"></div>

                <div className="ch-time-col">
                    <div className="ch-time-text">
                        {item.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                        <br />
                        {item.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {isActive && <span className="ch-current-badge">Current</span>}
                </div>

                <div className="ch-name-col">
                    <strong className="ch-muhurat-name">{item.name}</strong>
                    <span className="ch-muhurat-meaning">({item.meaning})</span>
                </div>

                <div className="ch-quality-col">
                    <span className="ch-quality-pill">{item.quality}</span>
                </div>
            </div>
        );
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="Today's Choghadiya" variant="dark" fullBleed={true}>
            <div className="panchang-cosmic-container">
                <div className="cosmic-bg-watermark"></div>

                <div className="panchang-header-card">
                    <h2 className="panchang-main-title">Today's Choghadiya</h2>

                    <div className="panchang-top-info-box">
                        <div className="sun-pill">
                            <span className="sun-icon">🌞</span>
                            <span className="sun-text">
                                Sunrise: {choghadiyaData.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="header-date">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>
                </div>

                <div className="day-night-toggle">
                    <div className="toggle-pill-container">
                        <button
                            className={`toggle-btn ${activeTab === 'Day' ? 'active-day' : ''}`}
                            onClick={() => setActiveTab('Day')}
                        >
                            <span className="toggle-icon">☀</span> Day
                        </button>
                        <button
                            className={`toggle-btn ${activeTab === 'Night' ? 'active-night' : ''}`}
                            onClick={() => setActiveTab('Night')}
                        >
                            <span className="toggle-icon">🌙</span> Night
                        </button>
                    </div>
                </div>

                <div className="table-header-glass">
                    <span className="th-col th-left">Time</span>
                    <span className="th-col th-center">Muhurat</span>
                    <span className="th-col th-right">Quality</span>
                </div>

                <div className="table-body-glass custom-scrollbar">
                    {(activeTab === 'Day' ? choghadiyaData.day : choghadiyaData.night).map(renderRow)}
                </div>

                <div className="legend-glass">
                    <div className="legend-item"><span className="legend-circle good-circle"></span> Good</div>
                    <div className="legend-item"><span className="legend-circle neutral-circle"></span> Neutral</div>
                    <div className="legend-item"><span className="legend-circle bad-circle"></span> Bad</div>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default PanchangPage;
