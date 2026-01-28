import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AstroWorkflowChart from './components/AstroWorkflowChart';
import ChatInterface from './components/ChatInterface';
import TopQuestions from './components/TopQuestions';
import ChatPage from './pages/ChatPage';
import KnowledgeSources from './components/KnowledgeSources';
import SampleChart from './components/SampleChart';
import UserOnboarding from './components/UserOnboarding';
import AuthModal from './components/AuthModal';
import MembershipModal from './components/MembershipModal';
import OmRain from './components/OmRain';
import Footer from './components/Footer';
import WorkflowCanvas from './components/workflow/WorkflowCanvas';
import './App.css';

const LandingPage = ({ handleQuestionSelect, activeQuestion, onLoginClick }) => (
  <main className="content">
    <section className="hero-section">
      <div className="hero-layout">
        <div className="workflow-section">
          <AstroWorkflowChart onLoginClick={onLoginClick} />
        </div>
      </div>
    </section>

    <section id="questions" className="questions-section">
      <h2 className="section-title">The AstroRevo Chart</h2>
      <p className="section-subtitle">52 pathways to clarity. See what your destiny holds.</p>
      <div className="section-actions">
        <Link to="/sample" className="cta-btn golden-highlight">✨ View Sample Chart ✨</Link>
      </div>
      <TopQuestions onSelect={handleQuestionSelect} />
    </section>

    <section id="chat-window" className="chat-section">
      <ChatInterface initialQuestion={activeQuestion} onLoginClick={onLoginClick} />
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
