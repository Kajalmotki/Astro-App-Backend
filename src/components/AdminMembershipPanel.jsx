import React, { useState } from 'react';
import { activateMembership } from '../services/razorpayService';
import { useAuth } from './AuthModal';

const AdminMembershipPanel = () => {
    const { user } = useAuth();
    const [userId, setUserId] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [message, setMessage] = useState('');

    const handleActivate = async () => {
        if (!userId.trim()) {
            setMessage('Please enter a user ID');
            return;
        }

        try {
            const success = await activateMembership(userId, { paymentId });
            if (success) {
                setMessage(`✅ Membership activated for user: ${userId}`);
                setUserId('');
                setPaymentId('');
            } else {
                setMessage('❌ Failed to activate membership');
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    // Quick activate for current user
    const handleActivateCurrentUser = async () => {
        if (!user) {
            setMessage('❌ Please log in first');
            return;
        }

        try {
            const success = await activateMembership(user.uid, {
                paymentId: 'manual_activation_' + Date.now()
            });
            if (success) {
                setMessage(`✅ Membership activated for current user!`);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage('❌ Failed to activate membership');
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #d4af37',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '350px',
            zIndex: 10000,
            color: '#fff'
        }}>
            <h3 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>
                🔧 Admin: Membership Activation
            </h3>

            {user && (
                <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Current User: {user.email}</p>
                    <button
                        onClick={handleActivateCurrentUser}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: '#28a745',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Activate My Membership
                    </button>
                </div>
            )}

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid #444',
                        borderRadius: '5px',
                        color: '#fff'
                    }}
                />
                <input
                    type="text"
                    placeholder="Payment ID (optional)"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid #444',
                        borderRadius: '5px',
                        color: '#fff'
                    }}
                />
                <button
                    onClick={handleActivate}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#d4af37',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Activate Membership
                </button>
            </div>

            {message && (
                <div style={{
                    marginTop: '10px',
                    padding: '8px',
                    background: message.includes('✅') ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                    borderRadius: '5px',
                    fontSize: '0.85rem'
                }}>
                    {message}
                </div>
            )}

            <p style={{
                fontSize: '0.7rem',
                color: '#888',
                marginTop: '10px',
                fontStyle: 'italic'
            }}>
                ⚠️ Development only - Remove in production
            </p>
        </div>
    );
};

export default AdminMembershipPanel;
