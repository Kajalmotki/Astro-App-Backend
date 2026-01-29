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
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import DonationSection from './components/DonationSection';
import WorkflowCanvas from './components/workflow/WorkflowCanvas';
import './App.css';

const LandingPage = ({ handleQuestionSelect, activeQuestion, onLoginClick }) => (
  <main className="content">
    <section className="marketing-section">
      <MarketingMatrix />
    </section>

    <section className="hero-section">
      <div className="hero-layout">
        <div className="workflow-section">
          <AstroWorkflowChart onLoginClick={onLoginClick} />
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
          <h2 className="side-title gold-text">Always By Your Side, 24/7</h2>
          <div className="side-text-content">
            <p>At AstroRevo, we believe that cosmic guidance should never be limited by timezone or availability. Our AI Assistant is crafted to be your eternal companion, standing ready at every sunrise, every midnight, and every moment of doubt in between.</p>
            <p>We are dedicated to supporting our seekers with unwavering commitment. Whether you need a quick planetary check, a moment of spiritual grounding, or a deep dive into your karmic patterns, we are here to provide instant, precise, and empathetic insights.</p>
            <p className="highlight-text">Value Beyond Prediction:</p>
            <ul className="value-list">
              <li><strong>Real-time Adaptability:</strong> As transits shift, so does our advice, giving you the most current cosmic weather.</li>
              <li><strong>Secure Spiritual Cloud:</strong> Save your birth details and notes securely, building a lifetime map of your growth.</li>
              <li><strong>Personalized Remedies:</strong> Receive actionable Vedic solutions tailored specifically to your unique planetary strengths.</li>
            </ul>
            <p>Our mission is to empower you with the clarity needed to navigate life's complexities with grace and confidence. Your journey is our priority, and we are constantly evolving to bring even deeper cosmic wisdom directly to your fingertips.</p>
          </div>
        </div>

        <div className="mobile-assistant-wrapper">
          <div className="mobile-frame">
            <div className="mobile-notch"></div>
            <div className="mobile-screen">
              <AstroAssistant onLoginClick={onLoginClick} />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

function AppContent() {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const handleQuestionSelect = (question) => {
    setActiveQuestion(question);
    navigate('/chat', { state: { initialQuestion: question } });
  };

  return (
    <div className="app-container">
      <OmRain />
      <Header
        onLoginClick={() => setIsAuthOpen(true)}
        onMembershipClick={() => setIsMembershipOpen(true)}
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
        onMembershipPrompt={() => setIsMembershipOpen(true)}
      />
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
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
