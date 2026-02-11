import React, { useState } from 'react';
import FullCustomerChart from './FullCustomerChart';
import './SampleChart.css';

const SampleChart = () => {
    // Default to 'paid' view to show the chart immediately as a sample
    const [view, setView] = useState('paid');

    // Hardcoded sample data for demostration
    const [userInfo, setUserInfo] = useState({
        name: "Rahul Sharma",
        place: "New Delhi, India",
        date: "14/08/1995",
        time: "10:30:00"
    });

    return (
        <div className="sample-chart-page">
            {/* Custom Header for this flow */}
            <header className="sample-header">
                <span className="header-title">AstroRevo Chart (Sample)</span>
            </header>

            <main className="sample-content">
                {/* Directly showing the result view as this is a sample/demo */}
                <div className="result-view-container">
                    <FullCustomerChart userInfo={userInfo} />
                </div>
            </main>
        </div>
    );
};

export default SampleChart;
