import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, FileText, X } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';
import './CaseStudiesPage.css'; // Assuming we might add specific CSS later

const CaseStudiesPage = () => {
    const navigate = useNavigate();
    const [selectedStudy, setSelectedStudy] = useState(null);

    return (
        <div className="case-studies-container" style={{ background: '#0a0a15', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer' }}>
                    <ArrowLeft size={28} />
                </button>
                <h1 style={{ marginLeft: '15px', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Astrological Case Studies
                </h1>
            </header>

            {/* Case Studies List */}
            <div className="studies-grid" style={{ display: 'grid', gap: '20px' }}>
                {caseStudies.map(study => (
                    <div
                        key={study.id}
                        onClick={() => setSelectedStudy(study)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            borderRadius: '16px',
                            padding: '15px',
                            cursor: 'pointer',
                            gap: '15px'
                        }}
                    >
                        <img
                            src={study.image}
                            alt={study.subject}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFD700' }}
                        />
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#fff' }}>{study.title}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{study.subject}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedStudy && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(10, 10, 20, 0.98)', zIndex: 2000, overflowY: 'auto',
                    padding: '20px', boxSizing: 'border-box'
                }}>
                    <button
                        onClick={() => setSelectedStudy(null)}
                        style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ maxWidth: '800px', margin: '40px auto 80px', textAlign: 'center' }}>
                        <img
                            src={selectedStudy.image}
                            alt={selectedStudy.subject}
                            style={{ width: '150px', height: '150px', borderRadius: '50%', border: '3px solid #FFD700', marginBottom: '20px' }}
                        />
                        <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '10px' }}>{selectedStudy.title}</h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>{selectedStudy.summary}</p>

                        <div style={{ background: 'rgba(255,215,0,0.1)', padding: '20px', borderRadius: '15px', textAlign: 'left', marginBottom: '30px' }}>
                            <h3 style={{ color: '#FFD700', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                <Star size={20} style={{ marginRight: '10px' }} /> Key Configurations
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {selectedStudy.chart_points.map((point, i) => (
                                    <li key={i} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: '6px', height: '6px', background: '#FFD700', borderRadius: '50%', marginRight: '10px' }}></span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ textAlign: 'left', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-line' }}>
                            <h3 style={{ color: '#FFD700', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                <FileText size={20} style={{ marginRight: '10px' }} /> Astrological Analysis
                            </h3>
                            {selectedStudy.analysis}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseStudiesPage;
