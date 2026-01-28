import React from 'react';
import './NodeDetailPanel.css';

const NodeDetailPanel = ({ node, onClose }) => {
    const getNodeDescription = () => {
        switch (node.id) {
            case 'nimitta':
                return 'Nimitta represents the modifying factors in Vedic astrology. It analyzes external signs and omens that influence the chart reading.';
            case 'dasha':
                return 'Chara Dasha is a sign-based dasha system that reveals the timing of events in your life based on planetary periods.';
            case 'karaka':
                return 'The 7 Karakas are significators that represent different aspects of life: Atma (self), Amatya (career), Bhratri (siblings), Matri (mother), Pitri (father), Putra (children), and Gnati (relatives).';
            case 'rashi-bhava':
                return 'Rashi & Bhava analysis based on Brihat Parashara Hora Shastra examines the zodiac signs and houses to understand life areas and their influences.';
            case 'ai-chat':
                return 'AI Chat powered by Gemini AI provides instant answers to your astrological questions based on your complete chart analysis.';
            default:
                return 'Astrology module for chart analysis.';
        }
    };

    return (
        <>
            {/* Overlay */}
            <div className="panel-overlay" onClick={onClose}></div>

            {/* Panel */}
            <div className="node-detail-panel">
                <div className="panel-header">
                    <div className="panel-icon">{node.icon}</div>
                    <div className="panel-title-group">
                        <h2 className="panel-title">{node.label}</h2>
                        <p className="panel-subtitle">{node.subtitle}</p>
                    </div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>

                <div className="panel-content">
                    <div className="panel-section">
                        <h3>Description</h3>
                        <p>{getNodeDescription()}</p>
                    </div>

                    <div className="panel-section">
                        <h3>Type</h3>
                        <span className={`type-badge type-${node.type}`}>
                            {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                        </span>
                    </div>

                    <div className="panel-section">
                        <h3>Position</h3>
                        <p className="position-info">
                            X: {Math.round(node.position.x)}px, Y: {Math.round(node.position.y)}px
                        </p>
                    </div>
                </div>

                <div className="panel-footer">
                    <button className="panel-action-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default NodeDetailPanel;
