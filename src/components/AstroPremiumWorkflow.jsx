import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

const AstroPremiumWorkflow = ({ data }) => {
    const workflowRef = useRef(null);

    const handleDownload = async () => {
        if (workflowRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(workflowRef.current, { cacheBust: true, });
            download(dataUrl, `AstroRevo_Chart_${data?.name || 'User'}.png`);
        } catch (err) {
            console.error('Failed to download chart', err);
        }
    };

    const renderPath = (x1, y1, x2, y2, dashed = false) => {
        const cx = (x1 + x2) / 2;
        return (
            <path
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray={dashed ? "5,5" : "0"}
                opacity={dashed ? "0.3" : "0.6"}
            />
        );
    };

    return (
        <div className="premium-workflow-container glass-card" ref={workflowRef}>
            <div className="workflow-header">
                <div>
                    <h3 className="gold-text">AI-Driven 21-Question Decision Workflow</h3>
                    <p className="workflow-meta">AstroRevo Premium Engine: {data?.name || 'User Chart'}</p>
                </div>
                <button className="download-chart-btn" onClick={handleDownload}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
                    </svg>
                    Download
                </button>
            </div>

            <svg viewBox="-20 -20 1060 700" className="premium-workflow-svg">
                <defs>
                    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
                    </pattern>
                    <filter id="premiumGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <rect x="-20" y="-20" width="1060" height="700" fill="url(#dotGrid)" rx="20" />

                {/* --- 1. TRIGGER NODE --- */}
                <g transform="translate(50, 250)">
                    <rect width="160" height="100" rx="12" className="wf-node-bg" />
                    <path d="M20 20 L40 20 L40 40 M20 40 L40 40" fill="none" stroke="var(--primary)" strokeWidth="2" /> {/* Form Icon */}
                    <path d="M30 15 L25 25 L35 25 L30 35" fill="none" stroke="#FFD700" strokeWidth="2" /> {/* Lightning Icon */}
                    <text x="80" y="35" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">On Form Submission</text>
                    <text x="80" y="55" textAnchor="middle" fill="var(--text-dim)" fontSize="10">21-Question Intake</text>
                    <text x="80" y="80" textAnchor="middle" fill="var(--primary)" fontSize="8" opacity="0.7">Q1 – Q21 Data Feed</text>
                </g>
                {renderPath(210, 300, 380, 300)}

                {/* --- 2. AI AGENT NODE --- */}
                <g transform="translate(380, 220)">
                    <rect width="240" height="160" rx="15" className="wf-agent-node highlight" filter="url(#premiumGlow)" />
                    <rect x="100" y="30" width="40" height="30" rx="5" fill="var(--primary)" opacity="0.2" /> {/* Robot Icon Head */}
                    <circle cx="110" cy="40" r="2" fill="var(--primary)" />
                    <circle cx="130" cy="40" r="2" fill="var(--primary)" />

                    <text x="120" y="85" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">AI Agent</text>
                    <text x="120" y="105" textAnchor="middle" fill="var(--text-dim)" fontSize="11">Decision & Orchestration</text>

                    {/* Question Grouping Tooltip-like info */}
                    <g transform="translate(20, 125)">
                        <text x="0" y="0" fill="var(--primary)" fontSize="7" opacity="0.6">Q1-Q5: Identity Class</text>
                        <text x="100" y="0" fill="var(--primary)" fontSize="7" opacity="0.6">Q6-Q10: Access Logic</text>
                        <text x="0" y="12" fill="var(--primary)" fontSize="7" opacity="0.6">Q11-Q15: Risk Profile</text>
                        <text x="100" y="12" fill="var(--primary)" fontSize="7" opacity="0.6">Q16-Q21: Action Set</text>
                    </g>
                </g>

                {/* --- RESOURCES (Dashed below Agent) --- */}
                {/* LLM */}
                <g transform="translate(340, 480)">
                    <circle r="35" className="wf-resource-bg" />
                    <text textAnchor="middle" dy="5" fill="var(--text-dim)" fontSize="8">LLM Model</text>
                    {renderPath(340, 445, 420, 380, true)}
                </g>
                {/* Memory */}
                <g transform="translate(500, 520)">
                    <circle r="35" className="wf-resource-bg" />
                    <text textAnchor="middle" dy="5" fill="var(--text-dim)" fontSize="8">DB Memory</text>
                    {renderPath(500, 485, 500, 380, true)}
                </g>
                {/* Tools */}
                <g transform="translate(660, 480)">
                    <circle r="35" className="wf-resource-bg" />
                    <text textAnchor="middle" dy="5" fill="var(--text-dim)" fontSize="8">API Tools</text>
                    {renderPath(660, 445, 580, 380, true)}
                </g>

                {/* --- 3. DECISION NODE --- */}
                <g transform="translate(730, 260)">
                    <path d="M0 40 L40 0 L80 40 L40 80 Z" className="wf-decision-node" />
                    <text x="40" y="35" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Key Condition</text>
                    <text x="40" y="50" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Met?</text>
                </g>
                {renderPath(620, 300, 730, 300)}

                {/* --- 4. TRUE PATH (Invite) --- */}
                <g transform="translate(860, 120)">
                    <rect width="120" height="70" rx="10" className="wf-node-bg" />
                    <text x="60" y="30" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">Invite to Channel</text>
                    <text x="60" y="50" textAnchor="middle" fill="var(--text-dim)" fontSize="9">Leadership Sync</text>
                    <circle cx="-10" cy="50" r="10" fill="#2eb67d" /> {/* Slack Green */}
                </g>
                {renderPath(810, 300, 860, 155)}
                <text x="825" y="220" fill="#2eb67d" fontSize="10" fontWeight="bold">TRUE</text>

                {/* --- 5. FALSE PATH (Update) --- */}
                <g transform="translate(860, 380)">
                    <rect width="120" height="70" rx="10" className="wf-node-bg" />
                    <text x="60" y="30" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">Update Profile</text>
                    <text x="60" y="50" textAnchor="middle" fill="var(--text-dim)" fontSize="9">User Attributes</text>
                </g>
                {renderPath(810, 300, 860, 415)}
                <text x="825" y="380" fill="#e94560" fontSize="10" fontWeight="bold">FALSE</text>

                {/* --- 6. EXTENSIONS --- */}
                <g transform="translate(940, 500)">
                    <circle r="15" className="wf-node-bg" stroke="var(--primary)" strokeDasharray="2,2" />
                    <text textAnchor="middle" dy="4" fill="var(--primary)" fontSize="16">+</text>
                    <text x="-40" y="30" fill="var(--text-dim)" fontSize="8">Add Task</text>
                </g>

            </svg>
        </div>
    );
};

export default AstroPremiumWorkflow;
