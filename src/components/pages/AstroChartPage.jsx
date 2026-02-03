import React, { useState } from 'react';
import AstroChart from '../AstroChart';
import FullScreenOverlay from '../shared/FullScreenOverlay';
import BirthDetailsForm from '../BirthDetailsForm';
import './AstroChartPage.css';

const AstroChartPage = ({ isOpen, onClose }) => {
    const [isChartGenerated, setIsChartGenerated] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleFormSubmit = (data) => {
        setUserData(data);
        setIsChartGenerated(true);
    };

    return (
        <FullScreenOverlay isOpen={isOpen} onClose={onClose} title={isChartGenerated ? "Your Cosmic Map" : "Enter Birth Details"}>
            <div className="chart-page-container">
                {!isChartGenerated ? (
                    <div className="form-wrapper">
                        {/* We pass a modified onSubmit that just takes the data */}
                        <BirthDetailsForm onSubmit={handleFormSubmit} />
                    </div>
                ) : (
                    <div className="chart-result-view">
                        <div className="chart-header-info">
                            <h3>{userData?.name || 'User'}</h3>
                            <p>{userData?.day}/{userData?.month}/{userData?.year} at {userData?.hour}:{userData?.min} | {userData?.place}</p>
                        </div>

                        <div className="chart-wrapper-large">
                            <AstroChart />
                        </div>

                        <div className="chart-details">
                            <div className="detail-card">
                                <h3>Sun Sign</h3>
                                <p>Calculating based on {userData?.month}th month...</p>
                            </div>
                            <div className="detail-card">
                                <h3>Moon Sign</h3>
                                <p>Mapping lunar nodes for {userData?.place}...</p>
                            </div>
                            <div className="detail-card">
                                <h3>Ascendant</h3>
                                <p>Determining rising constellation...</p>
                            </div>
                        </div>

                        <div className="chart-action-area">
                            <button className="gold-btn" onClick={() => setIsChartGenerated(false)}>Back to Input</button>
                            <p className="note">Unlock your karmic blueprint</p>
                        </div>
                    </div>
                )}
            </div>
        </FullScreenOverlay>
    );
};

export default AstroChartPage;
