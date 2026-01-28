import React, { useState, useRef, useEffect } from 'react';
import WorkflowNode from './WorkflowNode';
import ConnectionLine from './ConnectionLine';
import NodeDetailPanel from './NodeDetailPanel';
import './WorkflowCanvas.css';

// Initial node configuration with predefined positions
const INITIAL_NODES = [
    {
        id: 'nimitta',
        label: 'NIMITTA',
        subtitle: 'Modifiers',
        position: { x: 300, y: 200 },
        type: 'modifier',
        icon: '🔮'
    },
    {
        id: 'dasha',
        label: 'DASHA',
        subtitle: 'Chara Dasha',
        position: { x: 300, y: 500 },
        type: 'calculation',
        icon: '⏳'
    },
    {
        id: 'karaka',
        label: 'KARAKA',
        subtitle: '7 Karakas',
        position: { x: 900, y: 350 },
        type: 'logic',
        icon: '⭐'
    },
    {
        id: 'rashi-bhava',
        label: 'RASHI & BHAVA',
        subtitle: 'B.P.H.S.',
        position: { x: 1500, y: 200 },
        type: 'logic',
        icon: '🏛️'
    },
    {
        id: 'ai-chat',
        label: 'AI CHAT',
        subtitle: 'Gemini AI',
        position: { x: 1500, y: 600 },
        type: 'output',
        icon: '🤖'
    }
];

// Connection configuration
const CONNECTIONS = [
    { from: 'nimitta', to: 'dasha' },
    { from: 'dasha', to: 'karaka' },
    { from: 'karaka', to: 'rashi-bhava' },
    { from: 'karaka', to: 'ai-chat' },
    { from: 'rashi-bhava', to: 'ai-chat' }
];

const WorkflowCanvas = () => {
    // Load positions from localStorage or use defaults
    const loadNodes = () => {
        const saved = localStorage.getItem('astrorevo-workflow-nodes');
        return saved ? JSON.parse(saved) : INITIAL_NODES;
    };

    const [nodes, setNodes] = useState(loadNodes);
    const [selectedNode, setSelectedNode] = useState(null);
    const [draggingNode, setDraggingNode] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // Save positions to localStorage whenever nodes change
    useEffect(() => {
        localStorage.setItem('astrorevo-workflow-nodes', JSON.stringify(nodes));
    }, [nodes]);

    // Handle drag start
    const handleDragStart = (nodeId, event) => {
        const node = nodes.find(n => n.id === nodeId);
        const rect = event.currentTarget.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();

        setDraggingNode(nodeId);
        setDragOffset({
            x: event.clientX - rect.left - canvasRect.left + canvasRef.current.scrollLeft,
            y: event.clientY - rect.top - canvasRect.top + canvasRef.current.scrollTop
        });
    };

    // Handle drag move
    const handleDragMove = (event) => {
        if (!draggingNode) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = event.clientX - canvasRect.left + canvasRef.current.scrollLeft - dragOffset.x;
        const newY = event.clientY - canvasRect.top + canvasRef.current.scrollTop - dragOffset.y;

        setNodes(prevNodes =>
            prevNodes.map(node =>
                node.id === draggingNode
                    ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
                    : node
            )
        );

        // Auto-scroll near edges
        autoScroll(event.clientX, event.clientY, canvasRect);
    };

    // Auto-scroll when dragging near canvas edges
    const autoScroll = (clientX, clientY, canvasRect) => {
        const scrollMargin = 50;
        const scrollSpeed = 10;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (clientX - canvasRect.left < scrollMargin) {
                canvasRef.current.scrollLeft -= scrollSpeed;
            } else if (canvasRect.right - clientX < scrollMargin) {
                canvasRef.current.scrollLeft += scrollSpeed;
            }

            if (clientY - canvasRect.top < scrollMargin) {
                canvasRef.current.scrollTop -= scrollSpeed;
            } else if (canvasRect.bottom - clientY < scrollMargin) {
                canvasRef.current.scrollTop += scrollSpeed;
            }
        }, 16);
    };

    // Handle drag end
    const handleDragEnd = () => {
        setDraggingNode(null);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
    };

    // Handle node click
    const handleNodeClick = (nodeId) => {
        if (!draggingNode) {
            setSelectedNode(nodes.find(n => n.id === nodeId));
        }
    };

    // Get node position by ID
    const getNodePosition = (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        return node ? { x: node.position.x + 60, y: node.position.y + 60 } : { x: 0, y: 0 };
    };

    // Add global mouse event listeners
    useEffect(() => {
        const handleMouseMove = (e) => handleDragMove(e);
        const handleMouseUp = () => handleDragEnd();

        if (draggingNode) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingNode, dragOffset]);

    return (
        <div className="workflow-canvas-wrapper">
            <div className="workflow-canvas" ref={canvasRef}>
                <div className="workflow-content">
                    {/* Render connection lines */}
                    <svg className="workflow-connections" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {CONNECTIONS.map((conn, idx) => (
                            <ConnectionLine
                                key={idx}
                                from={getNodePosition(conn.from)}
                                to={getNodePosition(conn.to)}
                                isActive={false}
                            />
                        ))}
                    </svg>

                    {/* Render nodes */}
                    {nodes.map(node => (
                        <WorkflowNode
                            key={node.id}
                            {...node}
                            onDragStart={(e) => handleDragStart(node.id, e)}
                            onClick={() => handleNodeClick(node.id)}
                            isDragging={draggingNode === node.id}
                        />
                    ))}
                </div>
            </div>

            {/* Side panel */}
            {selectedNode && (
                <NodeDetailPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                />
            )}
        </div>
    );
};

export default WorkflowCanvas;
