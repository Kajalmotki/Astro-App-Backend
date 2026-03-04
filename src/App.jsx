import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Header from './components/Header';
import { useAuth } from './components/AuthModal';
import { MusicProvider } from './contexts/MusicContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy loading components
const AstroWorkflowChart = lazy(() => import('./components/AstroWorkflowChart'));
const ChatInterface = lazy(() => import('./components/ChatInterface'));
const AstroAssistant = lazy(() => import('./components/AstroAssistant'));
const MarketingMatrix = lazy(() => import('./components/MarketingMatrix'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const KnowledgeSources = lazy(() => import('./components/KnowledgeSources'));
const SampleChart = lazy(() => import('./components/SampleChart'));
const UserOnboarding = lazy(() => import('./components/UserOnboarding'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const MembershipModal = lazy(() => import('./components/MembershipModal'));
const ScrollingTicker = lazy(() => import('./components/ScrollingTicker'));
const ChakraEnergy = lazy(() => import('./components/ChakraEnergy'));
const BCAAnalysis = lazy(() => import('./components/BCAAnalysis'));
const Footer = lazy(() => import('./components/Footer'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const DonationSection = lazy(() => import('./components/DonationSection'));
const PremiumDashboard = lazy(() => import('./components/PremiumDashboard'));
const WorkflowCanvas = lazy(() => import('./components/workflow/WorkflowCanvas'));
const VedicInfoSection = lazy(() => import('./components/VedicInfoSection'));
const StarfieldBackground = lazy(() => import('./components/StarfieldBackground'));
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const WhyAstroRevo = lazy(() => import('./components/WhyAstroRevo'));

// Mobile Lazy Loads
const MobileLayout = lazy(() => import('./components/mobile/MobileLayout'));
const MobileHome = lazy(() => import('./pages/MobileHome'));
const MobileReports = lazy(() => import('./pages/MobileReports'));
const MobileProfile = lazy(() => import('./pages/MobileProfile'));
const MobileKundli = lazy(() => import('./pages/MobileKundli'));
const MobileMatchmaking = lazy(() => import('./pages/MobileMatchmaking'));
const MobilePlanetTrackers = lazy(() => import('./pages/MobilePlanetTrackers'));
const LocalAIChat = lazy(() => import('./components/mobile/LocalAIChat'));
const AboutUsPage = lazy(() => import('./components/mobile/AboutUsPage'));

// Feature Pages for Mobile Routes
const AstroChartPage = lazy(() => import('./components/pages/AstroChartPage'));
const PanchangPage = lazy(() => import('./components/pages/PanchangPage'));
const HoroscopePage = lazy(() => import('./components/pages/HoroscopePage'));
const GemstonesPage = lazy(() => import('./components/pages/GemstonesPage'));
const KarmicReadingPage = lazy(() => import('./components/pages/KarmicReadingPage'));
const NumerologyPage = lazy(() => import('./components/pages/NumerologyPage'));
const WesternChartPage = lazy(() => import('./components/pages/WesternChartPage'));
const VirtualPooja = lazy(() => import('./components/VirtualPooja'));
const TarotRevealPage = lazy(() => import('./components/pages/TarotRevealPage'));
const MajorArcanaPage = lazy(() => import('./components/pages/MajorArcanaPage'));

// Profile Pages
const OrderHistoryPage = lazy(() => import('./pages/profile/OrderHistoryPage'));
const ChatHistoryPage = lazy(() => import('./pages/profile/ChatHistoryPage'));
const LanguageSettingsPage = lazy(() => import('./pages/profile/LanguageSettingsPage'));
const PrivacySecurityPage = lazy(() => import('./pages/profile/PrivacySecurityPage'));
const HelpSupportPage = lazy(() => import('./pages/profile/HelpSupportPage'));
const AmbienceSelectionPage = lazy(() => import('./pages/profile/AmbienceSelectionPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));

// Trackers
const SaturnTracker = lazy(() => import('./components/mobile/SaturnTracker'));
const PlanetaryStrengthening = lazy(() => import('./components/mobile/PlanetaryStrengthening'));
const MarsTracker = lazy(() => import('./components/mobile/trackers/MarsTracker'));
const SunTracker = lazy(() => import('./components/mobile/trackers/SunTracker'));
const MoonTracker = lazy(() => import('./components/mobile/trackers/MoonTracker'));
const MercuryTracker = lazy(() => import('./components/mobile/trackers/MercuryTracker'));
const JupiterTracker = lazy(() => import('./components/mobile/trackers/JupiterTracker'));
const VenusTracker = lazy(() => import('./components/mobile/trackers/VenusTracker'));
const RahuTracker = lazy(() => import('./components/mobile/trackers/RahuTracker'));
const KetuTracker = lazy(() => import('./components/mobile/trackers/KetuTracker'));
const LifeTracker = lazy(() => import('./components/mobile/LifeTracker'));

// Loading Screen Component
const PageLoading = () => (
  <div style={{
    height: '100vh',
    width: '100%',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFD700',
    fontFamily: 'serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div className="pulse-glow" style={{ fontSize: '1.2rem', padding: '20px' }}>Alignment in Progress...</div>
    </div>
  </div >
);

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
      <Suspense fallback={<div className="loading-placeholder" />}>
        <WhyAstroRevo isHidden={isScrolledPastHero} />
      </Suspense>
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
        <Suspense fallback={null}>
          <ScrollingTicker />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <VedicInfoSection />
      </Suspense>

      <section className="marketing-section">
        <Suspense fallback={null}>
          <MarketingMatrix />
        </Suspense>
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

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {!location.pathname.includes('/chat') && (
        <Suspense fallback={null}>
          <DonationSection />
        </Suspense>
      )}

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
            <Suspense fallback={<div className="loading-card" />}>
              <AstroAssistant onLoginClick={onLoginClick} />
            </Suspense>
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
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

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
    if ((isNative || isMobile) && (location.pathname === '/' || (!location.pathname.startsWith('/mobile') && !location.pathname.startsWith('/chat') && !location.pathname.startsWith('/knowledge')))) {
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

  const renderContent = () => {
    if (isMobileRoute) {
      return (
        <div className="app-container mobile-app-container">
          <Suspense fallback={<PageLoading />}>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <Routes>
              <Route path="/mobile" element={<MobileLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<MobileHome />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="reports" element={<MobileReports />} />
                <Route path="planet-trackers" element={<div className="page-content" style={{ paddingTop: '0px' }}><MobilePlanetTrackers /></div>} />
                <Route path="profile" element={<MobileProfile />} />
                <Route path="full-kundli" element={<MobileKundli />} />
                <Route path="matchmaking" element={<MobileMatchmaking />} />
                <Route path="about" element={<div className="page-content" style={{ paddingTop: '0px' }}><AboutUsPage /></div>} />
                <Route path="local-ai" element={<div className="page-content" style={{ paddingTop: '0px' }}><LocalAIChat /></div>} />
                <Route path="a" element={<div className="page-content" style={{ paddingTop: '0px' }}><LocalAIChat /></div>} />
                <Route path="b" element={<ChatPage />} />
                <Route path="bca" element={<div className="page-content" style={{ paddingTop: '60px' }}><BCAAnalysis isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />

                {/* Feature Routes mapped for Mobile Ticker */}
                <Route path="astro-chart" element={<div className="page-content" style={{ paddingTop: '60px' }}><AstroChartPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="panchang" element={<div className="page-content" style={{ paddingTop: '60px' }}><PanchangPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="virtual-pooja" element={<div className="page-content" style={{ paddingTop: '60px' }}><VirtualPooja isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="horoscope" element={<div className="page-content" style={{ paddingTop: '60px' }}><HoroscopePage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="gemstones" element={<div className="page-content" style={{ paddingTop: '60px' }}><GemstonesPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="karmic-reading" element={<div className="page-content" style={{ paddingTop: '60px' }}><KarmicReadingPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="numerology" element={<div className="page-content" style={{ paddingTop: '60px' }}><NumerologyPage isOpen={true} onClose={() => navigate('/mobile/home')} /></div>} />
                <Route path="western-chart" element={<div className="page-content" style={{ paddingTop: '0px' }}><WesternChartPage /></div>} />
                <Route path="sample" element={<div className="page-content" style={{ paddingTop: '0px' }}><SampleChart /></div>} />
                <Route path="tarot-reveal" element={<div className="page-content" style={{ paddingTop: '0px' }}><TarotRevealPage /></div>} />
                <Route path="major-arcana" element={<div className="page-content" style={{ paddingTop: '0px' }}><MajorArcanaPage /></div>} />
                <Route path="tarot-guide" element={<div className="page-content" style={{ paddingTop: '0px' }}><MajorArcanaPage /></div>} />

                {/* New Tracker Route */}
                <Route path="saturn-tracker" element={<div className="page-content" style={{ paddingTop: '0px' }}><SaturnTracker /></div>} />
                <Route path="planetary-strengthening" element={<div className="page-content" style={{ paddingTop: '0px' }}><PlanetaryStrengthening /></div>} />
                <Route path="tracker/mars" element={<div className="page-content" style={{ paddingTop: '0px' }}><MarsTracker /></div>} />
                <Route path="tracker/sun" element={<div className="page-content" style={{ paddingTop: '0px' }}><SunTracker /></div>} />
                <Route path="tracker/moon" element={<div className="page-content" style={{ paddingTop: '0px' }}><MoonTracker /></div>} />
                <Route path="tracker/mercury" element={<div className="page-content" style={{ paddingTop: '0px' }}><MercuryTracker /></div>} />
                <Route path="tracker/jupiter" element={<div className="page-content" style={{ paddingTop: '0px' }}><JupiterTracker /></div>} />
                <Route path="tracker/venus" element={<div className="page-content" style={{ paddingTop: '0px' }}><VenusTracker /></div>} />
                <Route path="tracker/rahu" element={<div className="page-content" style={{ paddingTop: '0px' }}><RahuTracker /></div>} />
                <Route path="tracker/ketu" element={<div className="page-content" style={{ paddingTop: '0px' }}><KetuTracker /></div>} />
                <Route path="life-tracker" element={<div className="page-content" style={{ paddingTop: '0px' }}><LifeTracker /></div>} />

                {/* Profile Content Pages */}
                <Route path="order-history" element={<div className="page-content" style={{ paddingTop: '0px' }}><OrderHistoryPage /></div>} />
                <Route path="chat-history" element={<div className="page-content" style={{ paddingTop: '0px' }}><ChatHistoryPage /></div>} />
                <Route path="settings/language" element={<div className="page-content" style={{ paddingTop: '0px' }}><LanguageSettingsPage /></div>} />
                <Route path="settings/privacy" element={<div className="page-content" style={{ paddingTop: '0px' }}><PrivacySecurityPage /></div>} />

                <Route path="help-support" element={<div className="page-content" style={{ paddingTop: '0px' }}><HelpSupportPage /></div>} />
                <Route path="ambience" element={<div className="page-content" style={{ paddingTop: '0px' }}><AmbienceSelectionPage /></div>} />

                <Route path="blogs" element={<div className="page-content" style={{ paddingTop: '0px' }}><BlogsPage /></div>} />
                <Route path="case-studies" element={<div className="page-content" style={{ paddingTop: '0px' }}><CaseStudiesPage /></div>} />

                {/* Redirects/Placeholders */}
                <Route path="life-reports" element={<MobileReports />} />
                <Route path="gemstone" element={<MobileReports />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      )
    }

    return (
      <div className="app-container">
        <Suspense fallback={<PageLoading />}>
          <StarfieldBackground />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

          {!isChatPage && !location.pathname.includes('/knowledge') && <ChakraEnergy />}
          {!isChatPage && !location.pathname.includes('/knowledge') && (
            <Header
              onLoginClick={() => setIsAuthOpen(true)}
              onMembershipClick={() => setIsDashboardOpen(true)}
            />
          )}
          {!isChatPage && !location.pathname.includes('/knowledge') && <UserOnboarding />}

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
          {!isChatPage && !location.pathname.includes('/knowledge') && <Footer />}
        </Suspense>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <Suspense fallback={null}>
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
      </Suspense>
    </>
  );
}


function App() {
  return (
    <Router>
      <LanguageProvider>
        <MusicProvider>

          <AppContent />
        </MusicProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
