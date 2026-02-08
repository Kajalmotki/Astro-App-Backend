import React from 'react';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import './PanchangPage.css';

const PanchangPage = ({ isOpen, onClose }) => {
    const [choghadiyaData, setChoghadiyaData] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('Day'); // 'Day' or 'Night'

    React.useEffect(() => {
        if (isOpen) {
            import('../../utils/choghadiyaUtils').then(({ calculateChoghadiya }) => {
                const data = calculateChoghadiya(new Date());
                setChoghadiyaData(data);
            });
        }
    }, [isOpen]);

    if (!choghadiyaData) return null;

    const renderRow = (item, index) => {
        const now = new Date();
        const isActive = now >= item.start && now < item.end;

        return (
            <div key={index} className={`choghadiya-row ${item.quality.toLowerCase()} ${isActive ? 'active-row' : ''}`}>
                <div className="ch-time">
                    {item.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {item.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="ch-name">
                    <strong>{item.name}</strong>
                    <span className="ch-meaning">({item.meaning})</span>
                </div>
                <div className="ch-quality">
                    <span className={`quality-badge ${item.quality.toLowerCase()}`}>{item.quality}</span>
                </div>
            </div>
        );
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title="Today's Choghadiya" variant="warm">
            <div className="panchang-native-container">
                <div className="panchang-header-info">
                    <div className="info-pill">
                        <span className="icon">🌅</span> Sunrise: {choghadiyaData.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="info-date">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div className="info-pill">
                        <span className="icon">🌙</span> Sunset: {choghadiyaData.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="panchang-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'Day' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Day')}
                    >
                        ☀ Day Choghadiya
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'Night' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Night')}
                    >
                        🌙 Night Choghadiya
                    </button>
                </div>

                <div className="choghadiya-table">
                    <div className="table-header">
                        <span>Time</span>
                        <span>Muhurat</span>
                        <span>Quality</span>
                    </div>
                    <div className="table-body">
                        {(activeTab === 'Day' ? choghadiyaData.day : choghadiyaData.night).map(renderRow)}
                    </div>
                </div>

                <div className="legend">
                    <span className="legend-item good"><span className="dot"></span> Good</span>
                    <span className="legend-item neutral"><span className="dot"></span> Neutral</span>
                    <span className="legend-item bad"><span className="dot"></span> Bad</span>
                </div>
            </div>
        </FullScreenOverlay>
    );
};

export default PanchangPage;
