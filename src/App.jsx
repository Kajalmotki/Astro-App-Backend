import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
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

import ScrollingTicker from './components/ScrollingTicker';


import ChakraEnergy from './components/ChakraEnergy';
import BCAAnalysis from './components/BCAAnalysis';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import DonationSection from './components/DonationSection';
import PremiumDashboard from './components/PremiumDashboard';
import { useAuth } from './components/AuthModal';
import WorkflowCanvas from './components/workflow/WorkflowCanvas';
import VedicInfoSection from './components/VedicInfoSection';
import StarfieldBackground from './components/StarfieldBackground';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
import './components/HookedCTA.css';

import WhyAstroRevo from './components/WhyAstroRevo';
import InstallPrompt from './components/InstallPrompt';

// Mobile Imports
import MobileLayout from './components/mobile/MobileLayout';
import MobileHome from './pages/MobileHome';
import MobileReports from './pages/MobileReports';
import MobileProfile from './pages/MobileProfile';
import MobileKundli from './pages/MobileKundli';
import MobileMatchmaking from './pages/MobileMatchmaking';

// Feature Pages for Mobile Routes
import AstroChartPage from './components/pages/AstroChartPage';
import PanchangPage from './components/pages/PanchangPage';
import HoroscopePage from './components/pages/HoroscopePage';
import GemstonesPage from './components/pages/GemstonesPage';
import KarmicReadingPage from './components/pages/KarmicReadingPage';
import NumerologyPage from './components/pages/NumerologyPage';
import VirtualPooja from './components/VirtualPooja';

const LandingPage = ({ handleQuestionSelect, activeQuestion, onLoginClick }) => {
  const location = useLocation();
  const [isMuted, setIsMuted] = React.useState(true);
  const [showIntroVideo, setShowIntroVideo] = React.useState(true);
  const [isScrolledPastHero, setIsScrolledPastHero] = React.useState(false);
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

  React.useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) {
        setIsScrolledPastHero(false);
        return;
      }

      const heroBounds = heroSection.getBoundingClientRect();
      setIsScrolledPastHero(heroBounds.bottom <= 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <main className="content">
      <WhyAstroRevo isHidden={isScrolledPastHero} />
      <section className="hero-section">
        <div className="main-hero-video">
          <video ref={videoRef} className="main-hero-video-media" autoPlay loop playsInline muted preload="auto">
            <source src="/videos/night_sky_timelapse.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="main-hero-video-overlay"></div>

          <button className="video-mute-btn" onClick={toggleMute}>
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          <div className="main-hero-text">
            <h1 className="main-hero-title">Ancient wisdom, Instant clarity</h1>
          </div>
        </div>
      </section>


      <section style={{ margin: '6rem 0' }}>
        <ScrollingTicker />
      </section>

      <VedicInfoSection />

      <section className="marketing-section">
        <MarketingMatrix />
        <div className="hero-layout">
          <div className="workflow-section">
            <div className="hooked-cta-container">
              <div className="hook left-hook"></div>
              <Link to="/sample" className="cta-square-btn golden-highlight cosmic-universe-bg">
                <span className="btn-text">The AstroRevo Chart (Sample)</span>
              </Link>
              <div className="hook right-hook"></div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {!location.pathname.includes('/chat') && <DonationSection />}

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
  const location = useLocation();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { user } = useAuth();
  const [isNativeChecked, setIsNativeChecked] = useState(false);

  const isNative = Capacitor.isNativePlatform();
  const isMobileRoute = location.pathname.startsWith('/mobile');
  const isChatPage = location.pathname.toLowerCase().includes('chat');

  // Detect if user is on a mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth <= 768;
  };

  useEffect(() => {
    const isMobile = isMobileDevice();

    // Redirect to mobile home if native app or mobile device and on root or desktop route
    if ((isNative || isMobile) && (location.pathname === '/' || (!location.pathname.startsWith('/mobile') && !location.pathname.startsWith('/chat')))) {
      console.log("Detected mobile device, redirecting to mobile home");
      navigate('/mobile/home');
    }

    // Redirect to desktop home if desktop device and on mobile route
    if (!isNative && !isMobile && location.pathname.startsWith('/mobile')) {
      console.log("Detected desktop device, redirecting to desktop home");
      navigate('/');
    }

    setIsNativeChecked(true);
  }, [isNative, location.pathname, navigate]);

  const handleQuestionSelect = (question) => {
    setActiveQuestion(question);
    navigate('/chat', { state: { initialQuestion: question } });
  };

  // If in mobile mode/route, we don't render the desktop header/footer wrappers
  // The MobileLayout handles its own structure.
  if (isMobileRoute) {
    return (
      <div className="app-container mobile-app-container">
        <Routes>
          <Route path="/mobile" element={<MobileLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<MobileHome />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="reports" element={<MobileReports />} />
            <Route path="profile" element={<MobileProfile />} />
            <Route path="full-kundli" element={<MobileKundli />} />
            <Route path="matchmaking" element={<MobileMatchmaking />} />
            <Route path="bca" element={<div className="page-content" style={{ paddingTop: '60px' }}><BCAAnalysis isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />

            {/* Feature Routes mapped for Mobile Ticker */}
            <Route path="astro-chart" element={<div className="page-content" style={{ paddingTop: '60px' }}><AstroChartPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="panchang" element={<div className="page-content" style={{ paddingTop: '60px' }}><PanchangPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="virtual-pooja" element={<div className="page-content" style={{ paddingTop: '60px' }}><VirtualPooja isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="horoscope" element={<div className="page-content" style={{ paddingTop: '60px' }}><HoroscopePage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="gemstones" element={<div className="page-content" style={{ paddingTop: '60px' }}><GemstonesPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="karmic-reading" element={<div className="page-content" style={{ paddingTop: '60px' }}><KarmicReadingPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="numerology" element={<div className="page-content" style={{ paddingTop: '60px' }}><NumerologyPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
            <Route path="sample" element={<div className="page-content" style={{ paddingTop: '0px' }}><SampleChart /></div>} />

            {/* Redirects/Placeholders */}
            <Route path="life-reports" element={<MobileReports />} />
            <Route path="gemstone" element={<MobileReports />} />
          </Route>
        </Routes>
      </div>
    )
  }

  return (
    <div className="app-container">
      <StarfieldBackground />

      {!isChatPage && <ChakraEnergy />}
      {!isChatPage && (
        <Header
          onLoginClick={() => setIsAuthOpen(true)}
          onMembershipClick={() => setIsDashboardOpen(true)}
        />
      )}
      {!isChatPage && <UserOnboarding />}

      <Routes>
        <Route path="/" element={
          <LandingPage
            handleQuestionSelect={handleQuestionSelect}
            activeQuestion={activeQuestion}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        } />
        <Route path="/mobile" element={<Navigate to="/mobile/home" replace />} />
        <Route path="/knowledge" element={<KnowledgeSources />} />
        <Route path="/sample" element={<SampleChart />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/workflow" element={<WorkflowCanvas />} />
      </Routes>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={() => console.log('Auth success')}
        onMembershipPrompt={() => setIsDashboardOpen(true)}
      />
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        onSuccess={() => {
          setIsMembershipOpen(false);
          setIsDashboardOpen(true);
        }}
      />
      <PremiumDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        user={user}
      />
      {!isChatPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <InstallPrompt />
      <AppContent />
    </Router>
  );
}

export default App;
