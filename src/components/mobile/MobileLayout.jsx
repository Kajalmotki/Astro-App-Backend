import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import MobileHeader from './MobileHeader';
import './MobileLayout.css';

const MobileLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMembershipOpen, setIsMembershipOpen] = useState(false);

    // Define main tabs where back button should NOT appear
    // Also check for root /mobile route just in case
    const mainTabs = ['/mobile/home', '/mobile/chat', '/mobile/reports', '/mobile/profile', '/mobile'];

    // Pages that have their own custom glassmorphic headers and should NOT show the default back button
    const customHeaderPages = ['/mobile/matchmaking', '/mobile/astro-chart', '/mobile/tarot-reveal', '/mobile/local-ai'];

    const showBackButton = !mainTabs.includes(location.pathname) && !customHeaderPages.includes(location.pathname);
    const showMobileHeader = mainTabs.includes(location.pathname);

    return (
        <div className="mobile-layout-container">
            {/* Video Background */}
            <div className="mobile-video-background">
                <video autoPlay loop muted playsInline className="mobile-video-media">
                    <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
                </video>
                <div className="mobile-video-overlay"></div>
            </div>

            {/* Mobile Header for Main Tabs */}
            {showMobileHeader && (
                <MobileHeader
                    onLoginClick={() => setIsAuthOpen(true)}
                    onMembershipClick={() => setIsMembershipOpen(true)}
                />
            )}

            {/* Back Button Header for Sub-pages */}
            {showBackButton && (
                <header className="mobile-back-header">
                    <button onClick={() => navigate(-1)} className="mobile-back-btn">
                        ← Back
                    </button>
                    {/* Optional: Add page title here if needed */}
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
