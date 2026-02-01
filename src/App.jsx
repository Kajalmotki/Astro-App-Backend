import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AstroWorkflowChart from './components/AstroWorkflowChart';
import ChatInterface from './components/ChatInterface';
import AstroAssistant from './components/AstroAssistant';
import MarketingMatrix from './components/MarketingMatrix';
import ChatPage from './pages/ChatPage';
import KnowledgeSources from './components/KnowledgeSources';
import SampleChart from './components/SampleChart';
import UserOnboarding from './components/UserOnboarding';
import AuthModal from './components/AuthModal';
import MembershipModal from './components/MembershipModal';

import OmRain from './components/OmRain';
import OmPlayer from './components/OmPlayer';
import ChakraEnergy from './components/ChakraEnergy';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import DonationSection from './components/DonationSection';
import PremiumDashboard from './components/PremiumDashboard';
import { useAuth } from './components/AuthModal';
import WorkflowCanvas from './components/workflow/WorkflowCanvas';
import './App.css';
import './components/HookedCTA.css';

const LandingPage = ({ handleQuestionSelect, activeQuestion, onLoginClick }) => {
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Autoplay may be blocked; user can unmute to start sound.
        });
      }
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <main className="content">
      <section className="hero-section">
        <div className="main-hero-video">
          <video ref={videoRef} className="main-hero-video-media" autoPlay loop playsInline muted preload="auto">
            <source src="/hero-section.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="main-hero-video-overlay"></div>
          <button className="video-mute-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
          <div className="main-hero-text">
            <h1 className="main-hero-title">Ancient wisdom, Instant clarity</h1>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <MarketingMatrix />
        <div className="hero-layout">
          <div className="workflow-section">
            <div className="hooked-cta-container">
              <div className="hook left-hook"></div>
              <Link to="/sample" className="cta-square-btn golden-highlight">
                <span className="btn-text">The AstroRevo Chart (Sample)</span>
              </Link>
              <div className="hook right-hook"></div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="chat-window" className="assistant-showcase-section">
        <div className="assistant-layout-container">
          <div className="assistant-message-side">
            <div className="side-text-content">
              <h2 className="showcase-title gold-text" style={{ textAlign: 'left', marginBottom: '20px' }}>Always By Your Side, 24/7</h2>
              <p>At AstroRevo, we believe that cosmic guidance should never be limited by timezone or availability. Our AI Assistant is crafted to be your eternal companion, standing ready at every sunrise, every midnight, and every moment of doubt in between.</p>
              <p>We are dedicated to supporting our seekers with unwavering commitment. Whether you need a quick planetary check, a moment of spiritual grounding, or a deep dive into your karmic patterns, we are here to provide instant, precise, and empathetic insights.</p>
              <p className="highlight-text">Value Beyond Prediction:</p>
              <ul className="value-list">
                <li><strong>Real-time Adaptability:</strong> As transits shift, so does our advice, giving you the most current cosmic weather.</li>
                <li><strong>Secure Spiritual Cloud:</strong> Save your birth details and notes securely, building a lifetime map of your growth.</li>
                <li><strong>Personalized Remedies:</strong> Receive actionable Vedic solutions tailored specifically to your unique planetary strengths.</li>
              </ul>
            </div>
          </div>

          <div className="assistant-rectangle-wrapper">
            <AstroAssistant onLoginClick={onLoginClick} />
          </div>
        </div>
      </section>
    </main>
  );
};

function AppContent() {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { user } = useAuth();

  const handleQuestionSelect = (question) => {
    setActiveQuestion(question);
    navigate('/chat', { state: { initialQuestion: question } });
  };

  return (
    <div className="app-container">
      <OmRain />
      <OmPlayer />
      <ChakraEnergy />
      <Header
        onLoginClick={() => setIsAuthOpen(true)}
        onMembershipClick={() => setIsDashboardOpen(true)}
      />
      <UserOnboarding />
      <Routes>
        <Route path="/" element={
          <LandingPage
            handleQuestionSelect={handleQuestionSelect}
            activeQuestion={activeQuestion}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        } />
        <Route path="/knowledge" element={<KnowledgeSources />} />
        <Route path="/sample" element={<SampleChart />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/workflow" element={<WorkflowCanvas />} />
      </Routes>
      <DonationSection />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={() => console.log('Auth success')}
        onMembershipPrompt={() => setIsDashboardOpen(true)}
      />
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
      />
      <PremiumDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
      />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
