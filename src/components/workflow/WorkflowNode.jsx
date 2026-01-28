import React from 'react';
import './WorkflowNode.css';

const WorkflowNode = ({
    id,
    label,
    subtitle,
    position,
    type,
    icon,
    onDragStart,
    onClick,
    isDragging
}) => {
    const handleMouseDown = (e) => {
        e.preventDefault();
        onDragStart(e);
    };

    const getNodeColor = () => {
        switch (type) {
            case 'modifier':
                return { border: 'rgba(138, 43, 226, 0.6)', glow: 'rgba(138, 43, 226, 0.3)' };
            case 'calculation':
                return { border: 'rgba(255, 215, 0, 0.6)', glow: 'rgba(255, 215, 0, 0.3)' };
            case 'logic':
                return { border: 'rgba(46, 139, 87, 0.6)', glow: 'rgba(46, 139, 87, 0.3)' };
            case 'output':
                return { border: 'rgba(255, 99, 71, 0.6)', glow: 'rgba(255, 99, 71, 0.3)' };
            default:
                return { border: 'rgba(255, 255, 255, 0.3)', glow: 'rgba(255, 255, 255, 0.2)' };
        }
    };

    const colors = getNodeColor();

    return (
        <div
            className={`workflow-node ${isDragging ? 'dragging' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                '--node-border-color': colors.border,
                '--node-glow-color': colors.glow
            }}
            onMouseDown={handleMouseDown}
            onClick={onClick}
        >
            <div className="node-content">
                <div className="node-icon">{icon}</div>
                <div className="node-label">{label}</div>
                <div className="node-subtitle">{subtitle}</div>
            </div>
            <div className="node-glow"></div>
        </div>
    );
};

export default WorkflowNode;
