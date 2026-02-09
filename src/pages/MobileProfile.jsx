import React from 'react';
import PremiumDashboard from '../components/PremiumDashboard';
import './MobileProfile.css';

const MobileProfile = () => {
    // Mock user for now or get from context
    const user = { displayName: 'Seeker', email: 'seeker@example.com' };

    return (
        <div className="mobile-profile-container">
            {/* 
        We reuse PremiumDashboard but force it to be "open" 
        and use CSS to adapt it to the mobile page layout 
        instead of a modal overlay.
      */}
            <div className="embedded-dashboard">
                <PremiumDashboard
                    isOpen={true}
                    onClose={() => { }}
                    user={user}
                />
            </div>
        </div>
    );
};

export default MobileProfile;
