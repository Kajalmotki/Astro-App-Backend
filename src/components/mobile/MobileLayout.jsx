import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import StarfieldBackground from '../StarfieldBackground'; // Reusing existing background
import './MobileLayout.css';

const MobileLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Define main tabs where back button should NOT appear
    // Also check for root /mobile route just in case
    const mainTabs = ['/mobile/home', '/mobile/chat', '/mobile/reports', '/mobile/profile', '/mobile'];
    const showBackButton = !mainTabs.includes(location.pathname);

    return (
        <div className="mobile-layout-container">
            <StarfieldBackground />

            {showBackButton && (
                <header className="mobile-back-header">
                    <button onClick={() => navigate(-1)} className="mobile-back-btn">
                        ← Back
                    </button>
                </header>
            )}

            <div className={`mobile-content-area ${showBackButton ? 'has-back-header' : ''}`}>
                <Outlet />
            </div>
            <BottomNavigation />
        </div>
    );
};

export default MobileLayout;
