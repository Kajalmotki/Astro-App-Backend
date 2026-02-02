import React from 'react';

const LagnaChart = ({ data }) => {
    // Mock house positions for planets for visualization
    const planets = [
        { name: 'Asc', house: 1, sign: 9 },
        { name: 'Sun', house: 5, sign: 1 },
        { name: 'Mon', house: 2, sign: 10 },
        { name: 'Mar', house: 10, sign: 6 },
        { name: 'Mer', house: 5, sign: 1 },
        { name: 'Jup', house: 7, sign: 3 },
        { name: 'Ven', house: 4, sign: 12 },
        { name: 'Sat', house: 11, sign: 7 },
        { name: 'Rah', house: 3, sign: 11 },
        { name: 'Ket', house: 9, sign: 5 }
    ];

    // Helper to group planets by house
    const houseData = planets.reduce((acc, p) => {
        if (!acc[p.house]) acc[p.house] = [];
        acc[p.house].push(p.name);
        return acc;
    }, {});

    return (
        <div className="lagna-chart-container glass-card">
            <h3 className="gold-text">Lagna Chart (D1)</h3>
            <div className="chart-wrapper">
                <svg viewBox="0 0 400 400" className="varna-chart">
                    {/* Outer Square */}
                    <rect x="10" y="10" width="380" height="380" fill="none" stroke="#2E8B57" strokeWidth="2.5" />

                    {/* Diamonds */}
                    <path d="M10 10 L390 390 M390 10 L10 390" stroke="#2E8B57" strokeWidth="2" opacity="0.6" />
                    <path d="M200 10 L10 200 L200 390 L390 200 Z" fill="none" stroke="#2E8B57" strokeWidth="2" />

                    {/* House Numbers & Planets */}
                    {/* House 1 (Top Center Diamond) */}
                    <text x="200" y="100" textAnchor="middle" className=" планеты">{houseData[1]?.join(' ')}</text>
                    <text x="200" y="130" textAnchor="middle" className="house-num">1</text>

                    {/* House 2 (Top Left Triangle) */}
                    <text x="100" y="60" textAnchor="middle" className="планеты">{houseData[2]?.join(' ')}</text>
                    <text x="115" y="85" textAnchor="middle" className="house-num">2</text>

                    {/* House 3 (Left Top Triangle) */}
                    <text x="60" y="100" textAnchor="middle" className="планеты">{houseData[3]?.join(' ')}</text>
                    <text x="85" y="115" textAnchor="middle" className="house-num">3</text>

                    {/* House 4 (Left Center Diamond) */}
                    <text x="100" y="200" textAnchor="middle" className="планеты">{houseData[4]?.join(' ')}</text>
                    <text x="130" y="200" textAnchor="middle" className="house-num">4</text>

                    {/* House 5 (Left Bottom Triangle) */}
                    <text x="60" y="300" textAnchor="middle" className="планеты">{houseData[5]?.join(' ')}</text>
                    <text x="85" y="285" textAnchor="middle" className="house-num">5</text>

                    {/* House 6 (Bottom Left Triangle) */}
                    <text x="100" y="340" textAnchor="middle" className="планеты">{houseData[6]?.join(' ')}</text>
                    <text x="115" y="315" textAnchor="middle" className="house-num">6</text>

                    {/* House 7 (Bottom Center Diamond) */}
                    <text x="200" y="310" textAnchor="middle" className="планеты">{houseData[7]?.join(' ')}</text>
                    <text x="200" y="280" textAnchor="middle" className="house-num">7</text>

                    {/* House 8 (Bottom Right Triangle) */}
                    <text x="300" y="340" textAnchor="middle" className="планеты">{houseData[8]?.join(' ')}</text>
                    <text x="285" y="315" textAnchor="middle" className="house-num">8</text>

                    {/* House 9 (Right Bottom Triangle) */}
                    <text x="340" y="300" textAnchor="middle" className="планеты">{houseData[9]?.join(' ')}</text>
                    <text x="315" y="285" textAnchor="middle" className="house-num">9</text>

                    {/* House 10 (Right Center Diamond) */}
                    <text x="300" y="200" textAnchor="middle" className="планеты">{houseData[10]?.join(' ')}</text>
                    <text x="270" y="200" textAnchor="middle" className="house-num">10</text>

                    {/* House 11 (Right Top Triangle) */}
                    <text x="340" y="100" textAnchor="middle" className="планеты">{houseData[11]?.join(' ')}</text>
                    <text x="315" y="115" textAnchor="middle" className="house-num">11</text>

                    {/* House 12 (Top Right Triangle) */}
                    <text x="300" y="60" textAnchor="middle" className="планеты">{houseData[12]?.join(' ')}</text>
                    <text x="285" y="85" textAnchor="middle" className="house-num">12</text>

                </svg>
            </div>
            <div className="chart-footer">
                <p><strong>Name:</strong> {data?.name || 'Guest'}</p>
                <p><strong>Place:</strong> {data?.place || 'Unknown'}</p>
            </div>
        </div>
    );
};

export default LagnaChart;
