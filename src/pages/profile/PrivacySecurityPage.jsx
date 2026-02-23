import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Key, Trash2, Smartphone } from 'lucide-react';
import './ProfilePages.css';

const PrivacySecurityPage = () => {
    const navigate = useNavigate();

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Privacy & Security</h2>
            </header>

            <div className="profile-card">
                <div className="profile-list-item" onClick={() => { }}>
                    <div className="item-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Key size={20} color="var(--text-muted, #94a3b8)" />
                        <div>
                            <h4>Change Password</h4>
                            <p>Update your account password</p>
                        </div>
                    </div>
                    <ChevronLeft size={20} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
                </div>

                <div className="profile-list-item" onClick={() => { }}>
                    <div className="item-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Smartphone size={20} color="var(--text-muted, #94a3b8)" />
                        <div>
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security</p>
                        </div>
                    </div>
                    <div className="item-status">Disabled</div>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-list-item" onClick={() => { }}>
                    <div className="item-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={20} color="var(--text-muted, #94a3b8)" />
                        <div>
                            <h4>Data Privacy</h4>
                            <p>Manage how we use your data</p>
                        </div>
                    </div>
                    <ChevronLeft size={20} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
                </div>
            </div>

            <button className="profile-card" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}>
                <Trash2 size={20} />
                Delete Account
            </button>
        </div>
    );
};

export default PrivacySecurityPage;
