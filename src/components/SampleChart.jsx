import React from 'react';
import SampleReportView from './SampleReportView';
import './SampleChart.css';

const SampleChart = () => {
    return (
        <div className="sample-chart-page">
            {/* Custom Header for this flow */}
            <header className="sample-header">
                <span className="header-title">AstroRevo Chart (Sample)</span>
            </header>

            <main className="sample-content" style={{ padding: 0 }}>
                <SampleReportView />
            </main>
        </div>
    );
};

export default SampleChart;
