import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, FileText, User, Infinity } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = () => {


    return (
        <>

            <nav className="mobile-bottom-nav">
                <NavLink to="/mobile/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <Home size={24} />
                        {/* <div className="nav-indicator"></div> */}
                    </div>
                    <span className="nav-label">Home</span>
                </NavLink>

                <NavLink to="/mobile/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <MessageCircle size={24} />
                    </div>
                    <span className="nav-label">Ask AI</span>
                </NavLink>

                <NavLink to="/mobile/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <FileText size={24} />
                    </div>
                    <span className="nav-label">Reports</span>
                </NavLink>

                <NavLink to="/mobile/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon-container">
                        <User size={24} />
                    </div>
                    <span className="nav-label">Profile</span>
                </NavLink>
            </nav>
        </>
    );
};

export default BottomNavigation;
