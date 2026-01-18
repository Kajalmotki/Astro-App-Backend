import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AstroWorkflowChart from './components/AstroWorkflowChart';
import ChatInterface from './components/ChatInterface';
import TopQuestions from './components/TopQuestions';
import BirthDetailsForm from './components/BirthDetailsForm';
import LagnaChart from './components/LagnaChart';
import KnowledgeSources from './components/KnowledgeSources';
import SampleChart from './components/SampleChart';
import './App.css';

import { Link } from 'react-router-dom';

const LandingPage = ({ handleQuestionSelect, activeQuestion }) => (
  <main className="content">
    <section className="hero-section">
      <div className="hero-text animate-float">
        <h1 className="gold-text">AstroRevo</h1>
        <p className="subtitle">Ancient Wisdom, Instant Clarity.</p>
      </div>
      <div className="hero-layout">
        <div className="workflow-section">
          <AstroWorkflowChart />
        </div>
      </div>
    </section>

    <section id="questions" className="questions-section">
      <h2 className="section-title">The AstroRevo Chart</h2>
      <p className="section-subtitle">21 pathways to clarity. See what your destiny holds.</p>
      <div className="section-actions">
        <Link to="/sample" className="cta-btn golden-highlight">✨ View Sample Chart ✨</Link>
      </div>
      <TopQuestions onSelect={handleQuestionSelect} />
    </section>

    <section id="chat-window" className="chat-section">
      <ChatInterface initialQuestion={activeQuestion} />
    </section>
  </main>
);

function App() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleQuestionSelect = (question) => {
    setActiveQuestion(question);
    document.getElementById('chat-window')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage handleQuestionSelect={handleQuestionSelect} activeQuestion={activeQuestion} />} />
          <Route path="/knowledge" element={<KnowledgeSources />} />
          <Route path="/sample" element={<SampleChart />} />
        </Routes>
        <footer className="footer">
          <p>&copy; 2026 AstroRevo. Precision. Clarity. Speed.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
