import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Clock } from 'lucide-react';
import './ProfilePages.css';

const OrderHistoryPage = () => {
    const navigate = useNavigate();

    const orders = [
        { id: '#ORD-2025-001', item: 'Detailed Kundli Analysis', date: 'Feb 15, 2026', price: '₹999', status: 'completed' },
        { id: '#ORD-2024-892', item: 'Gemstone Recommendation', date: 'Jan 20, 2026', price: '₹499', status: 'completed' },
        { id: '#ORD-2024-850', item: 'Pooja Booking', date: 'Dec 10, 2025', price: '₹2100', status: 'completed' }
    ];

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Order History</h2>
            </header>

            <div className="profile-card">
                {orders.map((order, index) => (
                    <div key={index} className="profile-list-item">
                        <div className="item-icon" style={{ marginRight: '16px', color: 'var(--theme-accent, #FFD700)' }}>
                            <Package size={24} />
                        </div>
                        <div className="item-info">
                            <h4>{order.item}</h4>
                            <p>{order.id} • {order.date}</p>
                        </div>
                        <div className="item-meta">
                            <span className="item-price">{order.price}</span>
                            <span className={`item-status ${order.status}`}>{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted, #64748b)', fontSize: '13px', marginTop: '20px' }}>
                Showing last 3 months
            </p>
        </div>
    );
};

export default OrderHistoryPage;
