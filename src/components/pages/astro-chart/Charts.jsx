import React, { useState } from 'react';
import AstroChart from '../../AstroChart';

const Charts = ({ chartData, chartType, isLoading, error }) => {
    const [subTab, setSubTab] = useState('D1');

    return (
        <div className="charts-section">
            <div className="chart-tabs" style={{ marginBottom: '16px' }}>
                <div onClick={() => setSubTab('D1')} className={`ct-tab ${subTab === 'D1' ? 'on' : ''}`}>LAGNA (D1)</div>
                <div onClick={() => setSubTab('D9')} className={`ct-tab ${subTab === 'D9' ? 'on' : ''}`}>NAVAMSHA (D9)</div>
                <div onClick={() => setSubTab('D10')} className={`ct-tab ${subTab === 'D10' ? 'on' : ''}`}>DASAMSHA (D10)</div>
            </div>

            <div className="chart-visual-box" style={{ marginBottom: '16px' }}>
                {/* Note: In a real implementation, swapping subTab would fetch/display a different SVG. 
                    For now, it passes the main D1 data to AstroChart */}
                <AstroChart chartData={chartData} chartType={chartType} isLoading={isLoading} error={error} />
            </div>

            {/* Ashtakavarga added below the chart */}
            <div className="ashtak">
                <div className="ashtak-lbl">ASHTAKAVARGA POINTS (SARVASHTAKAVARGA)</div>
                <div className="ashtak-bars">
                    <div className="ab-wrap"><div className="ab" style={{ height: '32px' }}></div><div className="ab-l">Ar</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '24px' }}></div><div className="ab-l">Ta</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '40px' }}></div><div className="ab-l">Ge</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '20px' }}></div><div className="ab-l">Ca</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '36px' }}></div><div className="ab-l">Le</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '28px' }}></div><div className="ab-l">Vi</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '34px' }}></div><div className="ab-l">Li</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '18px' }}></div><div className="ab-l">Sc</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '22px' }}></div><div className="ab-l">Sa</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '30px' }}></div><div className="ab-l">Cp</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '38px' }}></div><div className="ab-l">Aq</div></div>
                    <div className="ab-wrap"><div className="ab" style={{ height: '26px' }}></div><div className="ab-l">Pi</div></div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
