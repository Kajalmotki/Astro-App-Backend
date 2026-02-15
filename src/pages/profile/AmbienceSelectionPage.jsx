import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Music, Play, Pause, Volume2 } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import './ProfilePages.css';

const AmbienceSelectionPage = () => {
    const navigate = useNavigate();
    const { isPlaying, currentTrack, togglePlay, playTrack, tracks } = useMusic();

    return (
        <div className="profile-page-container">
            <header className="profile-page-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="profile-page-title">Ambience & Music</h2>
            </header>

            {/* Now Playing Card */}
            <div className="profile-card" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))', textAlign: 'center', padding: '30px 20px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,215,0,0.1)', border: '2px solid rgba(255,215,0,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px auto', fontSize: '32px'
                }}>
                    {currentTrack.icon}
                </div>
                <h3 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '20px' }}>{currentTrack.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
                    {isPlaying ? 'Now Playing' : 'Paused'}
                </p>

                <button
                    onClick={togglePlay}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: '#FFD700', border: 'none',
                        color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
                    }}
                >
                    {isPlaying ? <Pause size={28} fill="#0f172a" /> : <Play size={28} fill="#0f172a" style={{ marginLeft: '4px' }} />}
                </button>
            </div>

            <h3 style={{ fontSize: '16px', margin: '24px 0 12px 12px', color: '#cbd5e1' }}>Select Soundscape</h3>

            <div className="profile-option-group">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className={`radio-option ${currentTrack.id === track.id ? 'selected' : ''}`}
                        onClick={() => playTrack(track)}
                        style={{ padding: '12px 16px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                            }}>
                                {track.icon}
                            </div>
                            <div className="item-info">
                                <h4 style={{ color: currentTrack.id === track.id ? '#FFD700' : 'white', fontSize: '15px' }}>{track.name}</h4>
                            </div>
                        </div>

                        {currentTrack.id === track.id && isPlaying && (
                            <div className="item-status" style={{ background: 'transparent', color: '#FFD700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Volume2 size={16} />
                                <span style={{ fontSize: '12px' }}>Playing</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmbienceSelectionPage;
