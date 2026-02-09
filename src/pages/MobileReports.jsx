import React from 'react';
import { FileText, Map, Activity, Heart, Star, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MobileReports.css';

const MobileReports = () => {
    const navigate = useNavigate();

    const reports = [
        { id: 'sample', title: 'Birth Chart (Sample)', icon: <Star size={24} color="#FFD700" />, route: '/sample' },
        { id: 'bca', title: 'Body Composition', icon: <Activity size={24} color="#43e97b" />, route: '/bca' }, // Assuming route exists or will be handled
        { id: 'compatibility', title: 'Matchmaking', icon: <Heart size={24} color="#ff512f" />, route: '/mobile/matchmaking' },
        { id: 'transits', title: 'Life Reports', icon: <Map size={24} color="#4facfe" />, route: '/mobile/life-reports' },
        { id: 'gemstone', title: 'Gemstone Report', icon: <Compass size={24} color="#f093fb" />, route: '/mobile/gemstone' },
    ];

    return (
        <div className="mobile-reports-container">
            <header className="page-header">
                <h2>Your Reports</h2>
                <p>Deep insights into your cosmic blueprint</p>
            </header>

            <div className="reports-grid">
                {reports.map((report) => (
                    <div key={report.id} className="report-card" onClick={() => navigate(report.route)}>
                        <div className="report-icon-wrapper">
                            {report.icon}
                        </div>
                        <div className="report-info">
                            <h3>{report.title}</h3>
                            <span className="view-link">View Report →</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MobileReports;
